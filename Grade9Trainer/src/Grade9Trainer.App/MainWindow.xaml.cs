using System.Diagnostics;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using Grade9Trainer.Core.Models;
using Grade9Trainer.Core.Services;
using Microsoft.Win32;

namespace Grade9Trainer.App;

public partial class MainWindow : Window
{
    private readonly LessonMarkdownParser _parser = new();
    private readonly ProgressStore _progress = ProgressStore.CreateDefault();
    private readonly string _bundledRoot = Path.Combine(AppContext.BaseDirectory, "Lessons");
    private readonly string _userRoot = AppDataPaths.UserLessonsDirectory;
    private IReadOnlyList<LessonDocument> _lessons = [];
    private LessonDocument? _currentLesson;

    public MainWindow()
    {
        InitializeComponent();
        Loaded += (_, _) => ReloadCatalog();
    }

    private void ReloadCatalog(string? preferredLessonId = null)
    {
        var catalog = new LessonCatalogService(_parser).Load(_bundledRoot, _userRoot);
        _lessons = catalog.Lessons;

        var subjects = _lessons.Select(lesson => lesson.Metadata.Subject).Distinct().ToArray();
        SubjectList.ItemsSource = subjects;
        StatusText.Text = catalog.Warnings.Count == 0
            ? $"Загружено уроков: {_lessons.Count}"
            : $"Уроков: {_lessons.Count}; предупреждений: {catalog.Warnings.Count}";

        if (subjects.Length == 0)
        {
            LessonTitle.Text = "Уроки не найдены";
            LessonMeta.Text = "Добавьте Markdown-урок кнопкой вверху.";
            return;
        }

        SubjectList.SelectedIndex = 0;
        if (!string.IsNullOrWhiteSpace(preferredLessonId))
        {
            var lesson = _lessons.FirstOrDefault(item => item.Metadata.Id == preferredLessonId);
            if (lesson is not null)
            {
                SubjectList.SelectedItem = lesson.Metadata.Subject;
                LessonList.SelectedItem = LessonList.Items.Cast<LessonListItem>()
                    .FirstOrDefault(item => item.Document.Metadata.Id == preferredLessonId);
            }
        }
    }

