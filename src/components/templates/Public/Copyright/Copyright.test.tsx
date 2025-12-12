import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Copyright } from './Copyright';
import { normaliseRadixIds } from '@/libs/utils/utils';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('Copyright', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  it('renders with default props', () => {
    render(<Copyright />);
    expect(screen.getByText('Copyright Notice')).toBeInTheDocument();
  });

  it('displays company name', () => {
    render(<Copyright />);
    expect(screen.getByText(/Synonym Software, S.A. de C.V./)).toBeInTheDocument();
  });

  it('displays current year in copyright notice', () => {
    render(<Copyright />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('renders DMCA Compliance section', () => {
    render(<Copyright />);
    expect(screen.getByText('DMCA Compliance')).toBeInTheDocument();
  });

  it('renders User-Generated Content section', () => {
    render(<Copyright />);
    expect(screen.getByText('User-Generated Content')).toBeInTheDocument();
  });

  it('renders Legal Documents section', () => {
    render(<Copyright />);
    expect(screen.getByText('Legal Documents')).toBeInTheDocument();
  });

  it('opens DMCA link when button is clicked', () => {
    render(<Copyright />);
    const dmcaButton = screen.getByRole('button', { name: /Learn About DMCA/i });
    fireEvent.click(dmcaButton);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://www.copyright.gov/dmca/',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('opens Terms of Service link when button is clicked', () => {
    render(<Copyright />);
    const termsButton = screen.getByRole('button', { name: /Terms of Service/i });
    fireEvent.click(termsButton);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://pubky.org/terms',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('opens Privacy Policy link when button is clicked', () => {
    render(<Copyright />);
    const privacyButton = screen.getByRole('button', { name: /Privacy Policy/i });
    fireEvent.click(privacyButton);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://pubky.org/privacy',
      '_blank',
      'noopener,noreferrer',
    );
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

  it('matches snapshot with custom className', () => {
    const { container } = render(<Copyright className="custom-copyright" />);
    const normalisedContainer = normaliseRadixIds(container);
    expect(normalisedContainer.innerHTML).toMatchSnapshot();
  });
});

