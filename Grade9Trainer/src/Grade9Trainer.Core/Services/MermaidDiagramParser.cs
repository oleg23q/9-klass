using System.Net;
using System.Text.RegularExpressions;
using Grade9Trainer.Core.Models;

namespace Grade9Trainer.Core.Services;

public sealed partial class MermaidDiagramParser
{
    private const string DefaultFill = "#EEF2FF";
    private const string DefaultStroke = "#4F46E5";

    public IReadOnlyList<DiagramModel> ParseFromMarkdown(string markdown)
    {
        if (string.IsNullOrWhiteSpace(markdown)) return [];

        return MermaidBlockRegex().Matches(markdown.Replace("\r\n", "\n", StringComparison.Ordinal))
            .Select(match => ParseBlock(match.Groups[1].Value))
            .Where(model => model.Nodes.Count > 0)
            .ToArray();
    }

    private static DiagramModel ParseBlock(string source)
    {
        var lines = source.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var direction = lines.FirstOrDefault()?.Contains(" LR", StringComparison.OrdinalIgnoreCase) == true
            ? DiagramDirection.LeftRight
            : DiagramDirection.TopDown;
        var definitions = ReadStyleDefinitions(lines);
        var styleByNode = ReadStyleAssignments(lines);
        var nodes = new Dictionary<string, MutableNode>(StringComparer.Ordinal);
        var edges = new List<DiagramEdge>();

        foreach (var line in lines)
        {
            foreach (Match match in NodeDefinitionRegex().Matches(line))
            {
                var id = match.Groups[1].Value;
                var rectangleLabel = match.Groups[2].Value;
                var decisionLabel = match.Groups[3].Value;
                var shape = decisionLabel.Length > 0 ? DiagramNodeShape.Decision : DiagramNodeShape.Rectangle;
                var nodeLabel = decisionLabel.Length > 0 ? decisionLabel : rectangleLabel;
                nodes[id] = new MutableNode(id, CleanLabel(nodeLabel), shape);
            }

            var edge = EdgeRegex().Match(line);
            if (!edge.Success) continue;
            var from = edge.Groups[1].Value;
            var to = edge.Groups[5].Value;
            EnsureNode(nodes, from);
            EnsureNode(nodes, to);
            var label = edge.Groups[3].Success ? edge.Groups[3].Value : edge.Groups[4].Value;
            edges.Add(new DiagramEdge(from, to, CleanLabel(label), edge.Groups[4].Success));
        }

        var immutableNodes = nodes.Values.Select(node =>
        {
            var styleName = styleByNode.GetValueOrDefault(node.Id);
            var style = styleName is not null && definitions.TryGetValue(styleName, out var configured)
                ? configured
                : new DiagramStyle(DefaultFill, DefaultStroke);
            return new DiagramNode(node.Id, node.Label, node.Shape, style.Fill, style.Stroke);
        }).ToArray();

        return new DiagramModel(direction, immutableNodes, edges);
    }

    private static Dictionary<string, DiagramStyle> ReadStyleDefinitions(IEnumerable<string> lines)
    {
        var result = new Dictionary<string, DiagramStyle>(StringComparer.Ordinal);
        foreach (var line in lines)
        {
            var match = ClassDefinitionRegex().Match(line);
            if (!match.Success) continue;
            result[match.Groups[1].Value] = new DiagramStyle(match.Groups[2].Value, match.Groups[3].Value);
        }

        return result;
    }

    private static Dictionary<string, string> ReadStyleAssignments(IEnumerable<string> lines)
    {
        var result = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var line in lines)
        {
            var match = ClassAssignmentRegex().Match(line);
            if (!match.Success) continue;
            foreach (var id in match.Groups[1].Value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            {
                result[id] = match.Groups[2].Value;
            }
        }

        return result;
    }

    private static void EnsureNode(IDictionary<string, MutableNode> nodes, string id)
    {
        if (!nodes.ContainsKey(id)) nodes[id] = new MutableNode(id, id, DiagramNodeShape.Rectangle);
    }

    private static string CleanLabel(string value) =>
        WebUtility.HtmlDecode(value.Replace("<br/>", Environment.NewLine, StringComparison.OrdinalIgnoreCase)).Trim('"', ' ');

    private sealed record MutableNode(string Id, string Label, DiagramNodeShape Shape);
    private sealed record DiagramStyle(string Fill, string Stroke);

    [GeneratedRegex(@"```mermaid\s*\n(.*?)```", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.CultureInvariant)]
    private static partial Regex MermaidBlockRegex();

    [GeneratedRegex(@"\b([A-Za-z][A-Za-z0-9_]*)\s*(?:\[""(.*?)""\]|\{""(.*?)""\})", RegexOptions.CultureInvariant)]
    private static partial Regex NodeDefinitionRegex();

    [GeneratedRegex(@"^\s*([A-Za-z][A-Za-z0-9_]*)(?:\s*(?:\["".*?""\]|\{"".*?""\}))?\s*(?:(-->)\s*(?:\|""(.*?)""\|)?|-\.\s*""(.*?)""\s*\.->)\s*([A-Za-z][A-Za-z0-9_]*)", RegexOptions.CultureInvariant)]
    private static partial Regex EdgeRegex();

    [GeneratedRegex(@"^classDef\s+([A-Za-z][A-Za-z0-9_]*)\s+.*?fill:(#[0-9A-Fa-f]{6}).*?stroke:(#[0-9A-Fa-f]{6})", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex ClassDefinitionRegex();

    [GeneratedRegex(@"^class\s+([A-Za-z0-9_,\s]+)\s+([A-Za-z][A-Za-z0-9_]*)\s*;?", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex ClassAssignmentRegex();
}
