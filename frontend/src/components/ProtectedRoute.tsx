import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Spinner } from './ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Spinner size="lg" />
          </div>
          <p className="text-lg font-medium text-gray-700">Verificando autenticación...</p>
          <p className="mt-2 text-sm text-gray-500">Por favor espera un momento</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};