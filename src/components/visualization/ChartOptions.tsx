
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart, ScatterChart } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  xAxis: string;
  yAxis: string;
  groupBy?: string;
  title: string;
}

interface ChartOptionsProps {
  data: any[];
  onConfigChange: (config: ChartConfig) => void;
  initialConfig?: ChartConfig;
}

export function ChartOptions({ data, onConfigChange, initialConfig }: ChartOptionsProps) {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>(initialConfig?.type || 'bar');
  const [xAxis, setXAxis] = useState<string>(initialConfig?.xAxis || columns[0] || '');
  const [yAxis, setYAxis] = useState<string>(initialConfig?.yAxis || columns[1] || '');
  const [groupBy, setGroupBy] = useState<string>(initialConfig?.groupBy || '');
  const [title, setTitle] = useState<string>(initialConfig?.title || 'Data Visualization');

  // Update local state when initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      setChartType(initialConfig.type);
      setXAxis(initialConfig.xAxis);
      setYAxis(initialConfig.yAxis);
      setGroupBy(initialConfig.groupBy || '');
      setTitle(initialConfig.title);
    }
  }, [initialConfig]);

  // Send initial configuration to parent
  useEffect(() => {
    if (data.length > 0 && columns.length > 0) {
      updateConfig(chartType, xAxis, yAxis, groupBy, title);
    }
  }, [data]);

  const handleChartTypeChange = (value: string) => {
    const newType = value as 'bar' | 'line' | 'pie' | 'scatter';
    setChartType(newType);
    updateConfig(newType, xAxis, yAxis, groupBy, title);
  };

  const handleXAxisChange = (value: string) => {
    setXAxis(value);
    updateConfig(chartType, value, yAxis, groupBy, title);
  };

  const handleYAxisChange = (value: string) => {
    setYAxis(value);
    updateConfig(chartType, xAxis, value, groupBy, title);
  };

  const handleGroupByChange = (value: string) => {
    setGroupBy(value);
    updateConfig(chartType, xAxis, yAxis, value, title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateConfig(chartType, xAxis, yAxis, groupBy, newTitle);
  };

  const updateConfig = (
    type: 'bar' | 'line' | 'pie' | 'scatter',
    x: string,
    y: string,
    group?: string,
    titleValue?: string
  ) => {
    onConfigChange({
      type,
      xAxis: x,
      yAxis: y,
      groupBy: group,
      title: titleValue || 'Data Visualization'
    });
  };

  const chartIcons = {
    bar: <BarChart className="h-4 w-4" />,
    line: <LineChart className="h-4 w-4" />,
    pie: <PieChart className="h-4 w-4" />,
    scatter: <ScatterChart className="h-4 w-4" />
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="chart-title" className="text-sm font-medium">
            Chart Title
          </label>
          <Input
            id="chart-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter chart title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Chart Type</label>
          <Tabs 
            defaultValue={chartType} 
            value={chartType}
            onValueChange={handleChartTypeChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="bar" className="flex items-center gap-2">
                {chartIcons.bar} Bar
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-2">
                {chartIcons.line} Line
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-2">
                {chartIcons.pie} Pie
              </TabsTrigger>
              <TabsTrigger value="scatter" className="flex items-center gap-2">
                {chartIcons.scatter} Scatter
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {chartType === 'pie' ? 'Category' : 'X Axis'}
            </label>
            <Select value={xAxis} onValueChange={handleXAxisChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {chartType === 'pie' ? 'Value' : 'Y Axis'}
            </label>
            <Select value={yAxis} onValueChange={handleYAxisChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Group By (Optional)</label>
          <Select value={groupBy} onValueChange={handleGroupByChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a column for grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
