import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useProjectStore } from '../../stores/projectStore';
import { FiHome, FiX, FiFolder, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, fetchProjects, deleteProject } = useProjectStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (location.pathname.startsWith('/projects')) {
      fetchProjects();
    }
  }, [location.pathname, fetchProjects]);

  const isActive = (path: string) => location.pathname === path;
  const isProjectActive = (projectId: number) => location.pathname === `/projects/${projectId}`;
  const isProjectsSection = location.pathname.startsWith('/projects');

  const handleDeleteProject = async (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;
    
    try {
      await deleteProject(projectId);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 ${
        isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
      }`}>
        {/* Header del sidebar */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-cyan-500 whitespace-nowrap">Gestión de proyectos</h1>
        </div>

        {/* Navegación */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              isActive('/dashboard')
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiHome className="h-5 w-5 text-gray-400" />
            <span>Dashboard</span>
          </Link>

          {/* Proyectos */}
          <div className="mt-4">
            <Link
              to="/projects"
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors mb-2 ${
                location.pathname.startsWith('/projects')
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FiFolder className="h-5 w-5 text-gray-400" />
                <span>Proyectos</span>
              </div>
              <Link
                to="/projects/new"
                onClick={(e) => e.stopPropagation()}
                className="text-xs px-3 py-1 border-2 border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors font-medium"
              >
                Agregar
              </Link>
            </Link>

            {/* Lista de proyectos */}
            {isProjectsSection && (
              <div className="mt-2 space-y-1">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`flex items-center justify-between group px-4 py-2 rounded-lg transition-colors ${
                      isProjectActive(project.id)
                        ? 'bg-blue-100 text-blue-900 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="flex-1 text-left"
                    >
                      {project.name}
                    </button>
                    {user?.id === project.owner?.id && (
                      <button
                        onClick={(e) => handleDeleteProject(e, project.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                      >
                        <FiX className="h-4 w-4 text-gray-400 hover:text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header superior */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* Botón para toggle del sidebar */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <FiChevronLeft className="h-6 w-6 text-gray-600" />
            ) : (
              <FiChevronRight className="h-6 w-6 text-gray-600" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hola, <strong>{user?.name}</strong></span>
            <button
              onClick={logout}
              className="px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
