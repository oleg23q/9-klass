namespace Grade9Trainer.Core.Models;

public sealed record StudentProfile(string Id, string Name, DateTimeOffset CreatedUtc);

public sealed class StudentProfileRegistry
{
    public string CurrentProfileId { get; set; } = "default";
    public List<StudentProfile> Profiles { get; set; } = [];
}