    private void SubjectList_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (SubjectList.SelectedItem is not string subject) return;
        var items = _lessons
            .Where(lesson => lesson.Metadata.Subject == subject)
            .Select(lesson => new LessonListItem(lesson))
            .ToArray();
        LessonList.ItemsSource = items;
        if (items.Length > 0) LessonList.SelectedIndex = 0;
    }

    private void LessonList_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (LessonList.SelectedItem is LessonListItem item) RenderLesson(item.Document);
    }

    private void RenderLesson(LessonDocument lesson)
    {
        _currentLesson = lesson;
        LessonContent.Children.Clear();
        LessonTitle.Text = lesson.Metadata.Title;
        LessonMeta.Text = $"{lesson.Metadata.Subject} · {lesson.Metadata.DurationMinutes} минут · {lesson.Steps.Count} шагов";

        var theory = new Expander
        {
            Header = "Теория и наглядная схема",
            IsExpanded = true,
            Margin = new Thickness(0, 0, 0, 16),
            FontWeight = FontWeights.SemiBold,
            Content = ReadableText(PlainTextFormatter.Format(lesson.IntroductionMarkdown), 15)
        };
        LessonContent.Children.Add(theory);

        foreach (var step in lesson.Steps)
        {
            LessonContent.Children.Add(CreateStepCard(lesson, step));
        }

        RefreshProgressHeader();
        LessonScroll.ScrollToTop();
        StatusText.Text = "Ответы сохраняются автоматически.";
    }

    private FrameworkElement CreateStepCard(LessonDocument lesson, LessonStep step)
    {
        var state = _progress.GetStep(lesson.Metadata.Id, step.Id);
        var body = new StackPanel { Margin = new Thickness(0, 12, 0, 4) };
        body.Children.Add(ReadableText(PlainTextFormatter.Format(step.PromptMarkdown), 16));
        body.Children.Add(new TextBlock
        {
            Text = "Ваш ответ",
            FontWeight = FontWeights.SemiBold,
            Margin = new Thickness(0, 16, 0, 6),
            Foreground = Brush("#344054")
        });

        var answer = new TextBox
        {
            Text = state.Answer,
            AcceptsReturn = true,
            TextWrapping = TextWrapping.Wrap,
            MinHeight = 88,
            Padding = new Thickness(10),
            VerticalScrollBarVisibility = ScrollBarVisibility.Auto,
            BorderBrush = Brush("#C7CBD8"),
            BorderThickness = new Thickness(1)
        };
        answer.TextChanged += (_, _) =>
        {
            _progress.UpdateAnswer(lesson.Metadata.Id, step.Id, answer.Text);
            StatusText.Text = "Ответ сохранён.";
        };
        body.Children.Add(answer);

        var solution = new Border
        {
            Background = Brush("#ECFDF3"),
            BorderBrush = Brush("#ABEFC6"),
            BorderThickness = new Thickness(1),
            CornerRadius = new CornerRadius(8),
            Padding = new Thickness(14),
            Margin = new Thickness(0, 10, 0, 0),
            Visibility = state.IsSolutionVisible ? Visibility.Visible : Visibility.Collapsed,
            Child = ReadableText(PlainTextFormatter.Format(step.SolutionMarkdown), 15)
        };

        var buttons = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 10, 0, 0) };
        var solutionButton = SecondaryButton(state.IsSolutionVisible ? "Скрыть разбор" : "Показать разбор");
        solutionButton.Click += (_, _) =>
        {
            var visible = solution.Visibility != Visibility.Visible;
            solution.Visibility = visible ? Visibility.Visible : Visibility.Collapsed;
            solutionButton.Content = visible ? "Скрыть разбор" : "Показать разбор";
            _progress.SetSolutionVisible(lesson.Metadata.Id, step.Id, visible);
        };

        var completedButton = SecondaryButton(state.IsCompleted ? "Шаг выполнен" : "Отметить выполненным");
        if (state.IsCompleted)
        {
            completedButton.Background = Brush("#D1FADF");
            completedButton.Foreground = Brush("#067647");
        }
        completedButton.Click += (_, _) =>
        {
            state.IsCompleted = !state.IsCompleted;
            completedButton.Content = state.IsCompleted ? "Шаг выполнен" : "Отметить выполненным";
            completedButton.Background = state.IsCompleted ? Brush("#D1FADF") : Brush("#EEF0F6");
            completedButton.Foreground = state.IsCompleted ? Brush("#067647") : Brush("#344054");
            _progress.SetCompleted(lesson.Metadata.Id, step.Id, state.IsCompleted);
            RefreshProgressHeader();
        };
        buttons.Children.Add(solutionButton);
        buttons.Children.Add(completedButton);
        body.Children.Add(buttons);
        body.Children.Add(solution);

        return new Expander
        {
            Header = $"Шаг {step.Number}. {step.Title}",
            IsExpanded = !state.IsCompleted,
            Margin = new Thickness(0, 0, 0, 12),
            Padding = new Thickness(16, 10, 16, 12),
            Background = Brush("#FAFAFC"),
            BorderBrush = Brush("#E4E7EC"),
            BorderThickness = new Thickness(1),
            FontWeight = FontWeights.SemiBold,
            Content = body
        };
    }

    private void RefreshProgressHeader()
    {
        if (_currentLesson is null)
        {
            LessonProgress.Value = 0;
            return;
        }

        var completed = _progress.CompletedSteps(_currentLesson.Metadata.Id);
        var total = _currentLesson.Steps.Count;
        LessonProgress.Maximum = Math.Max(1, total);
        LessonProgress.Value = completed;
        ProgressText.Text = $"Выполнено {completed} из {total}";
    }

    private void ImportLesson_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog
        {
            Title = "Добавить урок",
            Filter = "Урок Markdown или ZIP (*.md;*.zip)|*.md;*.zip|Markdown (*.md)|*.md|ZIP (*.zip)|*.zip"
        };
        if (dialog.ShowDialog(this) != true) return;

        var result = new LessonImportService(_parser).Import(dialog.FileName, _userRoot);
        MessageBox.Show(
            this,
            string.Join(Environment.NewLine, result.Messages),
            result.ImportedCount > 0 ? "Уроки добавлены" : "Импорт не выполнен",
            MessageBoxButton.OK,
            result.ImportedCount > 0 ? MessageBoxImage.Information : MessageBoxImage.Warning);
        ReloadCatalog();
    }

    private void OpenLessonFolder_Click(object sender, RoutedEventArgs e)
    {
        Directory.CreateDirectory(_userRoot);
        Process.Start(new ProcessStartInfo("explorer.exe", _userRoot) { UseShellExecute = true });
    }

    private static TextBlock ReadableText(string value, double size) => new()
    {
        Text = value,
        TextWrapping = TextWrapping.Wrap,
        FontWeight = FontWeights.Normal,
        FontSize = size,
        LineHeight = size * 1.48,
        Foreground = Brush("#172033")
    };

    private static Button SecondaryButton(string text) => new()
    {
        Content = text,
        Background = Brush("#EEF0F6"),
        Foreground = Brush("#344054"),
        Padding = new Thickness(12, 7, 12, 7)
    };

    private static SolidColorBrush Brush(string hex) =>
        new((Color)ColorConverter.ConvertFromString(hex));

    private sealed record LessonListItem(LessonDocument Document)
    {
        public string DisplayTitle => $"{Document.Metadata.Number:00} · {Document.Metadata.Title.Replace($"Урок {Document.Metadata.Number:00}. ", string.Empty, StringComparison.OrdinalIgnoreCase)}";
    }
}
