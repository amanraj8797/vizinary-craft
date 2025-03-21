
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FileUpload } from '@/components/data/FileUpload';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ArrowDownCircle } from 'lucide-react';

export default function UploadPage() {
  const [data, setData] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);

  const handleDataLoaded = (loadedData: any[]) => {
    setData(loadedData);
    setHasData(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Upload Your Data</h1>
            <p className="text-xl text-muted-foreground">
              Upload CSV or Excel files to begin visualizing and analyzing your data.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>

          {hasData ? (
            <div className="animate-fade-in">
              <Dashboard data={data} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center text-muted-foreground">
              <ArrowDownCircle className="h-16 w-16 mb-4 animate-pulse" />
              <p className="text-xl">
                Upload a file to get started with data visualization
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
