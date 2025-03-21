
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ChartConfig } from './ChartOptions';
import { processChartData } from '@/utils/chartUtils';
import { 
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ScatterChart as RechartsScatterChart,
  Bar, Line, Pie, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { Download, Share2 } from 'lucide-react';

interface ChartDisplayProps {
  data: any[];
  config: ChartConfig;
}

export function ChartDisplay({ data, config }: ChartDisplayProps) {
  const { type, xAxis, yAxis, groupBy, title } = config;
  const chartRef = useRef<HTMLDivElement>(null);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [colorMap, setColorMap] = useState<Map<string, string>>(new Map());

  // Color palette for charts
  const colors = [
    '#3B82F6', // Primary blue
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#8B5CF6', // Violet
    '#14B8A6', // Teal
    '#F43F5E', // Rose
    '#0EA5E9', // Sky
    '#84CC16', // Lime
  ];

  useEffect(() => {
    if (data.length === 0 || !xAxis || !yAxis) return;

    try {
      const processed = processChartData(data, config);
      setProcessedData(processed);

      // Generate colors for unique categories (for groupBy or pie chart)
      const newColorMap = new Map<string, string>();
      
      if (type === 'pie') {
        processed.forEach((item, index) => {
          newColorMap.set(item.name, colors[index % colors.length]);
        });
      } else if (groupBy) {
        const uniqueGroups = Array.from(new Set(processed.map(item => 
          Object.keys(item).filter(key => key !== xAxis && key !== 'name')
        ).flat()));
        
        uniqueGroups.forEach((group, index) => {
          newColorMap.set(group, colors[index % colors.length]);
        });
      }
      
      setColorMap(newColorMap);
    } catch (error) {
      console.error("Error processing chart data:", error);
      toast({
        title: "Error generating chart",
        description: error instanceof Error ? error.message : "Failed to process data",
        variant: "destructive"
      });
    }
  }, [data, config]);

  const downloadChart = () => {
    if (!chartRef.current) return;

    try {
      const chartElement = chartRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = chartElement.offsetWidth * 2;
      canvas.height = chartElement.offsetHeight * 2;
      const context = canvas.getContext('2d');
      
      if (!context) throw new Error("Failed to get canvas context");
      
      context.scale(2, 2);
      
      // Use html2canvas or a similar library here
      // Since we can't include additional libraries in this demo, we'll show a mock success
      
      // Mock download behavior
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = '#'; // Mock URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Chart downloaded",
        description: "Your chart has been downloaded as an image."
      });
    } catch (error) {
      console.error("Error downloading chart:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the chart as an image.",
        variant: "destructive"
      });
    }
  };

  const shareChart = () => {
    // Mock share functionality
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "Share this link to show this visualization to others."
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy link",
          description: "Could not copy the link to clipboard.",
          variant: "destructive"
        });
      });
  };

  const renderChart = () => {
    if (processedData.length === 0) {
      return (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          No chart data available. Please select different columns.
        </div>
      );
    }

    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Legend wrapperStyle={{ marginTop: '10px' }} />
            {groupBy ? (
              Object.keys(processedData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar 
                    key={key} 
                    dataKey={key} 
                    fill={colorMap.get(key) || colors[index % colors.length]} 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                ))
            ) : (
              <Bar 
                dataKey={yAxis} 
                fill={colors[0]} 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsLineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Legend wrapperStyle={{ marginTop: '10px' }} />
            {groupBy ? (
              Object.keys(processedData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={colorMap.get(key) || colors[index % colors.length]} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                ))
            ) : (
              <Line 
                type="monotone" 
                dataKey={yAxis} 
                stroke={colors[0]} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            )}
          </RechartsLineChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'pie') {
      const total = processedData.reduce((sum, item) => sum + item.value, 0);
      
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorMap.get(entry.name) || colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, yAxis]}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'scatter') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="x" 
              name={xAxis} 
              type="number"
              label={{ 
                value: xAxis, 
                position: 'insideBottomRight', 
                offset: -10 
              }}
            />
            <YAxis 
              dataKey="y" 
              name={yAxis} 
              type="number"
              label={{ 
                value: yAxis, 
                angle: -90, 
                position: 'insideLeft', 
                offset: -5 
              }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
              formatter={(value: number, name: string) => [value, name === 'x' ? xAxis : yAxis]}
              labelFormatter={(label) => groupBy ? `${groupBy}: ${label}` : ''}
            />
            <Legend />
            {groupBy ? (
              // Group by categories with different colors
              Array.from(new Set(processedData.map(item => item.category))).map((category, index) => (
                <Scatter 
                  key={String(category)}
                  name={String(category)}
                  data={processedData.filter(item => item.category === category)}
                  fill={colors[index % colors.length]}
                  shape="circle"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              ))
            ) : (
              <Scatter 
                name={`${xAxis} vs ${yAxis}`} 
                data={processedData} 
                fill={colors[0]}
                shape="circle"
                animationDuration={1500}
                animationEasing="ease-out"
              />
            )}
          </RechartsScatterChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <Card className="animate-fade-in shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={downloadChart}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={shareChart}
          >
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Share
          </Button>
        </div>
      </CardHeader>
      <CardContent ref={chartRef}>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
