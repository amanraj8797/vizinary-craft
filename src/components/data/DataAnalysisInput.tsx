
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Code, ListFilter, Wand2 } from 'lucide-react';
import { analyzeData } from '@/utils/analysisUtils';

interface DataAnalysisInputProps {
  data: any[];
}

export function DataAnalysisInput({ data }: DataAnalysisInputProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<string>('natural');

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a query to analyze the data.",
        variant: "destructive"
      });
      return;
    }

    if (data.length === 0) {
      toast({
        title: "No Data Available",
        description: "Please upload or load data before performing analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const analyzedResult = await analyzeData(data, query, analysisType);
      setResult(analyzedResult);
      toast({
        title: "Analysis Complete",
        description: "Your data has been analyzed successfully."
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (typeof result === 'object') {
      return (
        <pre className="bg-muted p-4 rounded-md overflow-auto max-h-80 text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      );
    }

    return (
      <div className="bg-muted p-4 rounded-md">
        <p className="text-lg font-medium">{result}</p>
      </div>
    );
  };

  const getPlaceholderText = () => {
    switch (analysisType) {
      case 'natural':
        return "Example: What is the average Sales for each Region?\nOr: Find the highest Profit in each Month.";
      case 'formulas':
        return "Example: AVG(Sales) GROUP BY Region\nOr: MAX(Profit) GROUP BY Month";
      case 'filters':
        return "Example: Sales > 60 AND Region = 'North'\nOr: Month IN ('January', 'February') ORDER BY Profit DESC";
      case 'custom':
        return "Write your custom processing logic:\ndata.filter(row => row.Sales > 60).map(row => ({ ...row, HighPerformer: true }))";
      default:
        return "Enter your query here...";
    }
  };

  const examples = {
    natural: [
      "What is the average Sales for each Region?",
      "Show total Profit by Month",
      "Which Region has the highest Sales in December?",
      "Calculate the percentage of total Sales for each Region"
    ],
    formulas: [
      "AVG(Sales) GROUP BY Region",
      "SUM(Profit) GROUP BY Month",
      "MAX(Sales) GROUP BY Region, Month",
      "COUNT(*) GROUP BY Region"
    ],
    filters: [
      "Sales > 60 ORDER BY Sales DESC",
      "Region = 'North' AND Profit > 15",
      "Month IN ('January', 'February', 'March')",
      "Sales BETWEEN 50 AND 70"
    ],
    custom: [
      "data.reduce((sum, row) => sum + row.Sales, 0) / data.length",
      "data.filter(row => row.Region === 'North').map(row => row.Sales)",
      "Object.values(data.reduce((acc, row) => { acc[row.Region] = (acc[row.Region] || 0) + row.Sales; return acc; }, {}))",
      "data.sort((a, b) => b.Profit - a.Profit).slice(0, 5)"
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Data Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs 
                value={analysisType} 
                onValueChange={setAnalysisType}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="natural" className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4" /> Natural Language
                  </TabsTrigger>
                  <TabsTrigger value="formulas" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" /> Formulas
                  </TabsTrigger>
                  <TabsTrigger value="filters" className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4" /> Filters
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex items-center gap-2">
                    <Code className="h-4 w-4" /> Custom Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="query">Your Query</Label>
                <Textarea
                  id="query"
                  placeholder={getPlaceholderText()}
                  className="min-h-32"
                  value={query}
                  onChange={handleQueryChange}
                />
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={isLoading || !query.trim()}
                className="w-full"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Data'}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="mt-6 animate-fade-in">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                {renderResult()}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Example Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TabsContent value="natural" className="m-0">
                <ul className="space-y-2">
                  {examples.natural.map((example, index) => (
                    <li key={index}>
                      <Button 
                        variant="ghost" 
                        className="text-left w-full justify-start h-auto py-2"
                        onClick={() => setQuery(example)}
                      >
                        {example}
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="formulas" className="m-0">
                <ul className="space-y-2">
                  {examples.formulas.map((example, index) => (
                    <li key={index}>
                      <Button 
                        variant="ghost" 
                        className="text-left w-full justify-start h-auto py-2"
                        onClick={() => setQuery(example)}
                      >
                        {example}
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="filters" className="m-0">
                <ul className="space-y-2">
                  {examples.filters.map((example, index) => (
                    <li key={index}>
                      <Button 
                        variant="ghost" 
                        className="text-left w-full justify-start h-auto py-2"
                        onClick={() => setQuery(example)}
                      >
                        {example}
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="custom" className="m-0">
                <ul className="space-y-2">
                  {examples.custom.map((example, index) => (
                    <li key={index}>
                      <Button 
                        variant="ghost" 
                        className="text-left w-full justify-start h-auto py-2"
                        onClick={() => setQuery(example)}
                      >
                        {example}
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
