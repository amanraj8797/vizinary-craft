
import { ChartConfig } from '@/components/visualization/ChartOptions';

// Process the data based on the chart configuration
export const processChartData = (data: any[], config: ChartConfig): any[] => {
  const { type, xAxis, yAxis, groupBy } = config;
  
  if (!data || data.length === 0 || !xAxis || !yAxis) {
    return [];
  }

  // For pie charts
  if (type === 'pie') {
    // Group by xAxis and sum yAxis values
    const groupedData = data.reduce((acc, row) => {
      const key = String(row[xAxis]);
      if (!acc[key]) {
        acc[key] = 0;
      }
      
      const value = Number(row[yAxis]) || 0;
      acc[key] += value;
      
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array format required by Recharts
    return Object.entries(groupedData).map(([name, value]) => ({
      name,
      value
    }));
  }
  
  // For scatter plots
  if (type === 'scatter') {
    return data.map(row => {
      const result: any = {
        x: Number(row[xAxis]) || 0,
        y: Number(row[yAxis]) || 0,
        name: String(row[xAxis])
      };
      
      if (groupBy && row[groupBy] !== undefined) {
        result.category = String(row[groupBy]);
      }
      
      return result;
    });
  }
  
  // For bar and line charts
  if (groupBy) {
    // First, get unique xAxis values
    const uniqueXValues = Array.from(new Set(data.map(row => row[xAxis])));
    
    // Then, get unique groupBy values
    const uniqueGroups = Array.from(new Set(data.map(row => row[groupBy])));
    
    // Create a map to store grouped data
    const groupedData: Record<string, Record<string, number>> = {};
    
    // Initialize the map with all xAxis values
    uniqueXValues.forEach(xValue => {
      groupedData[String(xValue)] = {};
      
      // Initialize with 0 for all groups
      uniqueGroups.forEach(group => {
        groupedData[String(xValue)][String(group)] = 0;
      });
    });
    
    // Fill in the data
    data.forEach(row => {
      const xValue = String(row[xAxis]);
      const group = String(row[groupBy]);
      const value = Number(row[yAxis]) || 0;
      
      if (groupedData[xValue] && group) {
        groupedData[xValue][group] += value;
      }
    });
    
    // Convert to array format required by Recharts
    return Object.entries(groupedData).map(([name, values]) => ({
      name,
      ...values
    }));
  } else {
    // Without grouping, just use xAxis and yAxis
    const result = data.map(row => ({
      name: String(row[xAxis]),
      [yAxis]: Number(row[yAxis]) || 0
    }));
    
    return result;
  }
};
