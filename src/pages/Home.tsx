
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-4xl mx-auto text-center">
      <Database className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold mb-4">DB Canvas</h1>
      <p className="text-xl mb-8 text-muted-foreground">
        A browser-based database schema visualizer with DBML editing capabilities
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-2xl">
        <div className="flex flex-col items-center bg-card p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-2">Visualize Your Database</h2>
          <p className="text-muted-foreground mb-4 text-center">
            Create database schemas using DBML (Database Markup Language) and visualize them in real-time.
          </p>
          <Button asChild className="mt-2">
            <Link to="/projects">
              View Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col items-center bg-card p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-2">Start a New Project</h2>
          <p className="text-muted-foreground mb-4 text-center">
            Create a new database schema from scratch with our easy-to-use editor.
          </p>
          <Button asChild className="mt-2">
            <Link to="/projects/new">
              New Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-3">About DB Canvas</h2>
        <p className="text-muted-foreground mb-4">
          DB Canvas is a browser-based tool that helps you design database schemas using DBML (Database Markup Language). 
          Create, edit, and visualize your database structures with an intuitive interface. 
          All projects are stored locally in your browser, so you can work offline.
        </p>
        <p className="text-sm text-muted-foreground">
          Need help? Check out the <a href="https://dbml.dbdiagram.io/docs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DBML documentation</a>.
        </p>
      </div>
    </div>
  );
};

export default Home;
