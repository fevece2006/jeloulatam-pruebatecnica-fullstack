import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/forms/TaskForm';
import { useProjectStore } from '../stores/projectStore';
import { useTaskStore } from '../stores/taskStore';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { FiPlus, FiTrash2, FiEdit, FiUsers } from 'react-icons/fi';
import type { Task, TaskStatus, User } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

const TASK_COLUMNS = [
  { status: 'pending' as TaskStatus, title: 'Pendiente', color: 'from-yellow-500 to-orange-500' },
  { status: 'in-progress' as TaskStatus, title: 'En Progreso', color: 'from-blue-500 to-indigo-500' },
  { status: 'completed' as TaskStatus, title: 'Completado', color: 'from-green-500 to-emerald-500' },
];

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  
  const { projects } = useProjectStore();
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, updateTaskStatus } = useTaskStore();
  
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    if (projectId) {
      fetchTasks({ projectId });
    }
  }, [projectId, fetchTasks]);

  useEffect(() => {
    const loadCollaborators = async () => {
      if (!projectId) return;
      try {
        const collaborators = await projectService.getCollaborators(projectId);
        setUsers(collaborators);
      } catch (error) {
        console.error('Error loading collaborators:', error);
        setUsers([]);
      }
    };
    loadCollaborators();
  }, [projectId]);

  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const all = await userService.getAllUsers();
        setAllUsers(all);
      } catch (error) {
        console.error('Error loading all users:', error);
      }
    };
    loadAllUsers();
  }, []);

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
      setIsCreateTaskModalOpen(false);
      await fetchTasks({ projectId });
    } catch (error) {
      console.error('Error creating task:', error);
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
      setIsEditTaskModalOpen(false);
      setSelectedTask(null);
      await fetchTasks({ projectId });
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    try {
      await deleteTask(taskId);
      await fetchTasks({ projectId });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddCollaborators = async () => {
    if (selectedUserIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await projectService.addCollaboratorsBulk(projectId, selectedUserIds);
      setIsCollaboratorsModalOpen(false);
      setSelectedUserIds([]);
      // Recargar colaboradores
      const collaborators = await projectService.getCollaborators(projectId);
      setUsers(collaborators);
    } catch (error) {
      console.error('Error adding collaborators:', error);
      alert('Error al agregar colaboradores');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUser = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const availableUsers = allUsers.filter(
    user => !users.some(collab => collab.id === user.id)
  );

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, status);
      await fetchTasks({ projectId });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  if (!project) {
    return (
      <MainLayout>
        <div className="p-6">
          <p className="text-gray-600">Proyecto no encontrado</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header del proyecto */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollaboratorsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <FiUsers className="h-5 w-5" />
              Agregar Colaboradores
            </button>
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FiPlus className="h-5 w-5" />
              Nueva tarea
            </button>
          </div>
        </div>

        {/* Título de Tareas */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tareas</h2>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {TASK_COLUMNS.map(column => (
              <div key={column.status} className="flex flex-col min-w-0">
                {/* Encabezado de columna */}
                <div className={`bg-gradient-to-r ${column.color} text-white px-4 py-3 rounded-t-lg`}>
                  <h2 className="font-semibold text-base md:text-lg">
                    {column.title}
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded text-sm">
                      {getTasksByStatus(column.status).length}
                    </span>
                  </h2>
                </div>

                {/* Lista de tareas */}
                <div className="flex-1 bg-gray-50 rounded-b-lg p-4 space-y-3 min-h-[500px]">
                  {getTasksByStatus(column.status).map(task => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setIsEditTaskModalOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                      <div className="flex items-center justify-between">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200/50"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in-progress">En Progreso</option>
                          <option value="completed">Completado</option>
                        </select>

                        {task.assignedUser && (
                          <span className="text-xs text-gray-500">
                            {task.assignedUser.name}
                          </span>
                        )}
                      </div>

                      {task.dueDate && (
                        <div className="mt-2 text-xs text-gray-500">
                          Vence: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <Modal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        title="Crear Nueva Tarea"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          projects={projects}
          collaborators={users}
          isLoading={isSubmitting}
          currentProjectId={projectId}
        />
      </Modal>

      <Modal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setSelectedTask(null);
        }}
        title="Editar Tarea"
        size="lg"
      >
        {selectedTask && (
          <TaskForm
            initialData={selectedTask}
            onSubmit={handleUpdateTask}
            projects={projects}
            collaborators={users}
            isLoading={isSubmitting}
            currentProjectId={projectId}
          />
        )}
      </Modal>

      {/* Modal de Agregar Colaboradores */}
      <Modal
        isOpen={isCollaboratorsModalOpen}
        onClose={() => {
          setIsCollaboratorsModalOpen(false);
          setSelectedUserIds([]);
        }}
        title="Agregar Colaboradores al Proyecto"
        size="md"
      >
        <div className="space-y-4">
          {availableUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay usuarios disponibles para agregar
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Selecciona uno o más usuarios para agregar como colaboradores:
              </p>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availableUsers.map(user => (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedUserIds.includes(user.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedUserIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900">
                    {selectedUserIds.length} usuario{selectedUserIds.length !== 1 ? 's' : ''} seleccionado{selectedUserIds.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsCollaboratorsModalOpen(false);
                    setSelectedUserIds([]);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  onClick={handleAddCollaborators}
                  isLoading={isSubmitting}
                  disabled={selectedUserIds.length === 0}
                >
                  Agregar ({selectedUserIds.length})
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </MainLayout>
  );
};
