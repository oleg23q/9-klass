using System.Text.Json;
using Grade9Trainer.Core.Models;

namespace Grade9Trainer.Core.Services;

public sealed class StudentProfileStore
{
    private readonly string _path;
    private readonly JsonSerializerOptions _options = new() { WriteIndented = true };
    private StudentProfileRegistry _registry;

    public StudentProfileStore(string path)
    {
        _path = path;
        _registry = Load(path);
        EnsureDefaultProfile();
    }

    public static StudentProfileStore CreateDefault() => new(AppDataPaths.ProfilesFile);

    public IReadOnlyList<StudentProfile> Profiles => _registry.Profiles;

    public StudentProfile Current =>
        _registry.Profiles.First(profile => profile.Id.Equals(_registry.CurrentProfileId, StringComparison.OrdinalIgnoreCase));

    public StudentProfile Add(string name, string? id = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        var normalizedName = name.Trim();
        if (_registry.Profiles.Any(profile => profile.Name.Equals(normalizedName, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("Ученик с таким именем уже существует.");
        }

        var profile = new StudentProfile(id ?? "student-" + Guid.NewGuid().ToString("N"), normalizedName, DateTimeOffset.UtcNow);
        _registry.Profiles.Add(profile);
        _registry.CurrentProfileId = profile.Id;
        Save();
        return profile;
    }

    public StudentProfile Ensure(StudentProfile profile)
    {
        var existing = _registry.Profiles.FirstOrDefault(item => item.Id.Equals(profile.Id, StringComparison.OrdinalIgnoreCase));
        if (existing is not null) return existing;
        var uniqueName = UniqueName(profile.Name);
        var added = profile with { Name = uniqueName };
        _registry.Profiles.Add(added);
        Save();
        return added;
    }

    public void Select(string id)
    {
        if (_registry.Profiles.All(profile => !profile.Id.Equals(id, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("Профиль ученика не найден.");
        }

        _registry.CurrentProfileId = id;
        Save();
    }

    private void EnsureDefaultProfile()
    {
        if (_registry.Profiles.Count == 0)
        {
            _registry.Profiles.Add(new StudentProfile("default", "Ученик 1", DateTimeOffset.UtcNow));
        }

        if (_registry.Profiles.All(profile => !profile.Id.Equals(_registry.CurrentProfileId, StringComparison.OrdinalIgnoreCase)))
        {
            _registry.CurrentProfileId = _registry.Profiles[0].Id;
        }

        Save();
    }

    private string UniqueName(string requested)
    {
        var baseName = string.IsNullOrWhiteSpace(requested) ? "Ученик" : requested.Trim();
        var candidate = baseName;
        var suffix = 2;
        while (_registry.Profiles.Any(profile => profile.Name.Equals(candidate, StringComparison.OrdinalIgnoreCase)))
        {
            candidate = $"{baseName} ({suffix++})";
        }

        return candidate;
    }

    private void Save()
    {
        AtomicJsonFile.Write(_path, _registry, _options);
    }

    private static StudentProfileRegistry Load(string path)
    {
        if (!File.Exists(path)) return new StudentProfileRegistry();
        try
        {
            return JsonSerializer.Deserialize<StudentProfileRegistry>(File.ReadAllText(path)) ?? new StudentProfileRegistry();
        }
        catch (JsonException)
        {
            File.Copy(path, path + ".broken-" + DateTime.Now.ToString("yyyyMMdd-HHmmss"), false);
            return new StudentProfileRegistry();
        }
    }
}
