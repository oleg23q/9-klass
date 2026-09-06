using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using Grade9Trainer.Core.Models;

namespace Grade9Trainer.App;

public sealed class DiagramView : Border
{
    private const double NodeWidth = 184;
    private const double NodeHeight = 72;
    private const double HorizontalGap = 72;
    private const double VerticalGap = 72;
    private const double OuterMargin = 28;

    public DiagramView(DiagramModel model)
    {
        Background = Brush("#FAFBFF");
        BorderBrush = Brush("#D9DDF0");
        BorderThickness = new Thickness(1);
        CornerRadius = new CornerRadius(10);
        Padding = new Thickness(8);
        Margin = new Thickness(0, 12, 0, 0);
        HorizontalAlignment = HorizontalAlignment.Left;

        Child = BuildCanvas(model);
    }

    private static Canvas BuildCanvas(DiagramModel model)
    {
        var levels = BuildLevels(model);
        var groups = model.Nodes
            .GroupBy(node => levels.GetValueOrDefault(node.Id))
            .OrderBy(group => group.Key)
            .Select(group => group.ToArray())
            .ToArray();
        var maxAcross = Math.Max(1, groups.Max(group => group.Length));
        var isLeftRight = model.Direction == DiagramDirection.LeftRight;
        var canvasWidth = isLeftRight
            ? OuterMargin * 2 + groups.Length * NodeWidth + Math.Max(0, groups.Length - 1) * HorizontalGap
            : OuterMargin * 2 + maxAcross * NodeWidth + Math.Max(0, maxAcross - 1) * HorizontalGap;
        var canvasHeight = isLeftRight
            ? OuterMargin * 2 + maxAcross * NodeHeight + Math.Max(0, maxAcross - 1) * VerticalGap
            : OuterMargin * 2 + groups.Length * NodeHeight + Math.Max(0, groups.Length - 1) * VerticalGap;
        var canvas = new Canvas { Width = canvasWidth, Height = canvasHeight, ClipToBounds = false };
        var positions = new Dictionary<string, Point>(StringComparer.Ordinal);

        for (var levelIndex = 0; levelIndex < groups.Length; levelIndex++)
        {
            var group = groups[levelIndex];
            var acrossLength = isLeftRight
                ? group.Length * NodeHeight + Math.Max(0, group.Length - 1) * VerticalGap
                : group.Length * NodeWidth + Math.Max(0, group.Length - 1) * HorizontalGap;
            var acrossAvailable = isLeftRight ? canvasHeight - OuterMargin * 2 : canvasWidth - OuterMargin * 2;
            var offset = OuterMargin + Math.Max(0, (acrossAvailable - acrossLength) / 2);

            for (var index = 0; index < group.Length; index++)
            {
                var x = isLeftRight
                    ? OuterMargin + levelIndex * (NodeWidth + HorizontalGap)
                    : offset + index * (NodeWidth + HorizontalGap);
                var y = isLeftRight
                    ? offset + index * (NodeHeight + VerticalGap)
                    : OuterMargin + levelIndex * (NodeHeight + VerticalGap);
                positions[group[index].Id] = new Point(x, y);
            }
        }

        foreach (var edge in model.Edges)
        {
            if (!positions.TryGetValue(edge.FromId, out var from) || !positions.TryGetValue(edge.ToId, out var to)) continue;
            DrawEdge(canvas, edge, from, to, isLeftRight);
        }

        foreach (var node in model.Nodes)
        {
            if (positions.TryGetValue(node.Id, out var position)) DrawNode(canvas, node, position);
        }

        return canvas;
    }

    private static Dictionary<string, int> BuildLevels(DiagramModel model)
    {
        var incoming = model.Nodes.ToDictionary(node => node.Id, _ => 0, StringComparer.Ordinal);
        foreach (var edge in model.Edges)
        {
            if (incoming.ContainsKey(edge.ToId)) incoming[edge.ToId]++;
        }

        var levels = model.Nodes.ToDictionary(node => node.Id, _ => 0, StringComparer.Ordinal);
        var queue = new Queue<string>(model.Nodes.Where(node => incoming[node.Id] == 0).Select(node => node.Id));
        var visited = new HashSet<string>(StringComparer.Ordinal);
        while (queue.TryDequeue(out var id))
        {
            if (!visited.Add(id)) continue;
            foreach (var edge in model.Edges.Where(edge => edge.FromId == id))
            {
                levels[edge.ToId] = Math.Max(levels[edge.ToId], levels[id] + 1);
                incoming[edge.ToId]--;
                if (incoming[edge.ToId] <= 0) queue.Enqueue(edge.ToId);
            }
        }

        foreach (var node in model.Nodes.Where(node => !visited.Contains(node.Id)))
        {
            levels[node.Id] = levels.Values.DefaultIfEmpty().Max() + 1;
        }

        return levels;
    }

