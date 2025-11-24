
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('¡Bienvenido!');
    } catch (error) {
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('email')}
        type="email"
        placeholder="Usuario"
        error={errors.email?.message}
        className="h-14 px-6 text-base"
      />
      
      <Input
        {...register('password')}
        type="password"
        placeholder="Contraseña"
        error={errors.password?.message}
        showPasswordToggle={true}
        className="h-14 px-6 text-base"
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full h-14 text-base font-medium bg-cyan-400 hover:bg-cyan-500 text-white rounded-xl shadow-md"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </div>
    </form>
  );
};