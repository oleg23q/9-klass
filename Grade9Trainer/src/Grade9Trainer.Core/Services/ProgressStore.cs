using System.Text.Json;

namespace Grade9Trainer.Core.Services;

public sealed class StudentProgressState
{
    public Dictionary<string, LessonProgress> Lessons { get; set; } = new(StringComparer.OrdinalIgnoreCase);
}

public sealed class LessonProgress
{
    public DateTimeOffset LastOpenedUtc { get; set; }
    public Dictionary<string, StepProgress> Steps { get; set; } = new(StringComparer.OrdinalIgnoreCase);
}

public sealed class StepProgress
{
    public string Answer { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public bool IsSolutionVisible { get; set; }
}

public sealed class ProgressStore
{
    private readonly object _sync = new();
    private readonly string _path;
    private readonly JsonSerializerOptions _options = new() { WriteIndented = true };
    private StudentProgressState _state;

    public ProgressStore(string path)
    {
        _path = path;
        _state = Load(path);
    }

    public static ProgressStore CreateDefault()
    {
        return new ProgressStore(AppDataPaths.ProgressFile);
    }

    public StepProgress GetStep(string lessonId, string stepId)
    {
        lock (_sync)
        {
            return GetOrCreateStep(lessonId, stepId);
        }
    }

    public void UpdateAnswer(string lessonId, string stepId, string answer)
    {
        lock (_sync)
        {
            GetOrCreateStep(lessonId, stepId).Answer = answer;
            Touch(lessonId);
            Save();
        }
    }

    public void SetCompleted(string lessonId, string stepId, bool completed)
    {
        lock (_sync)
        {
            GetOrCreateStep(lessonId, stepId).IsCompleted = completed;
            Touch(lessonId);
            Save();
        }
    }

    public void SetSolutionVisible(string lessonId, string stepId, bool visible)
    {
        lock (_sync)
        {
            GetOrCreateStep(lessonId, stepId).IsSolutionVisible = visible;
            Touch(lessonId);
            Save();
        }
    }

    public int CompletedSteps(string lessonId)
    {
        lock (_sync)
        {
            return _state.Lessons.TryGetValue(lessonId, out var lesson)
                ? lesson.Steps.Values.Count(step => step.IsCompleted)
                : 0;
        }
    }

    private StepProgress GetOrCreateStep(string lessonId, string stepId)
    {
        if (!_state.Lessons.TryGetValue(lessonId, out var lesson))
        {
            lesson = new LessonProgress();
            _state.Lessons[lessonId] = lesson;
        }

        if (!lesson.Steps.TryGetValue(stepId, out var step))
        {
            step = new StepProgress();
            lesson.Steps[stepId] = step;
        }

        return step;
    }

    private void Touch(string lessonId)
    {
        if (_state.Lessons.TryGetValue(lessonId, out var lesson))
        {
            lesson.LastOpenedUtc = DateTimeOffset.UtcNow;
        }
    }

    private void Save()
    {
        var directory = Path.GetDirectoryName(_path) ?? ".";
        Directory.CreateDirectory(directory);
        var temporary = _path + ".tmp";
        File.WriteAllText(temporary, JsonSerializer.Serialize(_state, _options));
        File.Move(temporary, _path, true);
    }

    private static StudentProgressState Load(string path)
    {
        if (!File.Exists(path)) return new StudentProgressState();
        try
        {
            return JsonSerializer.Deserialize<StudentProgressState>(File.ReadAllText(path))
                   ?? new StudentProgressState();
        }
        catch (JsonException)
        {
            var backup = path + ".broken-" + DateTime.Now.ToString("yyyyMMdd-HHmmss");
            File.Copy(path, backup, false);
            return new StudentProgressState();
        }
    }
}
