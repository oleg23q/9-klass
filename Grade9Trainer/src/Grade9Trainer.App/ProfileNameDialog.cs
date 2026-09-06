using System.Windows;
using System.Windows.Controls;

namespace Grade9Trainer.App;

public sealed class ProfileNameDialog : Window
{
    private readonly TextBox _name = new() { MinWidth = 280, Margin = new Thickness(0, 8, 0, 14) };

    public ProfileNameDialog()
    {
        Title = "Новый ученик";
        Width = 380;
        Height = 190;
        ResizeMode = ResizeMode.NoResize;
        WindowStartupLocation = WindowStartupLocation.CenterOwner;
        var ok = new Button { Content = "Создать", IsDefault = true };
        ok.Click += (_, _) =>
        {
            if (string.IsNullOrWhiteSpace(_name.Text)) return;
            DialogResult = true;
        };
        var cancel = new Button { Content = "Отмена", IsCancel = true, Background = System.Windows.Media.Brushes.DimGray };
        var buttons = new StackPanel { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Right };
        buttons.Children.Add(cancel);
        buttons.Children.Add(ok);
        var body = new StackPanel { Margin = new Thickness(20) };
        body.Children.Add(new TextBlock { Text = "Имя ученика", FontWeight = FontWeights.SemiBold });
        body.Children.Add(_name);
        body.Children.Add(buttons);
        Content = body;
        Loaded += (_, _) => _name.Focus();
    }

    public string ProfileName => _name.Text.Trim();
}
