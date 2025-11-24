import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('¡Cuenta creada exitosamente!');
    } catch {
      toast.error('Error al registrarse. El email podría estar en uso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-transparent rounded-full"></div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Información</span>
          <div className="h-1 flex-1 bg-gradient-to-l from-purple-600 to-transparent rounded-full"></div>
        </div>
        <Input
          {...register('name')}
          type="text"
          label="Nombre completo"
          placeholder="Juan Pérez"
          error={errors.name?.message}
        />
      </div>
      
      <Input
        {...register('email')}
        type="email"
        label="Email"
        placeholder="tu@email.com"
        error={errors.email?.message}
      />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-transparent rounded-full"></div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Seguridad</span>
          <div className="h-1 flex-1 bg-gradient-to-l from-purple-600 to-transparent rounded-full"></div>
        </div>
        <Input
          {...register('password')}
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          error={errors.password?.message}
        />
        
        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirmar contraseña"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
        />
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full h-12 text-base font-semibold"
        >
          {isLoading ? 'Creando cuenta...' : '✨ Crear Cuenta'}
        </Button>
      </div>
    </form>
  );
};
