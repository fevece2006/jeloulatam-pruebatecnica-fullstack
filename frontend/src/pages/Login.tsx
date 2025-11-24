import { Link } from 'react-router-dom';
import { LoginForm } from '../components/forms/LoginForm';

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl px-8 py-10">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
            <p className="text-gray-600">Gestión de Proyectos</p>
          </div>
          
          <LoginForm />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <Link to="/register" className="font-medium text-cyan-500 hover:text-cyan-600 transition-colors">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
