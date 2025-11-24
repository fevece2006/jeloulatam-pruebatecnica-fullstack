import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { TaskForm } from '../components/forms/TaskForm';
import { useTaskStore } from '../stores/taskStore';
import { useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';
import { FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiClock } from 'react-icons/fi';
import type { Task, TaskStatus } from '../types';

export const Tasks = () => {
  const { tasks, loading, fetchTasks, deleteTask, createTask, updateTask, updateTaskStatus, setFilters } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      setFilters({ projectId: selectedProjectId });
      fetchTasks({ projectId: selectedProjectId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  const handleCreateTask = async (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: 'low' | 'medium' | 'high';
    projectId: number;
    assignedUserId?: number;
    dueDate?: string;
  }) => {
    setIsSubmitting(true);
    try {
      await createTask(data);
      setIsCreateModalOpen(false);
      if (selectedProjectId) {
        fetchTasks({ projectId: selectedProjectId });
      }
    } catch {
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: 'low' | 'medium' | 'high';
    assignedUserId?: number;
    dueDate?: string;
  }) => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      await updateTask(selectedTask.id, data);
      setIsEditModalOpen(false);
      setSelectedTask(null);
      if (selectedProjectId) {
        fetchTasks({ projectId: selectedProjectId });
      }
    } catch {
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    try {
      await deleteTask(taskId);
      if (selectedProjectId) {
        fetchTasks({ projectId: selectedProjectId });
      }
    } catch {
      // Error handled by store
    }
  };

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, status);
      if (selectedProjectId) {
        fetchTasks({ projectId: selectedProjectId });
      }
    } catch {
      // Error handled by store
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const canEditTask = () => {
    return selectedProject?.owner?.id === user?.id;
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'pending', title: 'Pendiente', color: 'from-yellow-500 to-orange-500' },
    { status: 'in-progress', title: 'En Progreso', color: 'from-blue-500 to-indigo-500' },
    { status: 'completed', title: 'Completado', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Project Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <Select
                value={String(selectedProjectId || '')}
                onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
                options={[
                  { value: '', label: 'Selecciona un proyecto' },
                  ...projects.map((p) => ({ value: String(p.id), label: p.name })),
                ]}
                label="Proyecto"
                className="flex-1 max-w-md"
              />
              {selectedProjectId && (
                <Button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="shadow-lg"
                >
                  <FiPlus className="mr-2" />
                  Agregar
                </Button>
            )}
          </div>
        </div>

        {/* Project Header */}
        {selectedProject && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedProjectId(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        {selectedProject ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columns.map(column => {
              const columnTasks = getTasksByStatus(column.status);
              return (
                <div key={column.status} className="flex flex-col">
                  <div className={`bg-gradient-to-r ${column.color} text-white px-4 py-3 rounded-t-xl`}>
                    <h2 className="font-bold text-lg">{column.title}</h2>
                  </div>
                  <div className="bg-gray-50 rounded-b-xl p-4 flex-1 space-y-4 min-h-[400px]">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                      </div>
                    ) : columnTasks.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p className="text-sm">No hay tareas</p>
                      </div>
                    ) : (
                      columnTasks.map(task => (
                        <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 flex-1">{task.title}</h3>
                            {canEditTask() && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <FiEdit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <Select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                              options={[
                                { value: 'pending', label: 'Pendiente' },
                                { value: 'in-progress', label: 'En Progreso' },
                                { value: 'completed', label: 'Completada' },
                              ]}
                              className="text-xs flex-1"
                            />
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                                <FiClock className="h-3 w-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecciona un proyecto</h3>
              <p className="text-gray-600">Elige un proyecto para ver y gestionar sus tareas</p>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nueva Tarea"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          projects={projects.filter(p => p.id === selectedProjectId)}
          collaborators={selectedProject?.collaborators || []}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        title="Editar Tarea"
        size="lg"
      >
        {selectedTask && (
          <TaskForm
            onSubmit={handleUpdateTask}
            initialData={selectedTask}
            projects={projects.filter(p => p.id === selectedProjectId)}
            collaborators={selectedProject?.collaborators || []}
            isLoading={isSubmitting}
          />
        )}
      </Modal>
    </div>
    </Layout>
  );
};
