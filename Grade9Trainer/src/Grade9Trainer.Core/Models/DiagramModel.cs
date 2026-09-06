namespace Grade9Trainer.Core.Models;

public enum DiagramDirection
{
    TopDown,
    LeftRight
}

public enum DiagramNodeShape
{
    Rectangle,
    Decision
}

public sealed record DiagramNode(
    string Id,
    string Label,
    DiagramNodeShape Shape,
    string Fill,
    string Stroke);

public sealed record DiagramEdge(
    string FromId,
    string ToId,
    string Label,
    bool IsDashed);

public sealed record DiagramModel(
    DiagramDirection Direction,
    IReadOnlyList<DiagramNode> Nodes,
    IReadOnlyList<DiagramEdge> Edges);
