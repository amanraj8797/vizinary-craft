
import { useState, useEffect } from 'react';
import { ChartConfig, ChartOptions } from '@/components/visualization/ChartOptions';
import { ChartDisplay } from '@/components/visualization/ChartDisplay';
import { DataTable } from '@/components/data/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle } from 'lucide-react';

interface DashboardProps {
  data: any[];
}

export function Dashboard({ data }: DashboardProps) {
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [activeTab, setActiveTab] = useState<string>('data');
  const [editingChart, setEditingChart] = useState<number | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);

  // Add a default chart when data is first loaded
  useEffect(() => {
    if (data.length > 0 && charts.length === 0) {
      const columns = Object.keys(data[0]);
      // Try to find numeric column for Y axis
      const numericColumn = columns.find(col => 
        !isNaN(Number(data[0][col])) && 
        typeof data[0][col] !== 'boolean'
      ) || columns[1] || columns[0];
      
      const defaultConfig: ChartConfig = {
        type: 'bar',
        xAxis: columns[0] || '',
        yAxis: numericColumn || '',
        title: 'Data Overview'
      };
      
      setCharts([defaultConfig]);
      setChartConfig(defaultConfig);
    }
  }, [data]);

  const handleAddChart = () => {
    if (data.length === 0) {
      toast({
        title: "No data available",
        description: "Please upload data before creating a chart",
        variant: "destructive"
      });
      return;
    }
    
    const columns = Object.keys(data[0]);
    const newConfig: ChartConfig = {
      type: 'bar',
      xAxis: columns[0] || '',
      yAxis: columns[1] || '',
      title: `Chart ${charts.length + 1}`
    };
    
    setCharts([...charts, newConfig]);
    setEditingChart(charts.length);
    setChartConfig(newConfig);
    setActiveTab('customize');
  };

  const handleEditChart = (index: number) => {
    setEditingChart(index);
    setChartConfig(charts[index]);
    setActiveTab('customize');
  };

  const handleConfigChange = (config: ChartConfig) => {
    setChartConfig(config);
    
    if (editingChart !== null) {
      const updatedCharts = [...charts];
      updatedCharts[editingChart] = config;
      setCharts(updatedCharts);
    }
  };

  const handleSaveChart = () => {
    if (editingChart === null || !chartConfig) return;
    
    const updatedCharts = [...charts];
    updatedCharts[editingChart] = chartConfig;
    setCharts(updatedCharts);
    setEditingChart(null);
    setActiveTab('dashboard');
    
    toast({
      title: "Chart saved",
      description: "Your visualization has been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="data">Data Table</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data" className="pt-6">
          <DataTable data={data} />
        </TabsContent>
        
        <TabsContent value="dashboard" className="pt-6">
          {charts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 border border-dashed rounded-lg p-8">
              <p className="text-muted-foreground mb-4">
                No visualizations yet. Create your first chart to get started.
              </p>
              <Button onClick={handleAddChart}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Chart
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium">Your Visualizations</h2>
                <Button onClick={handleAddChart}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Chart
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.map((chart, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 p-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">{chart.title}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditChart(index)}
                      >
                        Edit
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ChartDisplay data={data} config={chart} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="customize" className="pt-6">
          {editingChart !== null && chartConfig ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium">
                  {editingChart < charts.length ? 'Edit Chart' : 'Create New Chart'}
                </h2>
                <Button onClick={handleSaveChart}>Save Chart</Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ChartOptions 
                    data={data} 
                    onConfigChange={handleConfigChange}
                  />
                </div>
                <div className="lg:col-span-2">
                  <ChartDisplay data={data} config={chartConfig} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 border border-dashed rounded-lg p-8">
              <p className="text-muted-foreground mb-4">
                Select a chart to edit or create a new one.
              </p>
              <Button onClick={handleAddChart}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Chart
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
