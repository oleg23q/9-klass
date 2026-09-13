using System.Text;
using System.Text.RegularExpressions;

namespace Grade9Trainer.Core.Services;

public static partial class PlainTextFormatter
{
    public static string Format(string markdown)
    {
        return Format(markdown, includeDiagramFallback: true);
    }

    public static string FormatWithoutDiagrams(string markdown)
    {
        return Format(markdown, includeDiagramFallback: false);
    }

    private static string Format(string markdown, bool includeDiagramFallback)
    {
        if (string.IsNullOrWhiteSpace(markdown)) return string.Empty;

        var output = new List<string>();
        var code = new List<string>();
        var mermaid = new List<string>();
        var displayMath = new List<string>();
        var inFence = false;
        var isMermaid = false;
        var inDisplayMath = false;
        var lines = markdown.Replace("\r\n", "\n", StringComparison.Ordinal).Split('\n');

        for (var index = 0; index < lines.Length; index++)
        {
            var line = lines[index];
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
                    if (includeDiagramFallback) output.AddRange(FormatMermaid(mermaid));
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

            var trimmed = line.Trim();
            if (trimmed == "$$")
            {
                if (inDisplayMath)
                {
                    AddDisplayMath(output, displayMath);
                    displayMath.Clear();
                }

                inDisplayMath = !inDisplayMath;
                continue;
            }

            if (inDisplayMath)
            {
                if (trimmed.Length > 0) displayMath.Add(trimmed);
                continue;
            }

            if (trimmed.StartsWith("$$", StringComparison.Ordinal) &&
                trimmed.EndsWith("$$", StringComparison.Ordinal) &&
                trimmed.Length > 4)
            {
                output.Add(FormatMath(trimmed[2..^2]));
                continue;
            }

            if (index + 1 < lines.Length && IsTableRow(line) && IsTableSeparator(lines[index + 1]))
            {
                var table = new List<string> { line, lines[index + 1] };
                index += 2;
                while (index < lines.Length && IsTableRow(lines[index]))
                {
                    table.Add(lines[index]);
                    index++;
                }

                index--;
                output.AddRange(FormatTable(table));
                continue;
            }

            if (line.Contains("[[Занятия/Начать занятия", StringComparison.OrdinalIgnoreCase)) continue;
            line = CalloutPrefixRegex().Replace(line, string.Empty);
            line = HeadingRegex().Replace(line, string.Empty);
            output.Add(FormatInline(line).TrimEnd());
        }

        if (displayMath.Count > 0) AddDisplayMath(output, displayMath);

        return CollapseBlankLines(string.Join(Environment.NewLine, output)).Trim();
    }

    private static void AddDisplayMath(ICollection<string> output, IReadOnlyCollection<string> lines)
    {
        var formula = FormatMath(string.Join(" ", lines));
        if (formula.Length > 0) output.Add(formula);
    }

    private static IEnumerable<string> FormatTable(IReadOnlyList<string> lines)
    {
        var headers = ParseTableRow(lines[0]);
        var result = new List<string>();

        foreach (var sourceRow in lines.Skip(2))
        {
            var cells = ParseTableRow(sourceRow);
            if (cells.All(string.IsNullOrWhiteSpace)) continue;

            for (var index = 0; index < Math.Min(headers.Length, cells.Length); index++)
            {
                var header = FormatInline(headers[index]).Trim();
                var value = FormatInline(cells[index]).Trim();
                if (header.Equals("Формула", StringComparison.OrdinalIgnoreCase))
                {
                    value = ChemicalDigitsRegex().Replace(value, match => ToSubscript(match.Value));
                }

                var prefix = index == 0 ? "• " : "  ";
                result.Add($"{prefix}{header}: {value}".TrimEnd());
            }

            result.Add(string.Empty);
        }

        if (result.Count > 0 && result[^1].Length == 0) result.RemoveAt(result.Count - 1);
        return result;
    }

    private static bool IsTableRow(string line)
    {
        var trimmed = line.Trim();
        return trimmed.StartsWith('|') && trimmed.EndsWith('|') && trimmed.Count(character => character == '|') >= 2;
    }

    private static bool IsTableSeparator(string line)
    {
        if (!IsTableRow(line)) return false;
        var cells = ParseTableRow(line);
        return cells.Length > 0 && cells.All(cell => TableSeparatorCellRegex().IsMatch(cell.Trim()));
    }

    private static string[] ParseTableRow(string line) =>
        line.Trim().Trim('|').Split('|').Select(cell => cell.Trim()).ToArray();

    private static string FormatInline(string value)
    {
        value = WikiLinkWithTextRegex().Replace(value, "$1");
        value = WikiLinkRegex().Replace(value, "$1");
        value = ImageRegex().Replace(value, "$1");
        value = DecorationRegex().Replace(value, string.Empty);
        value = value.Replace("`", string.Empty, StringComparison.Ordinal);
        return InlineMathRegex().Replace(value, match => FormatMath(match.Groups[1].Value));
    }

