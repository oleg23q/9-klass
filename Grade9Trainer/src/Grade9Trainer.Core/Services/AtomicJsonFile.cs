using System.Text.Json;

namespace Grade9Trainer.Core.Services;

internal static class AtomicJsonFile
{
    public static void Write<T>(string path, T value, JsonSerializerOptions options)
    {
        var directory = Path.GetDirectoryName(path) ?? ".";
        Directory.CreateDirectory(directory);
        var temporary = path + ".tmp";
        File.WriteAllText(temporary, JsonSerializer.Serialize(value, options));
        File.Move(temporary, path, true);
    }
}
