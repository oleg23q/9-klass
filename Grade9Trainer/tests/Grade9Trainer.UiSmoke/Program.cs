using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using Grade9Trainer.Core.Services;
using TrainerApp = Grade9Trainer.App.App;

namespace Grade9Trainer.UiSmoke;

internal static class Program
{
    [STAThread]
    private static int Main(string[] args)
    {
        if (args.Length != 1)
        {
            Console.Error.WriteLine("Usage: Grade9Trainer.UiSmoke <output.png>");
            return 2;
        }

        var outputPath = Path.GetFullPath(args[0]);
        Directory.CreateDirectory(Path.GetDirectoryName(outputPath)!);
        var dataRoot = Path.Combine(Path.GetTempPath(), "Grade9Trainer-UiSmoke-" + Guid.NewGuid().ToString("N"));
        Environment.SetEnvironmentVariable("GRADE9_TRAINER_DATA_DIR", dataRoot);

        var application = new TrainerApp();
        application.InitializeComponent();
        var window = new Grade9Trainer.App.MainWindow
        {
            Width = 1380,
            Height = 860,
            WindowStartupLocation = WindowStartupLocation.Manual,
            Left = -10000,
            Top = -10000,
            ShowInTaskbar = false
        };

        window.Show();
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        var answer = Descendants<TextBox>(window)
            .FirstOrDefault(textBox => Equals(textBox.Tag, "StudentAnswer"));
        var selectableTexts = Descendants<TextBox>(window)
            .Where(textBox => Equals(textBox.Tag, "SelectableLessonText"))
            .ToArray();
        var solutionButton = Descendants<Button>(window)
            .FirstOrDefault(button => Equals(button.Content, "Показать разбор"));
        var stepSolutions = Descendants<Border>(window)
            .Where(border => Equals(border.Tag, "StepSolution"))
            .ToArray();
        var diagram = Descendants<Grade9Trainer.App.DiagramView>(window).FirstOrDefault();
        var profileList = Descendants<ComboBox>(window).FirstOrDefault(comboBox => comboBox.Name == "ProfileList");
        var editorButton = Descendants<Button>(window).FirstOrDefault(button => Equals(button.Content, "Редактор"));
        var lessonList = Descendants<ListBox>(window).FirstOrDefault(listBox => listBox.Name == "LessonList");
        var focusModeButton = Descendants<Button>(window).FirstOrDefault(button => button.Name == "FocusModeButton");
        var subjectPanel = Descendants<Border>(window).FirstOrDefault(border => border.Name == "SubjectPanel");
        var lessonPanel = Descendants<Border>(window).FirstOrDefault(border => border.Name == "LessonPanel");
        var lessonSurface = Descendants<Border>(window).FirstOrDefault(border => border.Name == "LessonSurface");
        if (answer is null || selectableTexts.Length == 0 || solutionButton is null || stepSolutions.Length == 0 || diagram is null ||
            profileList is null || profileList.Items.Count < 1 || editorButton is null ||
            lessonList is null || lessonList.Items.Count < 2 || focusModeButton is null ||
            subjectPanel is null || lessonPanel is null || lessonSurface is null)
        {
            throw new InvalidOperationException("Интерфейс не создал поле ответа, скрытый разбор, схему, профиль ученика, навигацию или режим урока.");
        }
        if (stepSolutions.Any(solution => solution.Visibility != Visibility.Collapsed))
        {
            throw new InvalidOperationException("Разборы нового урока должны быть скрыты по умолчанию.");
        }

        var renderedText = selectableTexts.Select(textBox => textBox.Text ?? string.Empty).ToArray();
        if (renderedText.Any(text => text.Contains("$$", StringComparison.Ordinal) ||
                                     text.Contains("\\frac", StringComparison.Ordinal) ||
                                     text.Split(Environment.NewLine).Any(line => line.TrimStart().StartsWith("|---", StringComparison.Ordinal))))
        {
            throw new InvalidOperationException("Интерфейс показывает служебные символы Markdown или LaTeX.");
        }

        var formattedTable = selectableTexts
            .FirstOrDefault(textBox => textBox.Text.Contains("• Ситуация:", StringComparison.Ordinal));
        if (formattedTable is null)
        {
            throw new InvalidOperationException("Интерфейс не преобразовал Markdown-таблицу в читаемый вид.");
        }

        var copySource = selectableTexts
            .FirstOrDefault(textBox => textBox.Text.Contains("Пассажир", StringComparison.Ordinal));
        if (copySource is null || !copySource.IsReadOnly ||
            copySource.ContextMenu?.Items.OfType<MenuItem>()
                .Any(item => Equals(item.Header, "Копировать выделенное")) != true)
        {
            throw new InvalidOperationException("Учебный текст не доступен для безопасного выделения и копирования.");
        }
        const string copiedWord = "Пассажир";
        copySource.Select(copySource.Text.IndexOf(copiedWord, StringComparison.Ordinal), copiedWord.Length);
        copySource.Copy();
        if (!string.Equals(Clipboard.GetText(), copiedWord, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Выделенный фрагмент учебного текста не скопировался в буфер обмена.");
        }

        solutionButton.BringIntoView();
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        window.Measure(new Size(window.Width, window.Height));
        window.Arrange(new Rect(0, 0, window.Width, window.Height));
        window.UpdateLayout();

        var regularLessonWidth = lessonSurface.ActualWidth;
        focusModeButton.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        window.UpdateLayout();
        if (subjectPanel.Visibility != Visibility.Collapsed || lessonPanel.Visibility != Visibility.Collapsed ||
            lessonSurface.ActualWidth <= regularLessonWidth + 400 || !Equals(focusModeButton.Content, "Вернуть панели"))
        {
            throw new InvalidOperationException("Режим урока не скрыл боковые панели или не расширил материал.");
        }

        var scale = VisualTreeHelper.GetDpi(window);
        var bitmap = new RenderTargetBitmap(
            (int)Math.Ceiling(window.ActualWidth * scale.DpiScaleX),
            (int)Math.Ceiling(window.ActualHeight * scale.DpiScaleY),
            scale.PixelsPerInchX,
            scale.PixelsPerInchY,
            PixelFormats.Pbgra32);
        bitmap.Render(window);

        var encoder = new PngBitmapEncoder();
        encoder.Frames.Add(BitmapFrame.Create(bitmap));
        using (var stream = File.Create(outputPath)) encoder.Save(stream);

        focusModeButton.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        window.UpdateLayout();
        if (subjectPanel.Visibility != Visibility.Visible || lessonPanel.Visibility != Visibility.Visible ||
            !Equals(focusModeButton.Content, "Развернуть урок"))
        {
            throw new InvalidOperationException("Режим урока не вернул боковые панели.");
        }

        RaisePreviewKey(window, Key.F11);
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        if (subjectPanel.Visibility != Visibility.Collapsed || lessonPanel.Visibility != Visibility.Collapsed)
        {
            throw new InvalidOperationException("Клавиша F11 не включила режим урока.");
        }
        RaisePreviewKey(window, Key.Escape);
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        if (subjectPanel.Visibility != Visibility.Visible || lessonPanel.Visibility != Visibility.Visible)
        {
            throw new InvalidOperationException("Клавиша Esc не вернула боковые панели.");
        }

        solutionButton.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        if (stepSolutions[0].Visibility != Visibility.Visible)
        {
            throw new InvalidOperationException("Разбор не открылся по желанию ученика.");
        }

        var hideSolutionButton = Descendants<Button>(window)
            .FirstOrDefault(button => Equals(button.Content, "Скрыть разбор"));
        hideSolutionButton?.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        if (stepSolutions[0].Visibility != Visibility.Collapsed)
        {
            throw new InvalidOperationException("Разбор не скрылся повторным нажатием.");
        }

        answer.Text = "Проверочный ответ интерфейса";
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        lessonList.SelectedIndex = 1;
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        lessonList.SelectedIndex = 0;
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);

        var reopenedSolution = Descendants<Border>(window)
            .FirstOrDefault(border => Equals(border.Tag, "StepSolution") && border.Visibility == Visibility.Visible);
        if (reopenedSolution is null)
        {
            throw new InvalidOperationException("Разбор не открылся для шага с уже сохранённым ответом.");
        }

        var progressPath = Path.Combine(dataRoot, "progress.json");
        if (!File.Exists(progressPath)) throw new InvalidOperationException("Интерфейс не создал файл прогресса.");
        var saved = new ProgressStore(progressPath).GetStep("physics-01", "physics-01-step-01");
        if (saved.Answer != "Проверочный ответ интерфейса")
        {
            throw new InvalidOperationException("Ответ не сохранился через интерфейс.");
        }

        var sourceLesson = Directory.EnumerateFiles(Path.Combine(AppContext.BaseDirectory, "Lessons"), "*.md", SearchOption.AllDirectories).First();
        var editor = new Grade9Trainer.App.LessonEditorWindow(new LessonMarkdownParser(), AppDataPaths.UserLessonsDirectory, sourceLesson)
        {
            Owner = window,
            Left = -10000,
            Top = -10000,
            ShowInTaskbar = false
        };
        editor.Show();
        editor.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        var editorText = Descendants<TextBox>(editor).FirstOrDefault(textBox => textBox.Name == "EditorText");
        var validateButton = Descendants<Button>(editor).FirstOrDefault(button => Equals(button.Content, "Проверить"));
        var validationText = Descendants<TextBlock>(editor).FirstOrDefault(textBlock => textBlock.Name == "ValidationText");
        if (editorText is null || validateButton is null || validationText is null)
        {
            throw new InvalidOperationException("Редактор урока не создал обязательные элементы управления.");
        }
        validateButton.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
        editor.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        if (!validationText.Text.StartsWith("Готово:", StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Редактор не подтвердил корректный встроенный урок.");
        }
        editor.Close();

        window.Close();
        application.Shutdown();
        Directory.Delete(dataRoot, true);
        Console.WriteLine($"Rendered UI smoke screenshot: {outputPath}");
        return 0;
    }

    private static void RaisePreviewKey(Window window, Key key)
    {
        var source = PresentationSource.FromVisual(window)
            ?? throw new InvalidOperationException("Не удалось получить источник ввода окна.");
        window.RaiseEvent(new KeyEventArgs(Keyboard.PrimaryDevice, source, Environment.TickCount, key)
        {
            RoutedEvent = Keyboard.PreviewKeyDownEvent
        });
    }

    private static IEnumerable<T> Descendants<T>(DependencyObject root) where T : DependencyObject
    {
        for (var index = 0; index < VisualTreeHelper.GetChildrenCount(root); index++)
        {
            var child = VisualTreeHelper.GetChild(root, index);
            if (child is T match) yield return match;
            foreach (var descendant in Descendants<T>(child)) yield return descendant;
        }
    }
}
