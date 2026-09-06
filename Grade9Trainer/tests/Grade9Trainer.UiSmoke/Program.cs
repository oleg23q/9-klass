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
        if (answer is null || solutionButton is null)
        {
            throw new InvalidOperationException("Первый шаг урока не создал поле ответа и кнопку разбора.");
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
