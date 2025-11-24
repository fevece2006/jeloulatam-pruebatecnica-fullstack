import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Modal } from '../components/ui/Modal';
import { ProjectForm } from '../components/forms/ProjectForm';
import { useProjectStore } from '../stores/projectStore';
import { FiFolder } from 'react-icons/fi';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/ui/Card';

export const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, loading, fetchProjects, createProject } = useProjectStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Detectar si estamos en /projects/new
  useEffect(() => {
    if (location.pathname === '/projects/new') {
      setIsCreateModalOpen(true);
    }
  }, [location.pathname]);

  const handleCreateProject = async (data: { name: string; description: string; color: string }) => {
    setIsSubmitting(true);
    try {
      const newProject = await createProject(data);
      setIsCreateModalOpen(false);
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    if (location.pathname === '/projects/new') {
      navigate('/projects');
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Todos los Proyectos</h1>
          <p className="text-gray-600 mt-1">Selecciona un proyecto del menú lateral o haz clic en una tarjeta</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FiFolder className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Owner: {project.owner?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title="Crear Nuevo Proyecto"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          isLoading={isSubmitting}
        />
      </Modal>
    </MainLayout>
  );
};
