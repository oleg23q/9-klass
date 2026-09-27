using Grade9Trainer.Core.Services;
using System.IO.Compression;

var lessonRoot = Path.Combine(AppContext.BaseDirectory, "Lessons");
var parser = new LessonMarkdownParser();
var catalog = new LessonCatalogService(parser).Load(lessonRoot);

Assert(catalog.Warnings.Count == 0, "Каталог содержит предупреждения: " + string.Join("; ", catalog.Warnings));
Assert(catalog.Lessons.Count == 19, $"Ожидалось 19 уроков, найдено {catalog.Lessons.Count}.");
Assert(catalog.Lessons.Sum(lesson => lesson.Steps.Count) == 148, "Ожидалось 148 последовательных шагов.");
Assert(catalog.Lessons.Select(lesson => lesson.Metadata.Id).Distinct().Count() == 19, "Идентификаторы уроков должны быть уникальными.");
Assert(catalog.Lessons.All(lesson => lesson.Steps.All(step =>
    !string.IsNullOrWhiteSpace(step.PromptMarkdown) && !string.IsNullOrWhiteSpace(step.SolutionMarkdown))),
    "У каждого шага должны быть задание и решение.");
Assert(catalog.Lessons.Count(lesson => lesson.Metadata.Subject == "Физика") == 8, "Ожидалось 8 уроков физики.");
Assert(catalog.Lessons.Count(lesson => lesson.Metadata.Subject == "Химия") == 6, "Ожидалось 6 уроков химии с учётом подготовительного урока 00.");
Assert(catalog.Lessons.Count(lesson => lesson.Metadata.Subject == "Информатика") == 5, "Ожидалось 5 уроков информатики.");
Assert(catalog.Lessons.Single(lesson => lesson.Metadata.Subject == "Физика" && lesson.Metadata.Number == 3).Steps.Count == 12,
    "В уроке физики 03 должно быть 12 шагов с графическими задачами.");
Assert(File.Exists(Path.Combine(lessonRoot, "Вложения", "physics03-meeting-graph.svg")),
    "График встречи для урока физики 03 должен входить в комплект.");

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

    var formattedTable = PlainTextFormatter.Format("""
        | Ситуация | Можно считать точкой? | Почему |
        |---|---|---|
        | Поезд между городами | Да | Размер мал по сравнению с расстоянием |
        """);
    Assert(formattedTable.Contains("• Ситуация: Поезд между городами", StringComparison.Ordinal),
        "Markdown-таблица должна превращаться в читаемую карточку.");
    Assert(!formattedTable.Contains("|---", StringComparison.Ordinal) && !formattedTable.Contains("| Ситуация", StringComparison.Ordinal),
        "Служебные разделители Markdown-таблицы не должны показываться ученику.");

    var formattedMath = PlainTextFormatter.Format("""
        Для движения вдоль оси $Ox$:

        $$
        s_x=x-x_0, \qquad v=\frac{l}{t}, \qquad a=2 м/с^2.
        $$
        """);
    Assert(formattedMath.Contains("sₓ = x-x₀", StringComparison.Ordinal), "Индексы формулы должны быть читаемыми.");
    Assert(formattedMath.Contains("v = l/t", StringComparison.Ordinal), "Дробь LaTeX должна отображаться обычной дробной записью.");
    Assert(formattedMath.Contains("м/с²", StringComparison.Ordinal), "Степень единицы измерения должна отображаться верхним индексом.");
    Assert(!formattedMath.Contains('$') && !formattedMath.Contains('\\'),
        "Служебные символы LaTeX не должны показываться ученику.");

    var formattedExtendedMath = PlainTextFormatter.Format(
        @"$\vec{s}$, $\operatorname{len}(a)$, $t\uparrow$, $p\downarrow$, $N_2+3H_2\rightleftharpoons2NH_3$");
    Assert(formattedExtendedMath.Contains("s⃗", StringComparison.Ordinal) &&
           formattedExtendedMath.Contains("len(a)", StringComparison.Ordinal) &&
           formattedExtendedMath.Contains('↑') && formattedExtendedMath.Contains('↓') &&
           formattedExtendedMath.Contains('⇌') && !formattedExtendedMath.Contains('\\'),
        "Векторы, функции и стрелки должны отображаться понятными символами.");

    var formattedUnitFraction = PlainTextFormatter.Format(
        @"$$1\ \text{км/ч}=\frac{1000\ \text{м}}{3600\ \text{с}}=\frac{1}{3{,}6}\ \text{м/с}.$$ ");
    Assert(formattedUnitFraction.Contains("(1000 м)/(3600 с)", StringComparison.Ordinal) &&
           formattedUnitFraction.Contains("1/3,6", StringComparison.Ordinal) &&
           !formattedUnitFraction.Contains("frac", StringComparison.OrdinalIgnoreCase),
        "Дроби с единицами измерения должны преобразовываться без обломков команд LaTeX.");

    var formattedChemistryTable = PlainTextFormatter.Format("""
        | Формула | Состав |
        |---|---|
        | H2O | 2 атома H и 1 атом O |
        """);
    Assert(formattedChemistryTable.Contains("Формула: H₂O", StringComparison.Ordinal),
        "Индексы химической формулы в таблице должны отображаться снизу.");

    var renderedLessonBlocks = catalog.Lessons.SelectMany(lesson =>
        new[] { PlainTextFormatter.FormatWithoutDiagrams(lesson.IntroductionMarkdown) }
            .Concat(lesson.Steps.SelectMany(step => new[]
            {
                PlainTextFormatter.Format(step.PromptMarkdown),
                PlainTextFormatter.Format(step.SolutionMarkdown)
            })));
    foreach (var renderedBlock in renderedLessonBlocks)
    {
        Assert(!renderedBlock.Contains("$$", StringComparison.Ordinal) &&
               !renderedBlock.Contains("\\qquad", StringComparison.Ordinal) &&
               !renderedBlock.Contains("\\frac", StringComparison.Ordinal),
            "Во встроенных уроках не должны оставаться служебные команды LaTeX.");
        Assert(!renderedBlock.Split(Environment.NewLine).Any(line => line.TrimStart().StartsWith("|---", StringComparison.Ordinal)),
            "Во встроенных уроках не должны оставаться разделители Markdown-таблиц.");
    }

    var diagramParser = new MermaidDiagramParser();
    var diagrams = catalog.Lessons.SelectMany(lesson => diagramParser.ParseFromMarkdown(lesson.IntroductionMarkdown)).ToArray();
Assert(diagrams.Length == 19, $"Ожидалось 19 графических схем, найдено {diagrams.Length}.");
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

Console.WriteLine("Smoke tests passed: 19 lessons, 148 steps, graphical diagrams, student profiles, progress merge, Markdown/ZIP import.");
return;

static void Assert(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}
