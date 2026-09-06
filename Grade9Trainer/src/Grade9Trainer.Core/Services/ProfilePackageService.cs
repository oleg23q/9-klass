using System.IO.Compression;
using System.Text.Json;
using Grade9Trainer.Core.Models;

namespace Grade9Trainer.Core.Services;

public sealed record ProfileImportResult(StudentProfile Profile, int MergedLessons);

public sealed class ProfilePackageService
{
    private const int CurrentSchemaVersion = 1;
    private readonly JsonSerializerOptions _options = new() { WriteIndented = true, PropertyNameCaseInsensitive = true };

    public void Export(string destinationPath, StudentProfile profile, StudentProgressState progress)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(destinationPath);
        var directory = Path.GetDirectoryName(destinationPath) ?? ".";
        Directory.CreateDirectory(directory);
        var temporary = destinationPath + ".tmp";
        if (File.Exists(temporary)) File.Delete(temporary);

        using (var archive = ZipFile.Open(temporary, ZipArchiveMode.Create))
        {
            WriteJson(archive, "profile.json", new ProfilePackageManifest(CurrentSchemaVersion, DateTimeOffset.UtcNow, profile));
            WriteJson(archive, "progress.json", progress);
        }

        File.Move(temporary, destinationPath, true);
    }

    public ProfileImportResult Import(string sourcePath, StudentProfileStore profiles)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourcePath);
        using var archive = ZipFile.OpenRead(sourcePath);
        var manifest = ReadJson<ProfilePackageManifest>(archive, "profile.json");
        if (manifest.SchemaVersion != CurrentSchemaVersion)
        {
            throw new InvalidDataException($"Версия пакета {manifest.SchemaVersion} не поддерживается.");
        }

        var state = ReadJson<StudentProgressState>(archive, "progress.json");
        var profile = profiles.Ensure(manifest.Profile);
        var progress = ProgressStore.CreateForProfile(profile.Id);
        progress.Merge(state);
        return new ProfileImportResult(profile, state.Lessons.Count);
    }

    private void WriteJson<T>(ZipArchive archive, string name, T value)
    {
        var entry = archive.CreateEntry(name, CompressionLevel.Optimal);
        using var stream = entry.Open();
        JsonSerializer.Serialize(stream, value, _options);
    }

    private T ReadJson<T>(ZipArchive archive, string name)
    {
        var entry = archive.GetEntry(name) ?? throw new InvalidDataException($"В пакете отсутствует {name}.");
        if (entry.Length > 20 * 1024 * 1024) throw new InvalidDataException($"Файл {name} слишком большой.");
        using var stream = entry.Open();
        return JsonSerializer.Deserialize<T>(stream, _options) ?? throw new InvalidDataException($"Не удалось прочитать {name}.");
    }

    private sealed record ProfilePackageManifest(int SchemaVersion, DateTimeOffset ExportedUtc, StudentProfile Profile);
}
