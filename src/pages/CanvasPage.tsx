
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Share2, 
  User, 
  Menu, 
  Database, 
  Folder, 
  FilePlus, 
  Clock,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

// Mock project data
const mockProjects = [
  { id: 1, name: 'E-commerce Database', color: 'bg-purple-500', lastModified: '2 days ago' },
  { id: 2, name: 'Blog System', color: 'bg-teal-500', lastModified: '1 week ago' },
  { id: 3, name: 'User Management', color: 'bg-green-500', lastModified: '3 weeks ago' },
];

const CanvasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState(mockProjects);

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNewProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: `New Project ${projects.length + 1}`,
      color: `bg-${['purple', 'teal', 'green', 'blue', 'red'][Math.floor(Math.random() * 5)]}-500`,
      lastModified: 'Just now'
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-800 bg-black py-2 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-black border-gray-800 p-0 w-64">
                <SidebarContent 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                  filteredProjects={filteredProjects} 
                  createNewProject={createNewProject} 
                />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary" />
              <span className="text-lg font-bold">DBCanvas</span>
            </div>

            <Menubar className="ml-6 border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="text-gray-300 hover:bg-gray-800">File</MenubarTrigger>
                <MenubarContent className="bg-gray-900 border-gray-800">
                  <MenubarItem>
                    New Project <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Open Project <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Save <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-gray-300 hover:bg-gray-800">Edit</MenubarTrigger>
                <MenubarContent className="bg-gray-900 border-gray-800">
                  <MenubarItem>
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-gray-300 hover:bg-gray-800">View</MenubarTrigger>
                <MenubarContent className="bg-gray-900 border-gray-800">
                  <MenubarItem>Zoom In</MenubarItem>
                  <MenubarItem>Zoom Out</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Full Screen</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-gray-300 hover:bg-gray-800">Help</MenubarTrigger>
                <MenubarContent className="bg-gray-900 border-gray-800">
                  <MenubarItem>Documentation</MenubarItem>
                  <MenubarItem>Keyboard Shortcuts</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>About</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="text-xs border-purple-700 text-purple-300 hover:bg-purple-900/20 hover:text-purple-200">
              Upgrade
              <span className="ml-2 px-1.5 py-0.5 bg-purple-700 text-white text-[10px] rounded">7d left</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (visible on desktop) */}
        <div className={`border-r border-gray-800 bg-black w-64 flex-shrink-0 hidden md:block`}>
          <SidebarContent 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            filteredProjects={filteredProjects} 
            createNewProject={createNewProject}
          />
        </div>

        {/* Main Workspace */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-black">
          <div className="text-center">
            <Database className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No projects yet. Create one!</h2>
            <p className="text-gray-400 max-w-md mb-6">
              Start by creating a new project to visualize your database schema instantly.
            </p>
            <Button onClick={createNewProject} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar content component to avoid duplication
const SidebarContent = ({ searchTerm, setSearchTerm, filteredProjects, createNewProject }) => (
  <div className="flex flex-col h-full">
    <div className="p-4">
      <div className="relative mb-4">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects..."
          className="pl-9 bg-gray-900 border-gray-800 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Button 
        onClick={createNewProject}
        className="w-full bg-primary hover:bg-primary/90 mb-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>

      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium text-gray-400">Projects</span>
        <span className="text-gray-500">{filteredProjects.length}</span>
      </div>
    </div>

    <div className="flex-1 overflow-auto">
      {filteredProjects.length === 0 ? (
        <div className="p-4 text-gray-400 text-center text-sm">
          No projects found
        </div>
      ) : (
        <div className="space-y-1 p-1">
          {filteredProjects.map(project => (
            <Link
              key={project.id}
              to={`/canvas/${encodeURIComponent(project.name)}`}
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group"
            >
              <div className={`${project.color} w-3 h-full rounded-sm mr-3`}></div>
              <div className="flex-1">
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {project.lastModified}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>

    <div className="p-4 border-t border-gray-800">
      <Button variant="outline" className="w-full justify-between border-gray-700">
        <div className="flex items-center">
          <Folder className="h-4 w-4 mr-2" />
          <span>All Projects</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default CanvasPage;
