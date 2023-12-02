import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../pages/LandingPage/components/LoginForm';

test('renders login form and submits', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <LoginForm />
    </MemoryRouter>
  );

  // Find form elements by data-testid
  const emailInput = screen.getByTestId('email-input');
  const passwordInput = screen.getByTestId('password-input');
  const submitButton = screen.getByTestId('submit-button');

  // Simulate user input
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Submit form
  fireEvent.click(submitButton);

  // Add assertions based on your expected behavior after form submission
});