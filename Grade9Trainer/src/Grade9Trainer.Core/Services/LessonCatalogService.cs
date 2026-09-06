using Grade9Trainer.Core.Models;

namespace Grade9Trainer.Core.Services;

public sealed class LessonCatalogService(LessonMarkdownParser parser)
{
    public CatalogLoadResult Load(params string[] roots)
    {
        var lessons = new Dictionary<string, LessonDocument>(StringComparer.OrdinalIgnoreCase);
        var warnings = new List<string>();

        foreach (var root in roots.Where(Directory.Exists))
        {
            foreach (var path in Directory.EnumerateFiles(root, "*.md", SearchOption.AllDirectories)
                         .OrderBy(path => path, StringComparer.OrdinalIgnoreCase))
            {
                try
                {
                    var lesson = parser.ParseFile(path);
                    lessons[lesson.Metadata.Id] = lesson;
                }
                catch (Exception exception) when (exception is IOException or InvalidDataException or UnauthorizedAccessException)
                {
                    warnings.Add($"{Path.GetFileName(path)}: {exception.Message}");
                }
            }
        }

        var ordered = lessons.Values
            .OrderBy(lesson => SubjectOrder(lesson.Metadata.Subject))
            .ThenBy(lesson => lesson.Metadata.Number)
            .ThenBy(lesson => lesson.Metadata.Title, StringComparer.CurrentCultureIgnoreCase)
            .ToArray();

        return new CatalogLoadResult(ordered, warnings);
    }

    public static int SubjectOrder(string subject) => subject switch
    {
        "Физика" => 0,
        "Химия" => 1,
        "Информатика" => 2,
        _ => 99
    };
}
