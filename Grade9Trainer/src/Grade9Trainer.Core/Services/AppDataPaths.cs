namespace Grade9Trainer.Core.Services;

public static class AppDataPaths
{
    public static string Root
    {
        get
        {
            var overridePath = Environment.GetEnvironmentVariable("GRADE9_TRAINER_DATA_DIR");
            return !string.IsNullOrWhiteSpace(overridePath)
                ? Path.GetFullPath(overridePath)
                : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Grade9Trainer");
        }
    }

    public static string ProgressFile => Path.Combine(Root, "progress.json");
    public static string UserLessonsDirectory => Path.Combine(Root, "Lessons");
}
