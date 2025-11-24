import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../components/ui/Badge';

describe('Badge Component', () => {
  it('renders with children', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies status variant colors correctly', () => {
    const { rerender } = render(<Badge variant="status" status="pending">Pendiente</Badge>);
    let badge = screen.getByText('Pendiente');
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');

    rerender(<Badge variant="status" status="in-progress">En Progreso</Badge>);
    badge = screen.getByText('En Progreso');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');

    rerender(<Badge variant="status" status="completed">Completada</Badge>);
    badge = screen.getByText('Completada');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('applies priority variant colors correctly', () => {
    const { rerender } = render(<Badge variant="priority" priority="low">Baja</Badge>);
    let badge = screen.getByText('Baja');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');

    rerender(<Badge variant="priority" priority="medium">Media</Badge>);
    badge = screen.getByText('Media');
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');

    rerender(<Badge variant="priority" priority="high">Alta</Badge>);
    badge = screen.getByText('Alta');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });
});
