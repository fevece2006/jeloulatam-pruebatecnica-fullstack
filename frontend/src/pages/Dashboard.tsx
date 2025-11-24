import { useEffect, useState, useMemo } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { statsService } from '../services/statsService';
import { taskService } from '../services/taskService';
import type { Statistics, Task, Project } from '../types';
import { FiFolder, FiCheckSquare, FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

export const Dashboard = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, tasksData] = await Promise.all([
        statsService.getStatistics(),
        taskService.getTasks(),
      ]);
      
      setStats(statsData);
      setUserTasks(tasksData || []);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = useMemo(() => {
    // Extraer proyectos únicos de las tareas
    const projectsMap = new Map<number, Project>();
    userTasks.forEach(task => {
      if (task.project && !projectsMap.has(task.project.id)) {
        projectsMap.set(task.project.id, task.project);
      }
    });
    const userProjects = Array.from(projectsMap.values());

    // Filtrar proyectos donde el usuario es colaborador o propietario
    const relevantProjects = userProjects.filter(p => 
      p.owner?.id === user?.id || 
      p.collaborators?.some(c => c.id === user?.id)
    );

    const projectsAsOwner = relevantProjects.filter(p => p.owner?.id === user?.id).length;
    const projectsAsCollaborator = relevantProjects.filter(p => 
      p.collaborators?.some(c => c.id === user?.id) && p.owner?.id !== user?.id
    ).length;

    // Calcular estadísticas de tareas
    const pendingTasks = userTasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = userTasks.filter(t => t.status === 'in-progress').length;
    const completedTasks = userTasks.filter(t => t.status === 'completed').length;
    const tasksAssignedToMe = userTasks.filter(t => t.assignedUser?.id === user?.id).length;

    return {
      totalProjects: relevantProjects.length,
      projectsAsOwner,
      projectsAsCollaborator,
      totalTasks: userTasks.length,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      tasksAssignedToMe,
    };
  }, [userTasks, user?.id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Proyectos',
      value: dashboardStats.totalProjects,
      icon: FiFolder,
      color: 'bg-blue-500',
      description: `${dashboardStats.projectsAsOwner} como propietario`,
    },
    {
      title: 'Total Tareas',
      value: dashboardStats.totalTasks,
      icon: FiCheckSquare,
      color: 'bg-green-500',
      description: `${dashboardStats.tasksAssignedToMe} como colaborador responsable`,
    },
    {
      title: 'Tareas Pendientes',
      value: dashboardStats.pendingTasks,
      icon: FiClock,
      color: 'bg-yellow-500',
      description: 'Por completar',
    },
    {
      title: 'Tareas en Progreso',
      value: dashboardStats.inProgressTasks,
      icon: FiTrendingUp,
      color: 'bg-blue-600',
      description: 'En desarrollo',
    },
    {
      title: 'Tareas Completadas',
      value: dashboardStats.completedTasks,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      description: 'Finalizadas',
    },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{stat.title}</p>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.description}</p>
                  </div>
                  <div className={`rounded-xl ${stat.color} p-3 text-white shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-t-4 border-t-blue-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg">
                <FiCheckSquare className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Tareas por Estado
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Pendientes</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {dashboardStats.pendingTasks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">En Progreso</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {dashboardStats.inProgressTasks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Completadas</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {dashboardStats.completedTasks}
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-t-4 border-t-green-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-green-600 rounded-xl shadow-lg">
                <FiFolder className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Resumen de Proyectos
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 rounded-lg shadow-sm">
                    <FiFolder className="text-white h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Como propietario</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {dashboardStats.projectsAsOwner}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-600 rounded-lg shadow-sm">
                    <FiUsers className="text-white h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Como colaborador</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {dashboardStats.projectsAsCollaborator}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-600 rounded-lg shadow-sm">
                    <FiCheckSquare className="text-white h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Tareas asignadas a mí</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {dashboardStats.tasksAssignedToMe}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