    private static string FormatMath(string value)
    {
        var formatted = value.Trim();
        formatted = TextCommandRegex().Replace(formatted, "$1");
        formatted = VectorRegex().Replace(formatted, "$1⃗");
        formatted = formatted
            .Replace("{,}", ",", StringComparison.Ordinal)
            .Replace("\\qquad", "    ", StringComparison.Ordinal)
            .Replace("\\quad", "  ", StringComparison.Ordinal)
            .Replace("\\,", " ", StringComparison.Ordinal)
            .Replace("\\ ", " ", StringComparison.Ordinal)
            .Replace("\\cdot", "·", StringComparison.Ordinal)
            .Replace("\\times", "×", StringComparison.Ordinal)
            .Replace("\\rightarrow", "→", StringComparison.Ordinal)
            .Replace("\\rightleftharpoons", "⇌", StringComparison.Ordinal)
            .Replace("\\leftrightarrow", "⇄", StringComparison.Ordinal)
            .Replace("\\uparrow", "↑", StringComparison.Ordinal)
            .Replace("\\downarrow", "↓", StringComparison.Ordinal)
            .Replace("\\Delta", "Δ", StringComparison.Ordinal)
            .Replace("\\left", string.Empty, StringComparison.Ordinal)
            .Replace("\\right", string.Empty, StringComparison.Ordinal);

        for (var pass = 0; pass < 6; pass++)
        {
            var replaced = FractionRegex().Replace(formatted, match =>
                $"{FormatMathGroup(match.Groups[1].Value)}/{FormatMathGroup(match.Groups[2].Value)}");
            if (replaced == formatted) break;
            formatted = replaced;
        }

        formatted = SqrtRegex().Replace(formatted, match => $"√({match.Groups[1].Value})");
        formatted = SuperscriptRegex().Replace(formatted, match => ConvertScript(match, superscript: true));
        formatted = SubscriptRegex().Replace(formatted, match => ConvertScript(match, superscript: false));
        formatted = UnknownCommandRegex().Replace(formatted, "$1");
        formatted = formatted.Replace("{", string.Empty, StringComparison.Ordinal)
            .Replace("}", string.Empty, StringComparison.Ordinal);
        formatted = AroundEqualsRegex().Replace(formatted, " = ");
        formatted = MultiSpaceRegex().Replace(formatted, " ");
        return formatted.Trim();
    }

    private static string FormatMathGroup(string value)
    {
        var formatted = FormatMath(value);
        return formatted.IndexOfAny(['+', '-', '=', ' ']) >= 0 ? $"({formatted})" : formatted;
    }

    private static string ConvertScript(Match match, bool superscript)
    {
        var source = match.Groups[1].Success ? match.Groups[1].Value : match.Groups[2].Value;
        var converted = superscript ? ToSuperscript(source) : ToSubscript(source);
        if (converted.Length == source.Length) return converted;
        return superscript ? $"^({source})" : $"_({source})";
    }

    private static string ToSubscript(string value) => ConvertCharacters(value, "0123456789+-=()aehijklmnoprstuvxy", "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧ");

    private static string ToSuperscript(string value) => ConvertCharacters(value, "0123456789+-=()", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾");

    private static string ConvertCharacters(string value, string source, string target)
    {
        var result = new StringBuilder(value.Length);
        foreach (var character in value)
        {
            var index = source.IndexOf(char.ToLowerInvariant(character));
            if (index < 0) return value;
            result.Append(target[index]);
        }

        return result.ToString();
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

    [GeneratedRegex(@"\$(?!\$)(.+?)(?<!\$)\$")]
    private static partial Regex InlineMathRegex();

    [GeneratedRegex(@"\\frac\{([^{}]+)\}\{([^{}]+)\}")]
    private static partial Regex FractionRegex();

    [GeneratedRegex(@"\\(?:text|mathrm|operatorname)\{([^{}]*)\}")]
    private static partial Regex TextCommandRegex();

    [GeneratedRegex(@"\\vec\{([^{}]+)\}")]
    private static partial Regex VectorRegex();

    [GeneratedRegex(@"\\sqrt\{([^{}]+)\}")]
    private static partial Regex SqrtRegex();

    [GeneratedRegex(@"\^(?:\{([^{}]+)\}|([A-Za-z0-9+\-=()]))")]
    private static partial Regex SuperscriptRegex();

    [GeneratedRegex(@"_(?:\{([^{}]+)\}|([A-Za-z0-9+\-=()]))")]
    private static partial Regex SubscriptRegex();

    [GeneratedRegex(@"\\([A-Za-z]+)")]
    private static partial Regex UnknownCommandRegex();

    [GeneratedRegex(@"\s*=\s*")]
    private static partial Regex AroundEqualsRegex();

    [GeneratedRegex(@"[ \t]{2,}")]
    private static partial Regex MultiSpaceRegex();

    [GeneratedRegex(@"^:?-{3,}:?$")]
    private static partial Regex TableSeparatorCellRegex();

    [GeneratedRegex(@"(?<=[A-Za-zА-Яа-я\)])\d+")]
    private static partial Regex ChemicalDigitsRegex();

    [GeneratedRegex(@"\b([A-Za-z][A-Za-z0-9_]*)\[""([^""]+)""\]")]
    private static partial Regex MermaidLabelRegex();

    [GeneratedRegex(@"^\s*([A-Za-z][A-Za-z0-9_]*)")]
    private static partial Regex MermaidLeftRegex();

    [GeneratedRegex(@"(?:-->|\.->)\s*([A-Za-z][A-Za-z0-9_]*)")]
    private static partial Regex MermaidRightRegex();
}
