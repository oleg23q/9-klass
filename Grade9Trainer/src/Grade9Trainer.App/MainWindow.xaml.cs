using System.Diagnostics;
using System.IO;
using System.Text.Json;
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
    private readonly MermaidDiagramParser _diagramParser = new();
    private readonly StudentProfileStore _profiles = StudentProfileStore.CreateDefault();
    private readonly ProfilePackageService _profilePackages = new();
    private readonly string _bundledRoot = Path.Combine(AppContext.BaseDirectory, "Lessons");
    private readonly string _userRoot = AppDataPaths.UserLessonsDirectory;
    private ProgressStore _progress;
    private IReadOnlyList<LessonDocument> _lessons = [];
    private LessonDocument? _currentLesson;
    private bool _updatingProfiles;

    public MainWindow()
    {
        InitializeComponent();
        _progress = ProgressStore.CreateForProfile(_profiles.Current.Id);
        Loaded += (_, _) =>
        {
            ReloadProfiles();
            ReloadCatalog();
        };
    }

    private void ReloadProfiles(string? preferredProfileId = null)
    {
        _updatingProfiles = true;
        ProfileList.ItemsSource = null;
        ProfileList.ItemsSource = _profiles.Profiles;
        ProfileList.SelectedItem = _profiles.Profiles.FirstOrDefault(profile =>
            profile.Id.Equals(preferredProfileId ?? _profiles.Current.Id, StringComparison.OrdinalIgnoreCase));
        _updatingProfiles = false;
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

        var theoryBody = new StackPanel();
        var introduction = PlainTextFormatter.FormatWithoutDiagrams(lesson.IntroductionMarkdown);
        if (!string.IsNullOrWhiteSpace(introduction)) theoryBody.Children.Add(ReadableText(introduction, 15));
        foreach (var diagram in _diagramParser.ParseFromMarkdown(lesson.IntroductionMarkdown))
        {
            theoryBody.Children.Add(new ScrollViewer
            {
                HorizontalScrollBarVisibility = ScrollBarVisibility.Auto,
                VerticalScrollBarVisibility = ScrollBarVisibility.Disabled,
                Content = new DiagramView(diagram)
            });
        }

        var theory = new Expander
        {
            Header = "Теория и наглядная схема",
            IsExpanded = true,
            Margin = new Thickness(0, 0, 0, 16),
            FontWeight = FontWeights.SemiBold,
            Content = theoryBody
        };
        LessonContent.Children.Add(theory);

        foreach (var step in lesson.Steps)
        {
            LessonContent.Children.Add(CreateStepCard(lesson, step));
        }

        RefreshProgressHeader();
        LessonScroll.ScrollToTop();
        StatusText.Text = $"Ответы ученика «{_profiles.Current.Name}» сохраняются автоматически.";
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

    private void OpenEditor_Click(object sender, RoutedEventArgs e)
    {
        var editor = new LessonEditorWindow(_parser, _userRoot, _currentLesson?.Metadata.SourcePath)
        {
            Owner = this
        };
        if (editor.ShowDialog() == true)
        {
            ReloadCatalog(editor.SavedLessonId);
            StatusText.Text = "Урок сохранён в пользовательской библиотеке.";
        }
    }

    private void ProfileList_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (_updatingProfiles || ProfileList.SelectedItem is not StudentProfile profile) return;
        _profiles.Select(profile.Id);
        _progress = ProgressStore.CreateForProfile(profile.Id);
        if (_currentLesson is not null) RenderLesson(_currentLesson);
        StatusText.Text = $"Выбран ученик: {profile.Name}.";
    }

    private void AddProfile_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new ProfileNameDialog { Owner = this };
        if (dialog.ShowDialog() != true) return;
        try
        {
            var profile = _profiles.Add(dialog.ProfileName);
            _progress = ProgressStore.CreateForProfile(profile.Id);
            ReloadProfiles(profile.Id);
            if (_currentLesson is not null) RenderLesson(_currentLesson);
            StatusText.Text = $"Создан профиль «{profile.Name}».";
        }
        catch (InvalidOperationException exception)
        {
            MessageBox.Show(this, exception.Message, "Профиль не создан", MessageBoxButton.OK, MessageBoxImage.Warning);
        }
    }

    private void ExportProfile_Click(object sender, RoutedEventArgs e)
    {
        var profile = _profiles.Current;
        var dialog = new SaveFileDialog
        {
            Title = "Экспорт прогресса ученика",
            Filter = "Пакет прогресса (*.zip)|*.zip",
            FileName = $"Прогресс - {SafeFileName(profile.Name)} - {DateTime.Today:yyyy-MM-dd}.zip"
        };
        if (dialog.ShowDialog(this) != true) return;
        try
        {
            _profilePackages.Export(dialog.FileName, profile, _progress.ExportSnapshot());
            StatusText.Text = $"Прогресс ученика «{profile.Name}» экспортирован.";
        }
        catch (Exception exception) when (exception is IOException or UnauthorizedAccessException)
        {
            MessageBox.Show(this, exception.Message, "Экспорт не выполнен", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void ImportProfile_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog
        {
            Title = "Импорт прогресса ученика",
            Filter = "Пакет прогресса (*.zip)|*.zip"
        };
        if (dialog.ShowDialog(this) != true) return;
        try
        {
            var result = _profilePackages.Import(dialog.FileName, _profiles);
            _profiles.Select(result.Profile.Id);
            _progress = ProgressStore.CreateForProfile(result.Profile.Id);
            ReloadProfiles(result.Profile.Id);
            if (_currentLesson is not null) RenderLesson(_currentLesson);
            StatusText.Text = $"Импортирован прогресс «{result.Profile.Name}»: уроков {result.MergedLessons}.";
        }
        catch (Exception exception) when (exception is IOException or InvalidDataException or UnauthorizedAccessException or JsonException)
        {
            MessageBox.Show(this, exception.Message, "Импорт не выполнен", MessageBoxButton.OK, MessageBoxImage.Error);
        }
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

    private static string SafeFileName(string value)
    {
        var invalid = Path.GetInvalidFileNameChars();
        return new string(value.Where(character => !invalid.Contains(character)).ToArray()).Trim().TrimEnd('.');
    }

    private sealed record LessonListItem(LessonDocument Document)
    {
        public string DisplayTitle => $"{Document.Metadata.Number:00} · {Document.Metadata.Title.Replace($"Урок {Document.Metadata.Number:00}. ", string.Empty, StringComparison.OrdinalIgnoreCase)}";
    }
}
