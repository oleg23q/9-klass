using System.Text;
using System.Text.RegularExpressions;

namespace Grade9Trainer.Core.Services;

public static partial class PlainTextFormatter
{
    public static string Format(string markdown)
    {
        if (string.IsNullOrWhiteSpace(markdown)) return string.Empty;

        var output = new List<string>();
        var code = new List<string>();
        var mermaid = new List<string>();
        var inFence = false;
        var isMermaid = false;

        foreach (var sourceLine in markdown.Replace("\r\n", "\n", StringComparison.Ordinal).Split('\n'))
        {
            var line = sourceLine;
            if (line.StartsWith("```", StringComparison.Ordinal))
            {
                if (!inFence)
                {
                    inFence = true;
                    isMermaid = line.Contains("mermaid", StringComparison.OrdinalIgnoreCase);
                    continue;
                }

                if (isMermaid)
                {
                    output.AddRange(FormatMermaid(mermaid));
                    mermaid.Clear();
                }
                else if (code.Count > 0)
                {
                    output.Add(string.Join(Environment.NewLine, code.Select(value => "    " + value)));
                    code.Clear();
                }

                inFence = false;
                isMermaid = false;
                continue;
            }

            if (inFence)
            {
                if (isMermaid) mermaid.Add(line);
                else code.Add(line);
                continue;
            }

            if (line.Contains("[[Занятия/Начать занятия", StringComparison.OrdinalIgnoreCase)) continue;
            line = CalloutPrefixRegex().Replace(line, string.Empty);
            line = HeadingRegex().Replace(line, string.Empty);
            line = WikiLinkWithTextRegex().Replace(line, "$1");
            line = WikiLinkRegex().Replace(line, "$1");
            line = ImageRegex().Replace(line, "$1");
            line = DecorationRegex().Replace(line, string.Empty);
            line = line.Replace("`", string.Empty, StringComparison.Ordinal);
            output.Add(line.TrimEnd());
        }

        return CollapseBlankLines(string.Join(Environment.NewLine, output)).Trim();
    }

    private static IEnumerable<string> FormatMermaid(IReadOnlyList<string> lines)
    {
        var labels = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var line in lines)
        {
            foreach (Match match in MermaidLabelRegex().Matches(line))
            {
                labels[match.Groups[1].Value] = match.Groups[2].Value;
            }
        }

        var edges = new List<string>();
        foreach (var line in lines)
        {
            var left = MermaidLeftRegex().Match(line);
            var right = MermaidRightRegex().Match(line);
            if (!left.Success || !right.Success) continue;
            if (!labels.TryGetValue(left.Groups[1].Value, out var from)) continue;
            if (!labels.TryGetValue(right.Groups[1].Value, out var to)) continue;
            edges.Add($"  • {from}  →  {to}");
        }

        if (edges.Count == 0)
        {
            edges.AddRange(labels.Values.Select(label => $"  • {label}"));
        }

        return new[] { "Схема:" }.Concat(edges);
    }

    private static string CollapseBlankLines(string value)
    {
        while (value.Contains($"{Environment.NewLine}{Environment.NewLine}{Environment.NewLine}", StringComparison.Ordinal))
        {
            value = value.Replace(
                $"{Environment.NewLine}{Environment.NewLine}{Environment.NewLine}",
                $"{Environment.NewLine}{Environment.NewLine}",
                StringComparison.Ordinal);
        }

        return value;
    }

    [GeneratedRegex(@"^>\s*\[![^\]]+\]-?\s*", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex CalloutPrefixRegex();

    [GeneratedRegex(@"^#{1,6}\s+")]
    private static partial Regex HeadingRegex();

    [GeneratedRegex(@"\[\[[^\]|]+\|([^\]]+)\]\]")]
    private static partial Regex WikiLinkWithTextRegex();

    [GeneratedRegex(@"\[\[([^\]]+)\]\]")]
    private static partial Regex WikiLinkRegex();

    [GeneratedRegex(@"!\[([^\]]*)\]\([^\)]+\)")]
    private static partial Regex ImageRegex();

    [GeneratedRegex(@"(\*\*|__|~~)")]
    private static partial Regex DecorationRegex();

    [GeneratedRegex(@"\b([A-Za-z][A-Za-z0-9_]*)\[""([^""]+)""\]")]
    private static partial Regex MermaidLabelRegex();

    [GeneratedRegex(@"^\s*([A-Za-z][A-Za-z0-9_]*)")]
    private static partial Regex MermaidLeftRegex();

    [GeneratedRegex(@"(?:-->|\.->)\s*([A-Za-z][A-Za-z0-9_]*)")]
    private static partial Regex MermaidRightRegex();
}
