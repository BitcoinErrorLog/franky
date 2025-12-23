import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Copyright } from './Copyright';
import { normaliseRadixIds } from '@/libs/utils/utils';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Copyright', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders the form with default props', () => {
    render(<Copyright />);
    expect(screen.getByText('Copyright Removal Request')).toBeInTheDocument();
  });

  it('renders rights owner radio buttons', () => {
    render(<Copyright />);
    expect(screen.getByLabelText(/I am the rights owner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I am reporting on behalf of my organization or client/i)).toBeInTheDocument();
  });

  it('renders all form sections', () => {
    render(<Copyright />);
    expect(screen.getByText('Rights Owner Information')).toBeInTheDocument();
    expect(screen.getByText('Infringing work details')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Signature')).toBeInTheDocument();
  });

  it('renders all required input fields', () => {
    render(<Copyright />);
    expect(screen.getByPlaceholderText('Name of the rights owner')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter URLs of your original content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe your original content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter URLs of infringing content on Pubky')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Satoshi')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nakamoto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000-000-0000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Street number and name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('United States')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<Copyright />);
    expect(screen.getByRole('button', { name: /Submit Form/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<Copyright />);
    const submitButton = screen.getByRole('button', { name: /Submit Form/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name of rights owner is required')).toBeInTheDocument();
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<Copyright />);

    // Fill in required fields with invalid email
    fireEvent.change(screen.getByPlaceholderText('Name of the rights owner'), { target: { value: 'Test Owner' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URLs of your original content'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your original content'), {
      target: { value: 'Test description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter URLs of infringing content on Pubky'), {
      target: { value: 'https://pubky.app/post/123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Satoshi'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Nakamoto'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('000-000-0000'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByPlaceholderText('Street number and name'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('United States'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('City name'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByPlaceholderText('State name'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '10001' } });
    fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: 'John Doe' } });

    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Success' }) });

    render(<Copyright />);

    // Fill all required fields
    fireEvent.change(screen.getByPlaceholderText('Name of the rights owner'), { target: { value: 'Test Owner' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URLs of your original content'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your original content'), {
      target: { value: 'Test description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter URLs of infringing content on Pubky'), {
      target: { value: 'https://pubky.app/post/123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Satoshi'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Nakamoto'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('000-000-0000'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByPlaceholderText('Street number and name'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('United States'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('City name'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByPlaceholderText('State name'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '10001' } });
    fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: 'John Doe' } });

    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Request Submitted')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/chatwoot', expect.any(Object));
  });

  it('shows success message after submission', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Success' }) });

    render(<Copyright />);

    // Fill all required fields
    fireEvent.change(screen.getByPlaceholderText('Name of the rights owner'), { target: { value: 'Test Owner' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URLs of your original content'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your original content'), {
      target: { value: 'Test description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter URLs of infringing content on Pubky'), {
      target: { value: 'https://pubky.app/post/123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Satoshi'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Nakamoto'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('000-000-0000'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByPlaceholderText('Street number and name'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('United States'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('City name'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByPlaceholderText('State name'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '10001' } });
    fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: 'John Doe' } });

    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Your copyright removal request has been submitted successfully. We will review it and respond within one week.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('allows submitting another request after success', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Success' }) });

    render(<Copyright />);

    // Fill all required fields and submit
    fireEvent.change(screen.getByPlaceholderText('Name of the rights owner'), { target: { value: 'Test Owner' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URLs of your original content'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your original content'), {
      target: { value: 'Test description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter URLs of infringing content on Pubky'), {
      target: { value: 'https://pubky.app/post/123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Satoshi'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Nakamoto'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('000-000-0000'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByPlaceholderText('Street number and name'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('United States'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('City name'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByPlaceholderText('State name'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '10001' } });
    fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: 'John Doe' } });

    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Request Submitted')).toBeInTheDocument();
    });

    // Click "Submit Another Request"
    fireEvent.click(screen.getByRole('button', { name: /Submit Another Request/i }));

    // Form should be visible again
    expect(screen.getByText('Copyright Removal Request')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Copyright className="custom-copyright" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('Copyright - Snapshots', () => {
  it('matches snapshot with default props', () => {
    const { container } = render(<Copyright />);
    const normalisedContainer = normaliseRadixIds(container);
    expect(normalisedContainer.innerHTML).toMatchSnapshot();
  });
});
