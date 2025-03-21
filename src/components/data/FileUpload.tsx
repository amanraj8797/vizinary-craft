
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { parseCSV, parseExcel } from '@/utils/dataUtils';
import { Upload, File, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileType || '')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive"
      });
      return;
    }
    
    setFile(file);
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      let data;
      
      if (fileType === 'csv') {
        data = await parseCSV(file);
      } else if (['xlsx', 'xls'].includes(fileType || '')) {
        data = await parseExcel(file);
      }
      
      if (data && data.length > 0) {
        onDataLoaded(data);
        toast({
          title: "File uploaded successfully",
          description: `Loaded ${data.length} rows of data.`
        });
      } else {
        throw new Error("No data found in the file");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileInputChange}
          ref={fileInputRef}
        />

        {!file ? (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Upload Your Data</h3>
              <p className="text-muted-foreground mt-1">
                Drag and drop a CSV or Excel file, or click to browse
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
          </div>
        ) : (
          <Card className="animate-scale-in">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {file.name.endsWith('.csv') ? (
                  <FileText className="h-8 w-8 text-primary" />
                ) : (
                  <File className="h-8 w-8 text-primary" />
                )}
                <div className="text-left">
                  <p className="font-medium truncate" style={{ maxWidth: '200px' }}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {file && (
        <div className="flex justify-end">
          <Button 
            onClick={processFile} 
            disabled={isLoading}
            className="relative overflow-hidden"
          >
            {isLoading ? 'Processing...' : 'Analyze Data'}
            {isLoading && (
              <span className="absolute inset-0 flex justify-center items-center bg-primary">
                <div className="animate-pulse">Processing...</div>
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
