using System.IO;
using System.Text;
using System.Windows;
using Grade9Trainer.Core.Services;

namespace Grade9Trainer.App;

public partial class LessonEditorWindow : Window
{
    private readonly LessonMarkdownParser _parser;
    private readonly string _userLessonRoot;

    public LessonEditorWindow(LessonMarkdownParser parser, string userLessonRoot, string? sourcePath)
    {
        InitializeComponent();
        _parser = parser;
        _userLessonRoot = userLessonRoot;
        EditorText.Text = sourcePath is not null && File.Exists(sourcePath)
            ? File.ReadAllText(sourcePath, Encoding.UTF8)
            : CreateTemplate();
    }

    public string? SavedLessonId { get; private set; }

    private void NewTemplate_Click(object sender, RoutedEventArgs e)
    {
        if (MessageBox.Show(this, "Заменить текущий текст новым шаблоном?", "Новый урок", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
        {
            EditorText.Text = CreateTemplate();
            ValidationText.Text = "Заполните шаблон и нажмите «Проверить».";
        }
    }

    private void Validate_Click(object sender, RoutedEventArgs e)
    {
        ValidateDocument(showSuccess: true);
    }

    private void Save_Click(object sender, RoutedEventArgs e)
    {
        var lesson = ValidateDocument(showSuccess: false);
        if (lesson is null) return;

        var title = lesson.Metadata.Title;
        var prefix = $"Урок {lesson.Metadata.Number:00}. ";
        if (title.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)) title = title[prefix.Length..];
        var suggestedName = $"Урок {lesson.Metadata.Number:00} - {SafeName(title)}.md";
        var result = new LessonImportService(_parser).ImportMarkdown(EditorText.Text, suggestedName, _userLessonRoot);
        if (result.ImportedCount == 0)
        {
            ValidationText.Text = string.Join(" ", result.Messages);
            ValidationText.Foreground = System.Windows.Media.Brushes.Firebrick;
            return;
        }

        SavedLessonId = lesson.Metadata.Id;
        DialogResult = true;
    }

    private Grade9Trainer.Core.Models.LessonDocument? ValidateDocument(bool showSuccess)
    {
        try
        {
            var lesson = _parser.Parse(EditorText.Text, "Редактор.md");
            ValidationText.Foreground = System.Windows.Media.Brushes.SeaGreen;
            ValidationText.Text = $"Готово: {lesson.Metadata.Subject}, урок {lesson.Metadata.Number:00}, шагов: {lesson.Steps.Count}.";
            if (showSuccess) EditorText.Focus();
            return lesson;
        }
        catch (InvalidDataException exception)
        {
            ValidationText.Foreground = System.Windows.Media.Brushes.Firebrick;
            ValidationText.Text = exception.Message;
            return null;
        }
    }

    private static string SafeName(string value)
    {
        var invalid = Path.GetInvalidFileNameChars();
        return new string(value.Where(character => !invalid.Contains(character)).ToArray()).Trim().TrimEnd('.');
    }

    private static string CreateTemplate() => """
        ---
        type: lesson
        edition: student
        updated: 2026-09-06
        subject: Информатика
        lesson: 4
        duration: 45
        status: not-started
        ---

        # Урок 04. Название нового урока

        Краткая цель и теория.

        ## Наглядная схема

        ```mermaid
        flowchart LR
            A["Начало"] --> B["Результат"]
        ```

        ## Тренировка по шагам

        ### Шаг 1. Первое задание

        Текст задания.

        **Ответ ученика**

        > [!solution]- Правильный ответ к шагу 1
        >
        > Объяснение правильного решения.
        """;
}
