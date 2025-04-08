
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, Trash2, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjects, deleteProject, Project } from '@/lib/db';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(project => project.id !== id));
        toast({
          title: 'Success',
          description: 'Project deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting project:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete project',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-border rounded-lg">
          <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first database schema project to get started.
          </p>
          <Button asChild>
            <Link to="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h3 className="text-xl font-semibold truncate">{project.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Updated {project.updatedAt ? format(new Date(project.updatedAt), 'PPp') : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/projects/${project.id}`}>
                    Open
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => project.id && handleDelete(project.id)}
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
