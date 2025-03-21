
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { 
  BarChart2, 
  UploadCloud, 
  Search, 
  Share2, 
  LineChart, 
  Download, 
  Zap, 
  Layers
} from 'lucide-react';

const features = [
  {
    icon: <UploadCloud className="h-10 w-10 text-primary" />,
    title: 'Easy Data Upload',
    description: 'Upload CSV and Excel files with a simple drag and drop interface.'
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: 'Advanced Queries',
    description: 'Filter, sort, and analyze your data with an intuitive query builder.'
  },
  {
    icon: <BarChart2 className="h-10 w-10 text-primary" />,
    title: 'Dynamic Visualizations',
    description: 'Create beautiful charts and graphs that update in real-time.'
  },
  {
    icon: <Layers className="h-10 w-10 text-primary" />,
    title: 'Custom Dashboards',
    description: 'Build and customize dashboards with multiple visualizations.'
  },
  {
    icon: <Share2 className="h-10 w-10 text-primary" />,
    title: 'Share Insights',
    description: 'Share your visualizations and insights with your team or clients.'
  },
  {
    icon: <Download className="h-10 w-10 text-primary" />,
    title: 'Export Options',
    description: 'Export your visualizations as images or PDFs for presentations.'
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Fast Performance',
    description: 'Experience lightning-fast data processing and rendering.'
  },
  {
    icon: <LineChart className="h-10 w-10 text-primary" />,
    title: 'Trend Analysis',
    description: 'Identify trends and patterns in your data with ease.'
  }
];

export function Features() {
  return (
    <section className="py-24 px-6 bg-secondary/50">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-bold mb-4">Powerful Features for Data Analysis</h2>
          <p className="text-xl text-muted-foreground">
            Our platform provides all the tools you need to analyze and visualize your data effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AnimatedCard 
              key={index} 
              className="p-6 flex flex-col items-center text-center animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
              hoverEffect="raise"
            >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
