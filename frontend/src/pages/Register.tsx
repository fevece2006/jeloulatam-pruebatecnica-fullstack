import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/forms/RegisterForm';
import { Card } from '../components/ui/Card';

export const Register = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 px-4 py-12">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <Card className="relative w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/95">
        <div className="mb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">✨</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent">TaskHub</h1>
          <p className="mt-2 text-sm text-gray-600">Únete a nuestra comunidad</p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">¿Ya tienes cuenta? </span>
          <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all">
            Inicia sesión aquí
          </Link>
        </div>
      </Card>
    </div>
  );
};
