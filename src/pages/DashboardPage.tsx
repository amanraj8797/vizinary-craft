
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { FileUpload } from '@/components/data/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getSampleData } from '@/utils/dataUtils';
import { BarChart2, Database, Upload } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    // Check if we have data in localStorage from a previous session
    const savedData = localStorage.getItem('vizionData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setData(parsedData);
          toast({
            title: "Data loaded",
            description: "Your previous session data has been restored."
          });
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('vizionData', JSON.stringify(data));
    }
  }, [data]);

  const handleDataLoaded = (loadedData: any[]) => {
    setData(loadedData);
    setShowUpload(false);
  };

  const loadSampleData = async () => {
    setIsLoadingSample(true);
    try {
      const sampleData = await getSampleData();
      setData(sampleData);
      toast({
        title: "Sample data loaded",
        description: "Sample dataset has been loaded successfully."
      });
    } catch (error) {
      console.error("Error loading sample data:", error);
      toast({
        title: "Error",
        description: "Failed to load sample data.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-4xl font-bold">Your Dashboard</h1>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => setShowUpload(!showUpload)}>
                <Upload className="h-4 w-4 mr-2" />
                {showUpload ? 'Hide Upload' : 'Upload Data'}
              </Button>
              <Button 
                variant="outline" 
                onClick={loadSampleData}
                disabled={isLoadingSample}
              >
                <Database className="h-4 w-4 mr-2" />
                {isLoadingSample ? 'Loading...' : 'Load Sample Data'}
              </Button>
            </div>
          </div>

          {showUpload && (
            <div className="animate-fade-in max-w-xl mx-auto">
              <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
          )}

          {data.length > 0 ? (
            <Dashboard data={data} />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center glass rounded-xl p-12">
              <BarChart2 className="h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-medium mb-4">No Data Available</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Upload your own data or load a sample dataset to start creating 
                beautiful visualizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setShowUpload(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </Button>
                <Button 
                  variant="outline" 
                  onClick={loadSampleData}
                  disabled={isLoadingSample}
                >
                  <Database className="h-4 w-4 mr-2" />
                  {isLoadingSample ? 'Loading...' : 'Load Sample Data'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
