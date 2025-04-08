
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Github } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ff0066] to-[#7928ca] text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Database className="h-6 w-6 mr-2" />
          <span className="text-xl font-bold">DBCanvas</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:underline">Features</Link>
          <Link to="/" className="hover:underline">Examples</Link>
          <Link to="/" className="hover:underline">Docs</Link>
          <Link to="/" className="hover:underline">Pricing</Link>
          <Button variant="outline" className="text-white border-white hover:bg-white/10">
            Feedback
          </Button>
          <Button asChild className="bg-white text-pink-600 hover:bg-white/90">
            <Link to="/canvas">
              Go to App
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Visualize your DB via <br />
              <span className="text-black">one-single query</span>
            </h1>
            <p className="text-xl mb-4">
              Free and open source, database design editor.<br />
              <span className="font-bold">No signup</span> → get a diagram in just 15sec
            </p>
            <div className="flex space-x-4 mt-8">
              <Button asChild size="lg" className="bg-white text-pink-600 hover:bg-white/90">
                <Link to="/canvas">
                  Go to App <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Go to Repo
                </a>
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-80">
              All without database access
            </p>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/lovable-uploads/fb9ab945-8700-45f2-8c01-8bc48153fb93.png" 
              alt="Database Visualization" 
              className="w-full max-w-md mx-auto" 
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white text-black py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800 mb-4">
                Editor
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Faster and easier<br />
                Database<br />
                diagramming
              </h2>
              <p className="text-gray-700 mb-6">
                Build diagrams with a few clicks, see the full picture, export SQL scripts, customize your editor, and more.
              </p>
              <div className="flex space-x-8 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Import / Export</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% Visually</span>
                </div>
              </div>
              <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white">
                <Link to="/canvas">
                  Quick Start
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <span className="h-2 w-2 bg-white rounded-full mr-1"></span> Public
                </div>
                <img 
                  src="/lovable-uploads/4b93f423-3b83-441d-ac44-928a7330c1d4.png" 
                  alt="Database Schema Example" 
                  className="w-full rounded-lg shadow-lg" 
                />
                <div className="absolute bottom-2 left-2 flex items-center text-xs bg-black/50 text-white px-2 py-1 rounded">
                  <Database className="h-3 w-3 mr-1" /> Powered by ChartDB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Database className="h-5 w-5 mr-2" />
              <span className="font-bold">DBCanvas</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="hover:underline">Browse</Link>
              <Link to="/" className="hover:underline">Team</Link>
              <Link to="/" className="hover:underline">Legal</Link>
              <Link to="/" className="hover:underline">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
