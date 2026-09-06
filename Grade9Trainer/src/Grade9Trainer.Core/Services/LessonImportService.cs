using System.IO.Compression;
using System.Text;
using Grade9Trainer.Core.Models;

namespace Grade9Trainer.Core.Services;

public sealed class LessonImportService(LessonMarkdownParser parser)
{
    private const long MaximumLessonBytes = 2 * 1024 * 1024;
    private const int MaximumLessonsPerArchive = 50;

    public ImportResult Import(string sourcePath, string userLessonRoot)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourcePath);
        Directory.CreateDirectory(userLessonRoot);

        return Path.GetExtension(sourcePath).ToLowerInvariant() switch
        {
            ".md" => ImportMarkdown(File.ReadAllText(sourcePath, Encoding.UTF8), Path.GetFileName(sourcePath), userLessonRoot),
            ".zip" => ImportArchive(sourcePath, userLessonRoot),
            _ => new ImportResult(0, ["Поддерживаются только файлы .md и .zip."])
        };
    }

    private ImportResult ImportArchive(string sourcePath, string userLessonRoot)
    {
        var imported = 0;
        var messages = new List<string>();
        using var archive = ZipFile.OpenRead(sourcePath);
        var entries = archive.Entries
            .Where(entry => entry.FullName.EndsWith(".md", StringComparison.OrdinalIgnoreCase))
            .Take(MaximumLessonsPerArchive + 1)
            .ToArray();

        if (entries.Length > MaximumLessonsPerArchive)
        {
            return new ImportResult(0, [$"В архиве больше {MaximumLessonsPerArchive} Markdown-файлов."]);
        }

        foreach (var entry in entries)
        {
            if (entry.Length > MaximumLessonBytes)
            {
                messages.Add($"{entry.Name}: файл больше 2 МБ и пропущен.");
                continue;
            }

            try
            {
                using var stream = entry.Open();
                using var reader = new StreamReader(stream, Encoding.UTF8, true);
                var result = ImportMarkdown(reader.ReadToEnd(), entry.Name, userLessonRoot);
                imported += result.ImportedCount;
                messages.AddRange(result.Messages);
            }
            catch (Exception exception) when (exception is IOException or InvalidDataException)
            {
                messages.Add($"{entry.Name}: {exception.Message}");
            }
        }

        if (entries.Length == 0) messages.Add("В архиве не найдено Markdown-уроков.");
        return new ImportResult(imported, messages);
    }

    public ImportResult ImportMarkdown(string markdown, string suggestedName, string userLessonRoot)
    {
        if (Encoding.UTF8.GetByteCount(markdown) > MaximumLessonBytes)
        {
            return new ImportResult(0, [$"{suggestedName}: файл больше 2 МБ."]);
        }

        try
        {
            var lesson = parser.Parse(markdown, suggestedName);
            var subjectFolder = Path.Combine(userLessonRoot, SafeName(lesson.Metadata.Subject));
            Directory.CreateDirectory(subjectFolder);
            var fileName = SafeName(Path.GetFileNameWithoutExtension(suggestedName));
            if (string.IsNullOrWhiteSpace(fileName)) fileName = lesson.Metadata.Id;
            var destination = Path.Combine(subjectFolder, fileName + ".md");
            var temporary = destination + ".importing-" + Guid.NewGuid().ToString("N");
            File.WriteAllText(temporary, markdown, new UTF8Encoding(false));
            File.Move(temporary, destination, true);
            RemoveOlderCopy(lesson.Metadata.Id, userLessonRoot, destination);
            return new ImportResult(1, [$"Добавлен: {lesson.Metadata.Title}"]);
        }
        catch (Exception exception) when (exception is InvalidDataException or IOException or UnauthorizedAccessException)
        {
            return new ImportResult(0, [$"{suggestedName}: {exception.Message}"]);
        }
    }

    private void RemoveOlderCopy(string lessonId, string userLessonRoot, string keepPath)
    {
        foreach (var path in Directory.EnumerateFiles(userLessonRoot, "*.md", SearchOption.AllDirectories))
        {
            if (Path.GetFullPath(path).Equals(Path.GetFullPath(keepPath), StringComparison.OrdinalIgnoreCase)) continue;
            try
            {
                if (parser.ParseFile(path).Metadata.Id == lessonId) File.Delete(path);
            }
            catch (Exception exception) when (exception is IOException or InvalidDataException or UnauthorizedAccessException)
            {
                // A malformed unrelated file must not prevent a valid import.
            }
        }
    }

    private static string SafeName(string value)
    {
        var invalid = Path.GetInvalidFileNameChars();
        return new string(value.Where(character => !invalid.Contains(character)).ToArray()).Trim().TrimEnd('.');
    }
}
