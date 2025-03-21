
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart2, PieChart, LineChart, Upload, ArrowRight } from 'lucide-react';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-16 px-6 relative overflow-hidden">
      <div 
        className={`absolute inset-0 opacity-30 z-0 pointer-events-none transition-opacity duration-1000 ease-out ${
          isVisible ? 'opacity-30' : 'opacity-0'
        }`}
      >
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-float">
          <BarChart2 size={120} />
        </div>
        <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 text-primary/60 animate-float" style={{ animationDelay: '0.5s' }}>
          <PieChart size={100} />
        </div>
        <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2 text-primary/40 animate-float" style={{ animationDelay: '1s' }}>
          <LineChart size={80} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center z-10 space-y-8">
        <h1 
          className={`font-bold leading-tight transition-all duration-1000 ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-10'
          }`}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
            Transform Your Data
          </span>{' '}
          Into Beautiful Visualizations
        </h1>
        
        <p 
          className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-10'
          }`}
        >
          Upload your data and create stunning, interactive visualizations in minutes.
          No coding required. Just drag, drop, and visualize.
        </p>
        
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-10'
          }`}
        >
          <Button size="lg" asChild className="gap-2">
            <Link to="/upload">
              <Upload className="h-5 w-5" />
              Upload Data
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <Link to="/dashboard">
              Explore Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div 
        className={`w-full max-w-4xl mt-16 glass rounded-xl p-6 transition-all duration-1000 delay-700 ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="aspect-video rounded-lg bg-card overflow-hidden shadow-lg">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="glass p-8 rounded-lg">
              <BarChart2 size={60} className="text-primary mx-auto" />
              <div className="mt-4 text-center font-medium">
                Interactive Dashboard Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
