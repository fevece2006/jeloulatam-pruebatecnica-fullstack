import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { FiHome, FiFolder, FiCheckSquare, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/projects', label: 'Proyectos', icon: FiFolder },
    { path: '/tasks', label: 'Tareas', icon: FiCheckSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  <FiCheckSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">TaskHub</h1>
              </div>
            </div>
            <div className="hidden sm:ml-8 md:ml-10 sm:flex sm:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-white/90 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-3">
            <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-md border border-white/10">
              <span className="text-sm text-white/80">Hola, </span>
              <span className="font-bold text-white">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-md border border-white/10 hover:border-white/30"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 transition-all duration-200"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-md border-t border-white/20 shadow-lg">
          <div className="space-y-2 px-4 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-gray-800 truncate">{user?.name}</div>
                <div className="text-sm text-gray-500 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <FiLogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
