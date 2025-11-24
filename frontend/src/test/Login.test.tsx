import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../pages/Login';

describe('Login Page', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByText('TaskHub')).toBeInTheDocument();
    expect(screen.getByText('Inicia sesión en tu cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
  });

  it('has a link to register page', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    const registerLink = screen.getByText('Regístrate aquí');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
