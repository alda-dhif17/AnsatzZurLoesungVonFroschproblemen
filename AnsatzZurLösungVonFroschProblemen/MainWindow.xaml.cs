using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace AnsatzZurLösungVonFroschProblemen
{
    /// <summary>
    /// Interaktionslogik für MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void onEntered(object sender, RoutedEventArgs e)
        {
            List<int> values = new List<int>();
            foreach (String s in this.input.Text.Split(' '))
            {
                values.Add(Convert.ToInt32(s));
            }

            Platform start = new Platform(values[0], 0, values, 3);

            List<Platform> path;
            do
            {
                path = start.hasGoalBeenReached();
            } while (path == null);
            
            Console.WriteLine("Path-Length: " + path.Count);

            Console.Write("Path: ");
            path.Reverse();
            foreach (Platform p in path)
            {
                Console.Write(p.indexInArray + ", ");
            }
            Console.WriteLine();

        }
    }
}
