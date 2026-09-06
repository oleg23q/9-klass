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
    public DateTimeOffset UpdatedUtc { get; set; }
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

    public static ProgressStore CreateForProfile(string profileId)
    {
        return new ProgressStore(AppDataPaths.ProgressFileFor(profileId));
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
            GetOrCreateStep(lessonId, stepId).UpdatedUtc = DateTimeOffset.UtcNow;
            Touch(lessonId);
            Save();
        }
    }

    public void SetCompleted(string lessonId, string stepId, bool completed)
    {
        lock (_sync)
        {
            var step = GetOrCreateStep(lessonId, stepId);
            step.IsCompleted = completed;
            step.UpdatedUtc = DateTimeOffset.UtcNow;
            Touch(lessonId);
            Save();
        }
    }

    public void SetSolutionVisible(string lessonId, string stepId, bool visible)
    {
        lock (_sync)
        {
            var step = GetOrCreateStep(lessonId, stepId);
            step.IsSolutionVisible = visible;
            step.UpdatedUtc = DateTimeOffset.UtcNow;
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

    public StudentProgressState ExportSnapshot()
    {
        lock (_sync)
        {
            return Clone(_state);
        }
    }

    public void Merge(StudentProgressState incoming)
    {
        ArgumentNullException.ThrowIfNull(incoming);
        lock (_sync)
        {
            foreach (var (lessonId, incomingLesson) in incoming.Lessons)
            {
                if (!_state.Lessons.TryGetValue(lessonId, out var localLesson))
                {
                    _state.Lessons[lessonId] = Clone(incomingLesson);
                    continue;
                }

                localLesson.LastOpenedUtc = Max(localLesson.LastOpenedUtc, incomingLesson.LastOpenedUtc);
                foreach (var (stepId, incomingStep) in incomingLesson.Steps)
                {
                    if (!localLesson.Steps.TryGetValue(stepId, out var localStep) || IsIncomingNewer(localStep, incomingStep))
                    {
                        localLesson.Steps[stepId] = Clone(incomingStep);
                    }
                }
            }

            Save();
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
        AtomicJsonFile.Write(_path, _state, _options);
    }

    private static bool IsIncomingNewer(StepProgress local, StepProgress incoming)
    {
        if (incoming.UpdatedUtc > local.UpdatedUtc) return true;
        if (incoming.UpdatedUtc < local.UpdatedUtc) return false;
        return string.IsNullOrWhiteSpace(local.Answer) && !string.IsNullOrWhiteSpace(incoming.Answer);
    }

    private static DateTimeOffset Max(DateTimeOffset left, DateTimeOffset right) => left >= right ? left : right;

    private static StudentProgressState Clone(StudentProgressState source) => new()
    {
        Lessons = source.Lessons.ToDictionary(pair => pair.Key, pair => Clone(pair.Value), StringComparer.OrdinalIgnoreCase)
    };

    private static LessonProgress Clone(LessonProgress source) => new()
    {
        LastOpenedUtc = source.LastOpenedUtc,
        Steps = source.Steps.ToDictionary(pair => pair.Key, pair => Clone(pair.Value), StringComparer.OrdinalIgnoreCase)
    };

    private static StepProgress Clone(StepProgress source) => new()
    {
        Answer = source.Answer,
        IsCompleted = source.IsCompleted,
        IsSolutionVisible = source.IsSolutionVisible,
        UpdatedUtc = source.UpdatedUtc
    };

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
