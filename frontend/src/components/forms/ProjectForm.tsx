import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Project } from '../../types';

const projectSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color debe ser un código hexadecimal válido (ej: #3B82F6)'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  initialData?: Project;
  isLoading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData
      ? { name: initialData.name, description: initialData.description, color: initialData.color || '#3B82F6' }
      : { color: '#3B82F6' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-5">
        <Input
          {...register('name')}
          type="text"
          label="Nombre del proyecto"
          placeholder="Mi Proyecto Increíble"
          error={errors.name?.message}
        />
        
        <Textarea
          {...register('description')}
          label="Descripción"
          placeholder="Describe tu proyecto en detalle..."
          rows={5}
          error={errors.description?.message}
        />

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Color del proyecto
          </label>
          <div className="flex items-center gap-3">
            <input
              {...register('color')}
              type="color"
              className="h-11 w-20 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
            />
            <Input
              {...register('color')}
              type="text"
              placeholder="#3B82F6"
              className="flex-1"
              error={errors.color?.message}
            />
          </div>
          {errors.color && (
            <p className="mt-2 text-sm font-medium text-red-600">{errors.color.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button 
          type="submit" 
          isLoading={isLoading}
          className="min-w-[140px]"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  );
};
