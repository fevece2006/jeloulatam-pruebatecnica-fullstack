import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Task, Project, User } from '../../types';

const taskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  projectId: z.string().min(1, 'Debes seleccionar un proyecto'),
  assignedUserId: z.string().optional(),
  dueDate: z.string().optional(),
});

type TaskFormInputs = z.infer<typeof taskSchema>;

type TaskFormData = {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  projectId: number;
  assignedUserId?: number;
  dueDate?: string;
};

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Task;
  projects: Project[];
  collaborators?: User[];
  isLoading?: boolean;
  currentProjectId?: number;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData,
  projects,
  collaborators = [],
  isLoading = false,
  currentProjectId,
}) => {
  console.log('TaskForm - initialData:', initialData);
  console.log('TaskForm - assignedUserId from initialData:', initialData?.assignedUserId);
  console.log('TaskForm - assignedUser from initialData:', initialData?.assignedUser);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          status: initialData.status,
          priority: initialData.priority,
          projectId: currentProjectId ? String(currentProjectId) : String(initialData.projectId),
          assignedUserId: initialData.assignedUserId ? String(initialData.assignedUserId) : (initialData.assignedUser?.id ? String(initialData.assignedUser.id) : ''),
          dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : undefined,
        }
      : {
          status: 'pending',
          priority: 'medium',
          projectId: currentProjectId ? String(currentProjectId) : '',
        },
  });

  useEffect(() => {
    if (initialData) {
      const formValues = {
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        priority: initialData.priority,
        projectId: currentProjectId ? String(currentProjectId) : String(initialData.projectId),
        assignedUserId: initialData.assignedUserId ? String(initialData.assignedUserId) : (initialData.assignedUser?.id ? String(initialData.assignedUser.id) : ''),
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : undefined,
      };
      console.log('Resetting form with values:', formValues);
      reset(formValues);
    }
  }, [initialData, currentProjectId, reset]);

  const onFormSubmit: SubmitHandler<TaskFormInputs> = (data) => {
    return onSubmit({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: parseInt(data.projectId, 10),
      assignedUserId: data.assignedUserId && data.assignedUserId !== '' ? parseInt(data.assignedUserId, 10) : undefined,
      dueDate: data.dueDate,
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  const projectOptions = [
    { value: '', label: 'Selecciona un proyecto' },
    ...projects.map((p) => ({ value: String(p.id), label: p.name })),
  ];

  const userOptions = [
    { value: '', label: 'Sin asignar' },
    ...collaborators.map((u) => ({ value: String(u.id), label: u.name })),
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">Información Básica</h3>
        
        <Input
          {...register('title')}
          type="text"
          label="Título de la tarea"
          placeholder="Implementar login"
          error={errors.title?.message}
        />
        
        <Textarea
          {...register('description')}
          label="Descripción"
          placeholder="Describe la tarea..."
          rows={5}
          error={errors.description?.message}
        />
      </div>
      
      {/* Estado y Prioridad */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">Estado y Prioridad</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            {...register('status')}
            label="Estado"
            options={statusOptions}
            error={errors.status?.message}
          />
          
          <Select
            {...register('priority')}
            label="Prioridad"
            options={priorityOptions}
            error={errors.priority?.message}
          />
        </div>
      </div>
      
      {/* Asignación */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">Asignación</h3>
        
        <Select
          {...register('projectId')}
          label="Proyecto"
          options={projectOptions}
          error={errors.projectId?.message}
          disabled={!!initialData || !!currentProjectId}
        />
        
        <Select
          {...register('assignedUserId')}
          label="Colaborador responsable"
          options={userOptions}
          error={errors.assignedUserId?.message}
        />
        
        <Input
          {...register('dueDate')}
          type="date"
          label="Fecha de vencimiento (opcional)"
          error={errors.dueDate?.message}
        />
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
        </Button>
      </div>
    </form>
  );
};
