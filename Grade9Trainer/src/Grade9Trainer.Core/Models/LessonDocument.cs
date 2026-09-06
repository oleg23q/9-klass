namespace Grade9Trainer.Core.Models;

public sealed record LessonMetadata(
    string Id,
    string Subject,
    int Number,
    string Title,
    int DurationMinutes,
    string Updated,
    string SourcePath);

public sealed record LessonStep(
    string Id,
    int Number,
    string Title,
    string PromptMarkdown,
    string SolutionMarkdown);

public sealed record LessonDocument(
    LessonMetadata Metadata,
    string IntroductionMarkdown,
    IReadOnlyList<LessonStep> Steps);

public sealed record CatalogLoadResult(
    IReadOnlyList<LessonDocument> Lessons,
    IReadOnlyList<string> Warnings);

public sealed record ImportResult(
    int ImportedCount,
    IReadOnlyList<string> Messages);
