
import { toast } from '@/components/ui/use-toast';

// Function to parse CSV files
export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || !event.target.result) {
        reject(new Error("Failed to read file"));
        return;
      }
      
      const csvData = event.target.result as string;
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      const result = [];
      
      // Skip header line, process data lines
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        const values = line.split(',');
        if (values.length !== headers.length) {
          console.warn(`Line ${i} has ${values.length} values, expected ${headers.length}`);
          continue; // Skip malformed lines
        }
        
        const rowData: Record<string, any> = {};
        
        for (let j = 0; j < headers.length; j++) {
          let value: any = values[j].trim();
          
          // Try to parse numbers
          if (!isNaN(Number(value)) && value !== '') {
            value = Number(value);
          }
          
          rowData[headers[j]] = value;
        }
        
        result.push(rowData);
      }
      
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
};

// Simplified Excel parsing (in a real app, you would use a library like SheetJS)
export const parseExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    // In a real implementation, this would use a library like SheetJS
    // For this demo, we'll mock Excel parsing by returning an error
    // suggesting the user to try CSV instead
    
    toast({
      title: "Excel parsing unavailable",
      description: "Please convert your Excel file to CSV and try again.",
      variant: "destructive"
    });
    
    reject(new Error("Excel parsing is not implemented in this demo. Please use CSV files."));
  });
};

// Generate sample data for demonstration
export const getSampleData = (): Promise<any[]> => {
  return new Promise((resolve) => {
    // Simulate network request
    setTimeout(() => {
      const sampleData = [
        { Month: 'January', Sales: 65, Expenses: 50, Profit: 15, Region: 'North' },
        { Month: 'February', Sales: 59, Expenses: 40, Profit: 19, Region: 'North' },
        { Month: 'March', Sales: 80, Expenses: 55, Profit: 25, Region: 'North' },
        { Month: 'April', Sales: 81, Expenses: 60, Profit: 21, Region: 'East' },
        { Month: 'May', Sales: 56, Expenses: 45, Profit: 11, Region: 'East' },
        { Month: 'June', Sales: 55, Expenses: 35, Profit: 20, Region: 'East' },
        { Month: 'July', Sales: 40, Expenses: 30, Profit: 10, Region: 'West' },
        { Month: 'August', Sales: 70, Expenses: 45, Profit: 25, Region: 'West' },
        { Month: 'September', Sales: 60, Expenses: 40, Profit: 20, Region: 'West' },
        { Month: 'October', Sales: 63, Expenses: 55, Profit: 8, Region: 'South' },
        { Month: 'November', Sales: 55, Expenses: 45, Profit: 10, Region: 'South' },
        { Month: 'December', Sales: 85, Expenses: 65, Profit: 20, Region: 'South' }
      ];
      
      resolve(sampleData);
    }, 1000);
  });
};
