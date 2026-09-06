using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Grade9Trainer.Core.Models;

namespace Grade9Trainer.Core.Services;

public sealed partial class LessonMarkdownParser
{
    public LessonDocument ParseFile(string path)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);
        return Parse(File.ReadAllText(path, Encoding.UTF8), path);
    }

    public LessonDocument Parse(string markdown, string sourcePath)
    {
        ArgumentNullException.ThrowIfNull(markdown);
        var normalized = markdown.Replace("\r\n", "\n", StringComparison.Ordinal);
        var (frontMatter, body) = ReadFrontMatter(normalized);

        var titleMatch = TitleRegex().Match(body);
        if (!titleMatch.Success)
        {
            throw new InvalidDataException("В уроке отсутствует заголовок первого уровня (# Заголовок).");
        }

        var title = titleMatch.Groups[1].Value.Trim();
        var subject = ValueOrFallback(frontMatter, "subject", GuessSubject(sourcePath));
        var number = ReadInt(frontMatter, "lesson", GuessLessonNumber(title));
        var duration = ReadInt(frontMatter, "duration", 45);
        var updated = ValueOrFallback(frontMatter, "updated", string.Empty);
        var lessonId = $"{SubjectKey(subject)}-{number:00}";

        var trainingMatch = TrainingRegex().Match(body);
        if (!trainingMatch.Success)
        {
            throw new InvalidDataException("В уроке отсутствует раздел «## Тренировка по шагам».");
        }

        var introduction = body[..trainingMatch.Index].Trim();
        var training = body[(trainingMatch.Index + trainingMatch.Length)..];
        var steps = ParseSteps(training, lessonId);
        if (steps.Count == 0)
        {
            throw new InvalidDataException("В разделе тренировки не найдены заголовки «### Шаг N».");
        }

        return new LessonDocument(
            new LessonMetadata(lessonId, subject, number, title, duration, updated, sourcePath),
            introduction,
            steps);
    }

    private static List<LessonStep> ParseSteps(string training, string lessonId)
    {
        var matches = StepRegex().Matches(training);
        var result = new List<LessonStep>(matches.Count);

        for (var index = 0; index < matches.Count; index++)
        {
            var match = matches[index];
            var end = index + 1 < matches.Count ? matches[index + 1].Index : training.Length;
            var content = training[(match.Index + match.Length)..end].Trim();
            var number = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
            var title = match.Groups[2].Value.Trim();

            var answerMarker = content.IndexOf("**Ответ ученика**", StringComparison.OrdinalIgnoreCase);
            var solutionMatch = SolutionRegex().Match(content);
            if (solutionMatch.Success && answerMarker > solutionMatch.Index)
            {
                answerMarker = -1;
            }

            var promptEnd = answerMarker >= 0
                ? answerMarker
                : solutionMatch.Success ? solutionMatch.Index : content.Length;
            var prompt = content[..promptEnd].Trim();
            var solution = solutionMatch.Success
                ? UnquoteCallout(content[(solutionMatch.Index + solutionMatch.Length)..])
                : string.Empty;

            if (string.IsNullOrWhiteSpace(solution))
            {
                throw new InvalidDataException($"У шага {number} отсутствует свёрнутый правильный ответ.");
            }

            result.Add(new LessonStep($"{lessonId}-step-{number:00}", number, title, prompt, solution));
        }

        return result;
    }

    private static string UnquoteCallout(string value)
    {
        var lines = value.Replace("\r\n", "\n", StringComparison.Ordinal).Split('\n');
        return string.Join('\n', lines.Select(line =>
        {
            if (line == ">") return string.Empty;
            if (line.StartsWith("> ", StringComparison.Ordinal)) return line[2..];
            if (line.StartsWith('>')) return line[1..].TrimStart();
            return line;
        })).Trim();
    }

    private static (Dictionary<string, string> Values, string Body) ReadFrontMatter(string text)
    {
        var values = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (!text.StartsWith("---\n", StringComparison.Ordinal))
        {
            return (values, text);
        }

        var end = text.IndexOf("\n---\n", 4, StringComparison.Ordinal);
        if (end < 0)
        {
            return (values, text);
        }

        foreach (var line in text[4..end].Split('\n'))
        {
            var separator = line.IndexOf(':');
            if (separator <= 0) continue;
            values[line[..separator].Trim()] = line[(separator + 1)..].Trim().Trim('"');
        }

        return (values, text[(end + 5)..]);
    }

    private static string ValueOrFallback(Dictionary<string, string> values, string key, string fallback) =>
        values.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value) ? value : fallback;

    private static int ReadInt(Dictionary<string, string> values, string key, int fallback) =>
        values.TryGetValue(key, out var value) && int.TryParse(value, out var parsed) ? parsed : fallback;

    private static int GuessLessonNumber(string title)
    {
        var match = LessonNumberRegex().Match(title);
        return match.Success && int.TryParse(match.Groups[1].Value, out var number) ? number : 0;
    }

    private static string GuessSubject(string sourcePath)
    {
        foreach (var subject in new[] { "Физика", "Химия", "Информатика" })
        {
            if (sourcePath.Contains(subject, StringComparison.OrdinalIgnoreCase)) return subject;
        }

        return "Другое";
    }

    private static string SubjectKey(string subject) => subject.Trim().ToLowerInvariant() switch
    {
        "физика" => "physics",
        "химия" => "chemistry",
        "информатика" => "informatics",
        _ => SlugRegex().Replace(subject.ToLowerInvariant(), "-").Trim('-') is { Length: > 0 } slug ? slug : "lesson"
    };

    [GeneratedRegex(@"(?m)^#\s+(.+?)\s*$", RegexOptions.CultureInvariant)]
    private static partial Regex TitleRegex();

    [GeneratedRegex(@"(?m)^##\s+Тренировка по шагам\s*$", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex TrainingRegex();

    [GeneratedRegex(@"(?m)^###\s+Шаг\s+(\d+)\.\s*(.+?)\s*$", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex StepRegex();

    [GeneratedRegex(@"(?m)^>\s*\[!solution\]-[^\n]*\n?", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex SolutionRegex();

    [GeneratedRegex(@"(?i)урок\s+0*(\d+)", RegexOptions.CultureInvariant)]
    private static partial Regex LessonNumberRegex();

    [GeneratedRegex(@"[^\p{L}\p{Nd}]+", RegexOptions.CultureInvariant)]
    private static partial Regex SlugRegex();
}
