
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Position,
  ReactFlowProvider,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Save, ArrowLeft, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProject, updateProject } from '@/lib/db';
import { parseDBML, validateDBML, DbmlSchema } from '@/lib/dbml-utils';
import TableNode from '@/components/TableNode';
import CustomEdge from '@/components/CustomEdge';
import { useToast } from "@/hooks/use-toast";

const nodeTypes = {
  table: TableNode
};

const edgeTypes = {
  custom: CustomEdge
};

interface ProjectEditorProps {}

const ProjectEditor = ({}: ProjectEditorProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projectName, setProjectName] = useState('Untitled Project');
  const [dbmlCode, setDbmlCode] = useState('');
  const [originalDbmlCode, setOriginalDbmlCode] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [activeTab, setActiveTab] = useState<string>('dbml');
  const [lastParsedSchema, setLastParsedSchema] = useState<DbmlSchema | null>(null);
  const [isModified, setIsModified] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // For reactive updates
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'custom',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 }
    }, eds));
  }, [setEdges]);

  // Load project
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      
      try {
        const projectId = parseInt(id);
        const project = await getProject(projectId);
        
        if (!project) {
          toast({
            title: 'Error',
            description: 'Project not found',
            variant: 'destructive',
          });
          navigate('/projects');
          return;
        }
        
        setProjectName(project.name);
        setDbmlCode(project.dbml);
        setOriginalDbmlCode(project.dbml);
        
        if (project.jsonData) {
          setJsonData(project.jsonData);
        } else {
          // Generate JSON from DBML
          try {
            const schema = await parseDBML(project.dbml);
            const generatedJson = JSON.stringify(schema, null, 2);
            setJsonData(generatedJson);
          } catch (error) {
            console.error('Error generating JSON:', error);
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project',
          variant: 'destructive',
        });
      }
    };

    loadProject();
  }, [id, navigate, toast]);

  // Generate diagram whenever DBML changes
  useEffect(() => {
    const generateDiagram = async () => {
      if (!dbmlCode) return;
      
      try {
        const schema = await parseDBML(dbmlCode);
        setLastParsedSchema(schema);

        // Calculate positions (simple auto-layout)
        const tableWidth = 250;
        const tableHeight = 200;
        const padding = 50;
        const maxTablesPerRow = 3;

        // Create nodes
        const newNodes = schema.tables.map((table, index) => {
          const row = Math.floor(index / maxTablesPerRow);
          const col = index % maxTablesPerRow;
          
          return {
            id: table.name,
            type: 'table',
            position: {
              x: col * (tableWidth + padding) + padding,
              y: row * (tableHeight + padding) + padding,
            },
            data: {
              label: table.name,
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
          data: {
            label: `${ref.source.field} → ${ref.target.field}`
          }
        }));

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error('Error generating diagram:', error);
      }
    };

    generateDiagram();
  }, [dbmlCode, setNodes, setEdges]);

  // Check for modifications
  useEffect(() => {
    setIsModified(dbmlCode !== originalDbmlCode);
  }, [dbmlCode, originalDbmlCode]);

  // Save project
  const handleSave = async () => {
    if (!id) return;
    
    try {
      // Validate DBML first
      const validation = await validateDBML(dbmlCode);
      if (!validation.valid) {
        toast({
          title: 'Invalid DBML',
          description: validation.error || 'Please check your DBML syntax',
          variant: 'destructive',
        });
        return;
      }
      
      // Generate JSON data
      const schema = await parseDBML(dbmlCode);
      const generatedJson = JSON.stringify(schema, null, 2);
      
      await updateProject(parseInt(id), {
        dbml: dbmlCode,
        jsonData: generatedJson
      });
      
      setOriginalDbmlCode(dbmlCode);
      setJsonData(generatedJson);
      
      toast({
        title: 'Success',
        description: 'Project saved successfully',
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      });
    }
  };

  // Generate JSON from DBML
  const handleGenerateJson = async () => {
    try {
      // Validate DBML first
      const validation = await validateDBML(dbmlCode);
      if (!validation.valid) {
        toast({
          title: 'Invalid DBML',
          description: validation.error || 'Please check your DBML syntax',
          variant: 'destructive',
        });
        return;
      }
      
      const schema = await parseDBML(dbmlCode);
      const generatedJson = JSON.stringify(schema, null, 2);
      setJsonData(generatedJson);
      setActiveTab('json');
      
      toast({
        title: 'Success',
        description: 'JSON generated successfully',
      });
    } catch (error) {
      console.error('Error generating JSON:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate JSON',
        variant: 'destructive',
      });
    }
  };

  // Download DBML file
  const handleDownloadDbml = () => {
    const blob = new Blob([dbmlCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_').toLowerCase()}.dbml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download JSON file
  const handleDownloadJson = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Navbar */}
      <div className="border-b border-border flex items-center justify-between p-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/projects')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold truncate">{projectName}</h1>
          {isModified && (
            <span className="ml-2 text-sm text-muted-foreground">(Modified)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGenerateJson}>
            <Play className="mr-1 h-4 w-4" />
            Generate JSON
          </Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            <Save className="mr-1 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor */}
        <div className="w-1/2 flex flex-col border-r border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="border-b border-border">
              <TabsList className="w-full justify-start h-12 p-0 bg-transparent rounded-none">
                <TabsTrigger value="dbml" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none flex-1">
                  DBML Editor
                </TabsTrigger>
                <TabsTrigger value="json" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none flex-1">
                  JSON Output
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dbml" className="flex-1 overflow-hidden m-0">
              <div className="flex items-center justify-end p-1 gap-1 bg-secondary/50">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDownloadDbml}
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download DBML
                </Button>
              </div>
              <div className="h-full">
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
                    tabSize: 2
                  }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="flex-1 overflow-hidden m-0">
              <div className="flex items-center justify-end p-1 gap-1 bg-secondary/50">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDownloadJson}
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download JSON
                </Button>
              </div>
              <div className="h-full">
                <Editor
                  height="100%"
                  language="json"
                  theme="vs-dark"
                  value={jsonData}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    tabSize: 2
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Side: Flow diagram */}
        <div className="w-1/2 h-full">
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
            >
              <Background gap={15} size={1} color="#444444" />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
