
import { useState, useEffect, useCallback } from 'react';
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
import { parseDBML } from '@/lib/dbml-utils';
import TableNode from '@/components/TableNode';
import CustomEdge from '@/components/CustomEdge';
import { Button } from '@/components/ui/button';
import { Save, Copy, Download, ZoomIn, ZoomOut } from 'lucide-react';
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

const EditorView = () => {
  const { toast } = useToast();
  const [dbmlCode, setDbmlCode] = useState(DEFAULT_DBML);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Handle connections between nodes
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'custom',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 }
    }, eds));
  }, [setEdges]);

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

  // Save DBML code
  const handleSave = () => {
    // In a real app, you'd save to a database or local storage here
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
    a.download = `dbdiagram.dbml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen w-screen flex bg-black">
      {/* Left side: Monaco Editor */}
      <div className="w-1/3 h-full editor-panel">
        <div className="top-bar">
          <div className="top-bar-title">DBML Editor</div>
          <div className="action-buttons">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSave}
            >
              <Save className="mr-1 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
        <div className="h-[calc(100%-3rem)]">
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
      
      {/* Right side: Flow diagram */}
      <div className="w-2/3 h-full canvas-container">
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
            <Background gap={15} size={1} color="#222222" />
            <Controls />
            <Panel position="top-right" className="bg-black/50 p-2 rounded">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default EditorView;
