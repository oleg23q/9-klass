using Grade9Trainer.Core.Services;
using System.IO.Compression;

var lessonRoot = Path.Combine(AppContext.BaseDirectory, "Lessons");
var parser = new LessonMarkdownParser();
var catalog = new LessonCatalogService(parser).Load(lessonRoot);

Assert(catalog.Warnings.Count == 0, "Каталог содержит предупреждения: " + string.Join("; ", catalog.Warnings));
Assert(catalog.Lessons.Count == 10, $"Ожидалось 10 уроков, найдено {catalog.Lessons.Count}.");
Assert(catalog.Lessons.Sum(lesson => lesson.Steps.Count) == 74, "Ожидалось 74 последовательных шага.");
Assert(catalog.Lessons.Select(lesson => lesson.Metadata.Id).Distinct().Count() == 10, "Идентификаторы уроков должны быть уникальными.");
Assert(catalog.Lessons.All(lesson => lesson.Steps.All(step =>
    !string.IsNullOrWhiteSpace(step.PromptMarkdown) && !string.IsNullOrWhiteSpace(step.SolutionMarkdown))),
    "У каждого шага должны быть задание и решение.");
Assert(catalog.Lessons.Count(lesson => lesson.Metadata.Subject == "Физика") == 3, "Ожидалось 3 урока физики.");
Assert(catalog.Lessons.Count(lesson => lesson.Metadata.Subject == "Химия") == 4, "Ожидалось 4 урока химии.");
Assert(catalog.Lessons.Count(lesson => lesson.Metadata.Subject == "Информатика") == 3, "Ожидалось 3 урока информатики.");

var tempRoot = Path.Combine(Path.GetTempPath(), "Grade9Trainer-SmokeTests-" + Guid.NewGuid().ToString("N"));
var previousDataRoot = Environment.GetEnvironmentVariable("GRADE9_TRAINER_DATA_DIR");
try
{
    Environment.SetEnvironmentVariable("GRADE9_TRAINER_DATA_DIR", tempRoot);
    var progressPath = Path.Combine(tempRoot, "progress.json");
    var firstLesson = catalog.Lessons[0];
    var firstStep = firstLesson.Steps[0];
    var progress = new ProgressStore(progressPath);
    progress.UpdateAnswer(firstLesson.Metadata.Id, firstStep.Id, "Проверочный ответ");
    progress.SetCompleted(firstLesson.Metadata.Id, firstStep.Id, true);

    var reloaded = new ProgressStore(progressPath);
    var saved = reloaded.GetStep(firstLesson.Metadata.Id, firstStep.Id);
    Assert(saved.Answer == "Проверочный ответ", "Ответ должен сохраняться между запусками.");
    Assert(saved.IsCompleted, "Статус шага должен сохраняться между запусками.");

    var importRoot = Path.Combine(tempRoot, "Imported");
    var imported = new LessonImportService(parser).Import(firstLesson.Metadata.SourcePath, importRoot);
    Assert(imported.ImportedCount == 1, "Корректный Markdown-урок должен импортироваться.");
    Assert(new LessonCatalogService(parser).Load(importRoot).Lessons.Count == 1, "Импортированный урок должен читаться из каталога.");

    var zipPath = Path.Combine(tempRoot, "lesson-pack.zip");
    using (var archive = ZipFile.Open(zipPath, ZipArchiveMode.Create))
    {
        archive.CreateEntryFromFile(firstLesson.Metadata.SourcePath, "nested/lesson.md");
    }
    var zipImportRoot = Path.Combine(tempRoot, "ImportedZip");
    var importedZip = new LessonImportService(parser).Import(zipPath, zipImportRoot);
    Assert(importedZip.ImportedCount == 1, "ZIP с корректным Markdown-уроком должен импортироваться.");
    Assert(new LessonCatalogService(parser).Load(zipImportRoot).Lessons.Count == 1, "Урок из ZIP должен появиться в каталоге.");

    var formattedDiagram = PlainTextFormatter.Format(firstLesson.IntroductionMarkdown);
    Assert(formattedDiagram.Contains('→'), "Mermaid-схема должна иметь читаемое офлайн-представление.");

    var diagramParser = new MermaidDiagramParser();
    var diagrams = catalog.Lessons.SelectMany(lesson => diagramParser.ParseFromMarkdown(lesson.IntroductionMarkdown)).ToArray();
    Assert(diagrams.Length == 10, $"Ожидалось 10 графических схем, найдено {diagrams.Length}.");
    Assert(diagrams.All(diagram => diagram.Nodes.Count >= 2 && diagram.Edges.Count >= 1), "Каждая схема должна содержать узлы и связи.");
    Assert(diagrams.SelectMany(diagram => diagram.Nodes).Any(node => node.Shape == Grade9Trainer.Core.Models.DiagramNodeShape.Decision),
        "Фигуры Mermaid-решений должны сохраняться в графической модели.");

    var profileStore = new StudentProfileStore(Path.Combine(tempRoot, "profiles.json"));
    Assert(profileStore.Profiles.Count == 1 && profileStore.Current.Id == "default", "Должен автоматически создаваться профиль первого ученика.");
    var student = profileStore.Add("Анна");
    profileStore.Select(student.Id);
    var studentProgress = ProgressStore.CreateForProfile(student.Id);
    studentProgress.UpdateAnswer(firstLesson.Metadata.Id, firstStep.Id, "Ответ Анны");
    var remoteState = studentProgress.ExportSnapshot();
    remoteState.Lessons[firstLesson.Metadata.Id].Steps[firstStep.Id].Answer = "Ответ после синхронизации";
    remoteState.Lessons[firstLesson.Metadata.Id].Steps[firstStep.Id].UpdatedUtc = DateTimeOffset.UtcNow.AddMinutes(1);
    var packagePath = Path.Combine(tempRoot, "student-progress.zip");
    var packages = new ProfilePackageService();
    packages.Export(packagePath, student, remoteState);
    var importedProfile = packages.Import(packagePath, profileStore);
    Assert(importedProfile.Profile.Id == student.Id, "Пакет прогресса должен сохранять идентификатор ученика.");
    var merged = ProgressStore.CreateForProfile(student.Id).GetStep(firstLesson.Metadata.Id, firstStep.Id);
    Assert(merged.Answer == "Ответ после синхронизации", "При импорте должна побеждать более новая версия ответа.");
}
finally
{
    Environment.SetEnvironmentVariable("GRADE9_TRAINER_DATA_DIR", previousDataRoot);
    if (Directory.Exists(tempRoot)) Directory.Delete(tempRoot, true);
}

Console.WriteLine("Smoke tests passed: 10 lessons, 74 steps, graphical diagrams, student profiles, progress merge, Markdown/ZIP import.");
return;

static void Assert(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}
