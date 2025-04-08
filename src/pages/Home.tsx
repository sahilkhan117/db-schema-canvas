
import { Link } from 'react-router-dom';
import { Database, Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Database className="h-16 w-16 text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">Welcome to DB Canvas</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          A browser-based database schema visualizer. Create, edit and visualize your database schemas with DBML.
        </p>
        
        <div className="flex gap-4 mb-16">
          <Button asChild size="lg">
            <Link to="/projects">
              Browse Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/projects/new">
              New Project
            </Link>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-2">DBML Editor</h3>
            <p className="text-muted-foreground">
              Write your database schema using the DBML (Database Markup Language) syntax with autocompletion and syntax highlighting.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-2">Visual Canvas</h3>
            <p className="text-muted-foreground">
              Visualize your database schema in an interactive canvas where you can arrange tables and see relationships.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-2">Offline Support</h3>
            <p className="text-muted-foreground">
              All your projects are stored locally in your browser. Work without an internet connection.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="p-6 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 DB Canvas. Built with React, React Flow, Monaco Editor and ❤️
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername/db-canvas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              Star on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
