
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Github, Menu, Save, Plus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0 -ml-16'
        } bg-sidebar transition-all duration-300 flex-shrink-0 overflow-hidden`}
      >
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-sidebar-foreground">
            <Database className="h-6 w-6 text-primary" />
            DB Canvas
          </Link>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent ${
                  location.pathname === '/' ? 'bg-sidebar-accent' : ''
                }`}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/projects" 
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent ${
                  location.pathname === '/projects' ? 'bg-sidebar-accent' : ''
                }`}
              >
                <Database className="h-5 w-5" />
                Projects
              </Link>
            </li>
            <li>
              <Link 
                to="/projects/new" 
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent ${
                  location.pathname === '/projects/new' ? 'bg-sidebar-accent' : ''
                }`}
              >
                <Plus className="h-5 w-5" />
                New Project
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-sidebar-border">
          <a 
            href="https://github.com/yourusername/db-canvas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground"
          >
            <Github className="h-4 w-4" />
            Star on GitHub
          </a>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/yourusername/db-canvas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
