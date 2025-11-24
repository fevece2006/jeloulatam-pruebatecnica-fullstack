import { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { userService } from '../services/userService';
import { FiUserPlus, FiX, FiSearch } from 'react-icons/fi';
import type { User, Project } from '../types';

interface CollaboratorManagerProps {
  project: Project;
  onAddCollaborator: (userId: number) => Promise<void>;
  onRemoveCollaborator: (userId: number) => Promise<void>;
}

export const CollaboratorManager: React.FC<CollaboratorManagerProps> = ({
  project,
  onAddCollaborator,
  onRemoveCollaborator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const users = await userService.searchUsers(searchQuery);
        // Filter out users already in the project
        const existingIds = new Set([
          project.owner?.id,
          ...(project.collaborators?.map(c => c.id) || [])
        ]);
        setSearchResults(users.filter(u => !existingIds.has(u.id)));
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, project]);

  const handleAddCollaborator = async (userId: number) => {
    setIsLoading(true);
    try {
      await onAddCollaborator(userId);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding collaborator:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este colaborador?')) return;
    setIsLoading(true);
    try {
      await onRemoveCollaborator(userId);
    } catch (error) {
      console.error('Error removing collaborator:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Collaborators */}
      <div>
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span className="text-base sm:text-lg">👥</span>
          Colaboradores Actuales
        </h3>
        
        <div className="space-y-2">
          {/* Owner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 gap-3 sm:gap-0">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-md text-sm sm:text-base">
                {project.owner?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">{project.owner?.name}</div>
                <div className="text-xs text-gray-500 break-all">{project.owner?.email}</div>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-600 text-white rounded-full shadow-sm whitespace-nowrap">
              👑 Propietario
            </span>
          </div>

          {/* Collaborators */}
          {project.collaborators && project.collaborators.length > 0 ? (
            project.collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200 gap-3 sm:gap-0"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-500 to-gray-600 text-white font-bold shadow-sm text-sm">
                    {collaborator.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{collaborator.name}</div>
                    <div className="text-xs text-gray-500 break-all">{collaborator.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCollaborator(collaborator.id)}
                  disabled={isLoading}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                  aria-label="Eliminar colaborador"
                >
                  <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              No hay colaboradores aún
            </div>
          )}
        </div>
      </div>

      {/* Add Collaborator */}
      <div>
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span className="text-base sm:text-lg">🔍</span>
          Agregar Colaborador
        </h3>
        
        <div className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isSearching ? (
                <Spinner size="sm" />
              ) : (
                <FiSearch className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200 gap-3 sm:gap-0"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-sm shadow-sm flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddCollaborator(user.id)}
                    disabled={isLoading}
                    className="shadow-sm w-full sm:w-auto flex-shrink-0"
                  >
                    <FiUserPlus className="mr-1 h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
            <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200">
              No se encontraron usuarios
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
