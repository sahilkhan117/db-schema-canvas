
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  ReactFlowProvider, 
  MarkerType,
  Panel
} from '@xyflow/react';
import { 
  Database, 
  ArrowLeft, 
  Save, 
  Copy, 
  Download, 
  Search,
  Share2,
  User,
  ZoomIn,
  ZoomOut,
  Lock,
  Clock,
  ChevronDown,
  Menu,
  FilePlus,
  Plus,
  Folder,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { parseDBML } from '@/lib/dbml-utils';
import TableNode from '@/components/TableNode';
import CustomEdge from '@/components/CustomEdge';
import { useToast } from "@/hooks/use-toast";

const nodeTypes = { table: TableNode };
const edgeTypes = { custom: CustomEdge };

// Default DBML code for new users
const DEFAULT_DBML = `// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table users {
  id integer [primary key]
  username varchar
  email varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer
  status post_status
  created_at timestamp
}

Enum post_status {
  draft
  published
  archived
}

Ref: posts.user_id > users.id // many-to-one
`;

// Mock project data
const mockProjects = [
  { id: 1, name: 'E-commerce Database', color: 'bg-purple-500', lastModified: '2 days ago' },
  { id: 2, name: 'Blog System', color: 'bg-teal-500', lastModified: '1 week ago' },
  { id: 3, name: 'User Management', color: 'bg-green-500', lastModified: '3 weeks ago' },
];

const ProjectPage = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dbmlCode, setDbmlCode] = useState(DEFAULT_DBML);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Generate diagram whenever DBML changes
  useEffect(() => {
    const generateDiagram = async () => {
      if (!dbmlCode) return;
      
      try {
        const schema = await parseDBML(dbmlCode);
        
        // Calculate positions (simple auto-layout)
        const tableWidth = 250;
        const tableHeight = 200;
        const padding = 50;
        const maxTablesPerRow = 3;

        // Create nodes
        const newNodes = schema.tables.map((table, index) => {
          const row = Math.floor(index / maxTablesPerRow);
          const col = index % maxTablesPerRow;
          
          // Random colors for table headers based on table name
          const colors = ['purple', 'teal', 'green', 'blue', 'indigo', 'pink'];
          const colorIndex = Math.abs(table.name.charCodeAt(0) % colors.length);
          const color = colors[colorIndex];
          
          return {
            id: table.name,
            type: 'table',
            position: {
              x: col * (tableWidth + padding) + padding,
              y: row * (tableHeight + padding) + padding,
            },
            data: {
              label: table.name,
              color,
              fields: table.fields.map(field => ({
                name: field.name,
                type: field.type,
                isPrimary: field.pk,
                isUnique: field.unique,
                isNotNull: field.notNull,
                isForeignKey: !!field.fk
              }))
            }
          };
        });

        // Create edges
        const newEdges = schema.refs.map((ref, index) => ({
          id: `e-${index}`,
          source: ref.source.table,
          target: ref.target.table,
          sourceHandle: null,
          targetHandle: null,
          type: 'custom',
          markerEnd: { type: MarkerType.ArrowClosed },
          animated: false,
          style: { stroke: '#4f92ff', strokeWidth: 2 },
          label: `${ref.source.field} → ${ref.target.field}`,
          labelStyle: { fill: 'white', fontWeight: 500 },
          labelBgStyle: { fill: 'rgba(0, 0, 0, 0.7)' }
        }));

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error('Error generating diagram:', error);
      }
    };

    generateDiagram();
  }, [dbmlCode, setNodes, setEdges]);
  
  // Handle connections between nodes
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'custom',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 }
    }, eds));
  }, [setEdges]);

  // Save DBML code
  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Your DBML has been saved",
    });
  };

  // Copy DBML to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(dbmlCode);
    toast({
      title: "Copied",
      description: "DBML copied to clipboard",
    });
  };

  // Download DBML file
  const handleDownload = () => {
    const blob = new Blob([dbmlCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'dbdiagram'}.dbml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 10));
  };

  const filteredProjects = mockProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNewProject = () => {
    navigate('/canvas');
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
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/canvas')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

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
                  <MenubarItem onClick={handleSave}>
                    Save <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={handleDownload}>
                    Export DBML <MenubarShortcut>⌘E</MenubarShortcut>
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
                  <MenubarSeparator />
                  <MenubarItem onClick={handleCopy}>
                    Copy DBML <MenubarShortcut>⌘C</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-gray-300 hover:bg-gray-800">View</MenubarTrigger>
                <MenubarContent className="bg-gray-900 border-gray-800">
                  <MenubarItem onClick={handleZoomIn}>Zoom In</MenubarItem>
                  <MenubarItem onClick={handleZoomOut}>Zoom Out</MenubarItem>
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

            <div className="h-6 mx-4 border-r border-gray-700"></div>

            <div className="flex items-center">
              <span className="font-medium">Diagram 1</span>
              <span className="mx-2 text-gray-500">|</span>
              <div className="flex items-center text-green-400 text-sm">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-1"></div>
                <span>Private</span>
              </div>
              <Clock className="ml-3 h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400 ml-1">1 week ago</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="text-xs border-purple-700 text-purple-300 hover:bg-purple-900/20 hover:text-purple-200">
              Upgrade
              <span className="ml-2 px-1.5 py-0.5 bg-purple-700 text-white text-[10px] rounded">7d left</span>
            </Button>
            <Button variant="default" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
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
        <div className="border-r border-gray-800 bg-black w-64 flex-shrink-0 hidden md:block">
          <SidebarContent 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            filteredProjects={filteredProjects} 
            createNewProject={createNewProject}
            currentProject={projectName}
          />
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* DBML Editor Section */}
          <div className="w-1/3 h-full flex flex-col border-r border-gray-800">
            <div className="border-b border-gray-800 bg-gray-900/30 py-2 px-4 flex items-center justify-between">
              <span className="font-medium">DBML Editor</span>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={dbmlCode}
                onChange={(value) => setDbmlCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 2,
                }}
              />
            </div>
          </div>

          {/* Diagram Visualization Section */}
          <div className="w-2/3 h-full relative">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                snapToGrid={true}
                snapGrid={[15, 15]}
                attributionPosition="bottom-right"
                proOptions={{ hideAttribution: true }}
              >
                <Background gap={15} size={1} color="#333333" />
                <Controls 
                  position="bottom-right" 
                  showInteractive={false} 
                  className="bg-gray-800/70 border-gray-700 rounded-md p-2"
                />
                <Panel position="top-right" className="bg-black/70 p-2 rounded-md border border-gray-700">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <span className="bg-gray-700 px-2 rounded flex items-center text-sm">
                      {zoomLevel}%
                    </span>
                    <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </div>
                </Panel>
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar content component to avoid duplication
const SidebarContent = ({ searchTerm, setSearchTerm, filteredProjects, createNewProject, currentProject }) => (
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
        <FilePlus className="h-4 w-4 mr-2" />
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
            <a
              key={project.id}
              href={`/canvas/${encodeURIComponent(project.name)}`}
              className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group ${
                currentProject === project.name ? 'bg-gray-800' : ''
              }`}
            >
              <div className={`${project.color} w-3 h-full rounded-sm mr-3`}></div>
              <div className="flex-1">
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {project.lastModified}
                </div>
              </div>
            </a>
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

export default ProjectPage;
