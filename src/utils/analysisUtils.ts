
type AnalysisType = 'natural' | 'formulas' | 'filters' | 'custom';

interface AnalysisResult {
  result: any;
  query: string;
  type: AnalysisType;
}

/**
 * Analyzes data based on a query string and analysis type
 */
export const analyzeData = async (
  data: any[],
  query: string,
  type: string
): Promise<any> => {
  if (!data || data.length === 0) {
    throw new Error("No data available to analyze");
  }

  try {
    switch (type) {
      case 'natural':
        return processNaturalLanguageQuery(data, query);
      case 'formulas':
        return processFormulaQuery(data, query);
      case 'filters':
        return processFilterQuery(data, query);
      case 'custom':
        return processCustomCode(data, query);
      default:
        throw new Error(`Unknown analysis type: ${type}`);
    }
  } catch (error) {
    console.error("Analysis error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to analyze data");
  }
};

/**
 * Processes natural language queries
 */
const processNaturalLanguageQuery = (data: any[], query: string): any => {
  const lowerQuery = query.toLowerCase();
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // Check for average calculation
  if (lowerQuery.includes('average') || lowerQuery.includes('avg')) {
    const columnMatch = columns.find(col => lowerQuery.includes(col.toLowerCase()));
    
    if (!columnMatch) {
      return "Could not find the column to calculate average for. Please specify a valid column name.";
    }

    // Check if grouping is requested
    if (lowerQuery.includes('for each') || lowerQuery.includes('by') || lowerQuery.includes('group')) {
      const groupByColumn = columns.find(col => 
        lowerQuery.includes(`for each ${col.toLowerCase()}`) || 
        lowerQuery.includes(`by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`group by ${col.toLowerCase()}`)
      );

      if (groupByColumn) {
        return calculateAverageByGroup(data, columnMatch, groupByColumn);
      }
    }

    // Simple average
    return {
      result: calculateAverage(data, columnMatch),
      description: `Average of ${columnMatch}`,
      formula: `AVG(${columnMatch})`
    };
  }

  // Check for total/sum calculation
  if (lowerQuery.includes('total') || lowerQuery.includes('sum')) {
    const columnMatch = columns.find(col => lowerQuery.includes(col.toLowerCase()));
    
    if (!columnMatch) {
      return "Could not find the column to calculate sum for. Please specify a valid column name.";
    }

    // Check if grouping is requested
    if (lowerQuery.includes('for each') || lowerQuery.includes('by') || lowerQuery.includes('group')) {
      const groupByColumn = columns.find(col => 
        lowerQuery.includes(`for each ${col.toLowerCase()}`) || 
        lowerQuery.includes(`by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`group by ${col.toLowerCase()}`)
      );

      if (groupByColumn) {
        return calculateSumByGroup(data, columnMatch, groupByColumn);
      }
    }

    // Simple sum
    return {
      result: calculateSum(data, columnMatch),
      description: `Total of ${columnMatch}`,
      formula: `SUM(${columnMatch})`
    };
  }

  // Check for max/highest/largest value
  if (lowerQuery.includes('max') || lowerQuery.includes('highest') || lowerQuery.includes('largest')) {
    const columnMatch = columns.find(col => lowerQuery.includes(col.toLowerCase()));
    
    if (!columnMatch) {
      return "Could not find the column to find maximum for. Please specify a valid column name.";
    }

    // Check if grouping is requested
    if (lowerQuery.includes('for each') || lowerQuery.includes('by') || lowerQuery.includes('group') || lowerQuery.includes('in each')) {
      const groupByColumn = columns.find(col => 
        lowerQuery.includes(`for each ${col.toLowerCase()}`) || 
        lowerQuery.includes(`by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`group by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`in each ${col.toLowerCase()}`)
      );

      if (groupByColumn) {
        return calculateMaxByGroup(data, columnMatch, groupByColumn);
      }
    }

    // Simple max
    return {
      result: calculateMax(data, columnMatch),
      description: `Maximum of ${columnMatch}`,
      formula: `MAX(${columnMatch})`
    };
  }

  // Check for min/lowest/smallest value
  if (lowerQuery.includes('min') || lowerQuery.includes('lowest') || lowerQuery.includes('smallest')) {
    const columnMatch = columns.find(col => lowerQuery.includes(col.toLowerCase()));
    
    if (!columnMatch) {
      return "Could not find the column to find minimum for. Please specify a valid column name.";
    }

    // Check if grouping is requested
    if (lowerQuery.includes('for each') || lowerQuery.includes('by') || lowerQuery.includes('group') || lowerQuery.includes('in each')) {
      const groupByColumn = columns.find(col => 
        lowerQuery.includes(`for each ${col.toLowerCase()}`) || 
        lowerQuery.includes(`by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`group by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`in each ${col.toLowerCase()}`)
      );

      if (groupByColumn) {
        return calculateMinByGroup(data, columnMatch, groupByColumn);
      }
    }

    // Simple min
    return {
      result: calculateMin(data, columnMatch),
      description: `Minimum of ${columnMatch}`,
      formula: `MIN(${columnMatch})`
    };
  }

  // Check for count
  if (lowerQuery.includes('count') || lowerQuery.includes('how many')) {
    // Check if grouping is requested
    if (lowerQuery.includes('for each') || lowerQuery.includes('by') || lowerQuery.includes('group') || lowerQuery.includes('in each')) {
      const groupByColumn = columns.find(col => 
        lowerQuery.includes(`for each ${col.toLowerCase()}`) || 
        lowerQuery.includes(`by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`group by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`in each ${col.toLowerCase()}`)
      );

      if (groupByColumn) {
        return calculateCountByGroup(data, groupByColumn);
      }
    }

    // Simple count
    return {
      result: data.length,
      description: "Total count of records",
      formula: "COUNT(*)"
    };
  }

  // Check for percentage calculation
  if (lowerQuery.includes('percentage') || lowerQuery.includes('percent')) {
    const columnMatch = columns.find(col => lowerQuery.includes(col.toLowerCase()));
    
    if (!columnMatch) {
      return "Could not find the column to calculate percentage for. Please specify a valid column name.";
    }

    // Check if grouping is requested
    if (lowerQuery.includes('for each') || lowerQuery.includes('by') || lowerQuery.includes('group') || lowerQuery.includes('of each')) {
      const groupByColumn = columns.find(col => 
        lowerQuery.includes(`for each ${col.toLowerCase()}`) || 
        lowerQuery.includes(`by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`group by ${col.toLowerCase()}`) ||
        lowerQuery.includes(`of each ${col.toLowerCase()}`)
      );

      if (groupByColumn) {
        return calculatePercentageByGroup(data, columnMatch, groupByColumn);
      }
    }
  }

  // Default response if no analysis pattern is matched
  return "I couldn't understand your query. Please try rephrasing or use a specific format.";
};

/**
 * Processes formula-based queries
 */
const processFormulaQuery = (data: any[], query: string): any => {
  const formulaPattern = /^(AVG|SUM|COUNT|MAX|MIN)\(([^)]+)\)(?:\s+GROUP\s+BY\s+(.+))?$/i;
  const match = query.match(formulaPattern);

  if (!match) {
    throw new Error("Invalid formula format. Please use format like: AVG(column) GROUP BY group_column");
  }

  const [, operation, column, groupBy] = match;
  const cleanColumn = column.trim();
  
  if (cleanColumn === '*' && (operation.toUpperCase() !== 'COUNT')) {
    throw new Error("Only COUNT operation can use * as column");
  }

  // Validate column exists
  if (cleanColumn !== '*' && data.length > 0 && !(cleanColumn in data[0])) {
    throw new Error(`Column '${cleanColumn}' not found in data`);
  }

  // Validate groupBy column exists
  if (groupBy && data.length > 0) {
    const groupColumns = groupBy.split(',').map(g => g.trim());
    for (const g of groupColumns) {
      if (!(g in data[0])) {
        throw new Error(`Group column '${g}' not found in data`);
      }
    }
  }

  switch (operation.toUpperCase()) {
    case 'AVG':
      return groupBy 
        ? calculateAverageByGroup(data, cleanColumn, groupBy.trim()) 
        : calculateAverage(data, cleanColumn);
    case 'SUM':
      return groupBy 
        ? calculateSumByGroup(data, cleanColumn, groupBy.trim())
        : calculateSum(data, cleanColumn);
    case 'COUNT':
      return groupBy
        ? calculateCountByGroup(data, groupBy.trim())
        : data.length;
    case 'MAX':
      return groupBy
        ? calculateMaxByGroup(data, cleanColumn, groupBy.trim())
        : calculateMax(data, cleanColumn);
    case 'MIN':
      return groupBy
        ? calculateMinByGroup(data, cleanColumn, groupBy.trim())
        : calculateMin(data, cleanColumn);
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
};

/**
 * Processes filter-based queries
 */
const processFilterQuery = (data: any[], query: string): any => {
  let filteredData = [...data];
  
  // Basic parsing for demonstration purposes
  // A real implementation would use a more sophisticated parser

  // Handle simple equality filters: column = value
  const equalityMatches = query.match(/([a-zA-Z_]+)\s*=\s*['"]?([^'"]+)['"]?/g);
  if (equalityMatches) {
    equalityMatches.forEach(match => {
      const [column, value] = match.split(/\s*=\s*/);
      const cleanValue = value.replace(/['"]/g, '').trim();
      filteredData = filteredData.filter(row => String(row[column]) === cleanValue);
    });
  }

  // Handle greater than: column > value
  const greaterThanMatches = query.match(/([a-zA-Z_]+)\s*>\s*([0-9.]+)/g);
  if (greaterThanMatches) {
    greaterThanMatches.forEach(match => {
      const [column, value] = match.split(/\s*>\s*/);
      filteredData = filteredData.filter(row => Number(row[column]) > Number(value));
    });
  }

  // Handle less than: column < value
  const lessThanMatches = query.match(/([a-zA-Z_]+)\s*<\s*([0-9.]+)/g);
  if (lessThanMatches) {
    lessThanMatches.forEach(match => {
      const [column, value] = match.split(/\s*<\s*/);
      filteredData = filteredData.filter(row => Number(row[column]) < Number(value));
    });
  }

  // Handle IN operator: column IN ('val1', 'val2')
  const inMatches = query.match(/([a-zA-Z_]+)\s+IN\s+\(([^)]+)\)/g);
  if (inMatches) {
    inMatches.forEach(match => {
      const parts = match.split(/\s+IN\s+/);
      const column = parts[0];
      const valuesString = parts[1].replace(/[()]/g, '');
      const values = valuesString.split(',').map(v => v.trim().replace(/['"]/g, ''));
      filteredData = filteredData.filter(row => values.includes(String(row[column])));
    });
  }

  // Handle BETWEEN operator: column BETWEEN val1 AND val2
  const betweenMatches = query.match(/([a-zA-Z_]+)\s+BETWEEN\s+([0-9.]+)\s+AND\s+([0-9.]+)/g);
  if (betweenMatches) {
    betweenMatches.forEach(match => {
      const parts = match.split(/\s+BETWEEN\s+/);
      const column = parts[0];
      const valueRange = parts[1].split(/\s+AND\s+/);
      const min = Number(valueRange[0]);
      const max = Number(valueRange[1]);
      filteredData = filteredData.filter(row => 
        Number(row[column]) >= min && Number(row[column]) <= max
      );
    });
  }

  // Handle ORDER BY: ORDER BY column ASC/DESC
  const orderByMatch = query.match(/ORDER\s+BY\s+([a-zA-Z_]+)(?:\s+(ASC|DESC))?/i);
  if (orderByMatch) {
    const orderColumn = orderByMatch[1];
    const direction = orderByMatch[2]?.toUpperCase() || 'ASC';
    
    filteredData.sort((a, b) => {
      if (typeof a[orderColumn] === 'number') {
        return direction === 'ASC' 
          ? a[orderColumn] - b[orderColumn]
          : b[orderColumn] - a[orderColumn];
      } else {
        const aVal = String(a[orderColumn]);
        const bVal = String(b[orderColumn]);
        return direction === 'ASC'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
    });
  }

  return {
    count: filteredData.length,
    data: filteredData
  };
};

/**
 * Processes custom code queries
 */
const processCustomCode = (data: any[], query: string): any => {
  try {
    // This is a simplified version for demonstration
    // In a real app, you would need to use more secure approaches
    // eslint-disable-next-line no-new-func
    const customFunction = new Function('data', `return ${query};`);
    return customFunction(data);
  } catch (error) {
    console.error("Error executing custom code:", error);
    throw new Error("Failed to execute custom code. Please check your syntax.");
  }
};

// Utility calculation functions
const calculateAverage = (data: any[], column: string): number => {
  const sum = data.reduce((acc, row) => acc + Number(row[column] || 0), 0);
  return sum / data.length;
};

const calculateSum = (data: any[], column: string): number => {
  return data.reduce((acc, row) => acc + Number(row[column] || 0), 0);
};

const calculateMax = (data: any[], column: string): number => {
  return Math.max(...data.map(row => Number(row[column] || 0)));
};

const calculateMin = (data: any[], column: string): number => {
  return Math.min(...data.map(row => Number(row[column] || 0)));
};

const calculateAverageByGroup = (data: any[], column: string, groupBy: string): Record<string, number> => {
  const groups: Record<string, { sum: number; count: number }> = {};
  
  // Group data and calculate sums
  data.forEach(row => {
    const groupValue = String(row[groupBy]);
    if (!groups[groupValue]) {
      groups[groupValue] = { sum: 0, count: 0 };
    }
    groups[groupValue].sum += Number(row[column] || 0);
    groups[groupValue].count += 1;
  });
  
  // Calculate averages
  const result: Record<string, number> = {};
  Object.entries(groups).forEach(([key, { sum, count }]) => {
    result[key] = sum / count;
  });
  
  return result;
};

const calculateSumByGroup = (data: any[], column: string, groupBy: string): Record<string, number> => {
  return data.reduce((acc, row) => {
    const groupValue = String(row[groupBy]);
    acc[groupValue] = (acc[groupValue] || 0) + Number(row[column] || 0);
    return acc;
  }, {} as Record<string, number>);
};

const calculateMaxByGroup = (data: any[], column: string, groupBy: string): Record<string, number> => {
  const groups: Record<string, number[]> = {};
  
  // Group data
  data.forEach(row => {
    const groupValue = String(row[groupBy]);
    if (!groups[groupValue]) {
      groups[groupValue] = [];
    }
    groups[groupValue].push(Number(row[column] || 0));
  });
  
  // Find max in each group
  const result: Record<string, number> = {};
  Object.entries(groups).forEach(([key, values]) => {
    result[key] = Math.max(...values);
  });
  
  return result;
};

const calculateMinByGroup = (data: any[], column: string, groupBy: string): Record<string, number> => {
  const groups: Record<string, number[]> = {};
  
  // Group data
  data.forEach(row => {
    const groupValue = String(row[groupBy]);
    if (!groups[groupValue]) {
      groups[groupValue] = [];
    }
    groups[groupValue].push(Number(row[column] || 0));
  });
  
  // Find min in each group
  const result: Record<string, number> = {};
  Object.entries(groups).forEach(([key, values]) => {
    result[key] = Math.min(...values);
  });
  
  return result;
};

const calculateCountByGroup = (data: any[], groupBy: string): Record<string, number> => {
  return data.reduce((acc, row) => {
    const groupValue = String(row[groupBy]);
    acc[groupValue] = (acc[groupValue] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const calculatePercentageByGroup = (data: any[], column: string, groupBy: string): Record<string, number> => {
  const totalSum = calculateSum(data, column);
  const sumByGroup = calculateSumByGroup(data, column, groupBy);
  
  const result: Record<string, number> = {};
  Object.entries(sumByGroup).forEach(([key, sum]) => {
    result[key] = (sum / totalSum) * 100;
  });
  
  return result;
};