    private static void DrawNode(Canvas canvas, DiagramNode node, Point position)
    {
        if (node.Shape == DiagramNodeShape.Decision)
        {
            var diamond = new Polygon
            {
                Points = new PointCollection
                {
                    new(NodeWidth / 2, 0), new(NodeWidth, NodeHeight / 2),
                    new(NodeWidth / 2, NodeHeight), new(0, NodeHeight / 2)
                },
                Fill = Brush(node.Fill),
                Stroke = Brush(node.Stroke),
                StrokeThickness = 2
            };
            Canvas.SetLeft(diamond, position.X);
            Canvas.SetTop(diamond, position.Y);
            canvas.Children.Add(diamond);
        }
        else
        {
            var box = new Border
            {
                Width = NodeWidth,
                Height = NodeHeight,
                CornerRadius = new CornerRadius(9),
                Background = Brush(node.Fill),
                BorderBrush = Brush(node.Stroke),
                BorderThickness = new Thickness(2)
            };
            Canvas.SetLeft(box, position.X);
            Canvas.SetTop(box, position.Y);
            canvas.Children.Add(box);
        }

        var label = new TextBlock
        {
            Width = NodeWidth - 28,
            Height = NodeHeight - 12,
            Text = node.Label,
            TextAlignment = TextAlignment.Center,
            TextWrapping = TextWrapping.Wrap,
            Foreground = Brush("#172033"),
            FontSize = 13,
            FontWeight = FontWeights.SemiBold
        };
        Canvas.SetLeft(label, position.X + 14);
        Canvas.SetTop(label, position.Y + 6);
        canvas.Children.Add(label);
    }

    private static void DrawEdge(Canvas canvas, DiagramEdge edge, Point from, Point to, bool leftRight)
    {
        var start = leftRight
            ? new Point(from.X + NodeWidth, from.Y + NodeHeight / 2)
            : new Point(from.X + NodeWidth / 2, from.Y + NodeHeight);
        var end = leftRight
            ? new Point(to.X, to.Y + NodeHeight / 2)
            : new Point(to.X + NodeWidth / 2, to.Y);
        var line = new Line
        {
            X1 = start.X,
            Y1 = start.Y,
            X2 = end.X,
            Y2 = end.Y,
            Stroke = Brush("#68708A"),
            StrokeThickness = 2,
            StrokeDashArray = edge.IsDashed ? new DoubleCollection { 5, 4 } : null
        };
        canvas.Children.Add(line);

        var angle = Math.Atan2(end.Y - start.Y, end.X - start.X);
        const double arrowLength = 10;
        const double arrowSpread = 0.55;
        var arrow = new Polygon
        {
            Points = new PointCollection
            {
                end,
                new(end.X - arrowLength * Math.Cos(angle - arrowSpread), end.Y - arrowLength * Math.Sin(angle - arrowSpread)),
                new(end.X - arrowLength * Math.Cos(angle + arrowSpread), end.Y - arrowLength * Math.Sin(angle + arrowSpread))
            },
            Fill = Brush("#68708A")
        };
        canvas.Children.Add(arrow);

        if (string.IsNullOrWhiteSpace(edge.Label)) return;
        var label = new Border
        {
            Background = Brushes.White,
            Padding = new Thickness(4, 1, 4, 1),
            Child = new TextBlock { Text = edge.Label, FontSize = 11, Foreground = Brush("#475467") }
        };
        Canvas.SetLeft(label, (start.X + end.X) / 2 - 34);
        Canvas.SetTop(label, (start.Y + end.Y) / 2 - 11);
        canvas.Children.Add(label);
    }

    private static SolidColorBrush Brush(string value)
    {
        try
        {
            return new SolidColorBrush((Color)ColorConverter.ConvertFromString(value));
        }
        catch (FormatException)
        {
            return new SolidColorBrush((Color)ColorConverter.ConvertFromString(DefaultColor));
        }
    }

    private const string DefaultColor = "#4F46E5";
}
