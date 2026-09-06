using System.IO;
using System.Windows;
using System.Windows.Controls;
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
        var answer = Descendants<TextBox>(window).FirstOrDefault();
        var solutionButton = Descendants<Button>(window)
            .FirstOrDefault(button => Equals(button.Content, "Показать разбор"));
        var diagram = Descendants<Grade9Trainer.App.DiagramView>(window).FirstOrDefault();
        var profileList = Descendants<ComboBox>(window).FirstOrDefault(comboBox => comboBox.Name == "ProfileList");
        var editorButton = Descendants<Button>(window).FirstOrDefault(button => Equals(button.Content, "Редактор"));
        if (answer is null || solutionButton is null || diagram is null || profileList?.Items.Count < 1 || editorButton is null)
        {
            throw new InvalidOperationException("Интерфейс не создал поле ответа, схему, профиль ученика или кнопку редактора.");
        }

        answer.Text = "Проверочный ответ интерфейса";
        solutionButton.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
        answer.BringIntoView();
        window.Dispatcher.Invoke(() => { }, DispatcherPriority.ApplicationIdle);
        window.Measure(new Size(window.Width, window.Height));
        window.Arrange(new Rect(0, 0, window.Width, window.Height));
        window.UpdateLayout();

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

        var progressPath = Path.Combine(dataRoot, "progress.json");
        if (!File.Exists(progressPath)) throw new InvalidOperationException("Интерфейс не создал файл прогресса.");
        var saved = new ProgressStore(progressPath).GetStep("physics-01", "physics-01-step-01");
        if (saved.Answer != "Проверочный ответ интерфейса" || !saved.IsSolutionVisible)
        {
            throw new InvalidOperationException("Ответ или раскрытие решения не сохранились через интерфейс.");
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
