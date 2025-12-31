import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { PWAInstallPrompt } from './PWAInstallPrompt';

// Mock the usePWAInstall hook
const mockPromptInstall = vi.fn();
const mockDismiss = vi.fn();

vi.mock('@/hooks', () => ({
  usePWAInstall: vi.fn(() => ({
    canInstall: true,
    isInstalled: false,
    promptInstall: mockPromptInstall,
    dismiss: mockDismiss,
    state: 'prompt-available',
    resetDismissal: vi.fn(),
  })),
}));

// Import the mocked hook so we can change its return value
import { usePWAInstall } from '@/hooks';
const mockedUsePWAInstall = vi.mocked(usePWAInstall);

describe('PWAInstallPrompt', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPromptInstall.mockClear();
    mockDismiss.mockClear();
    mockedUsePWAInstall.mockReturnValue({
      canInstall: true,
      isInstalled: false,
      promptInstall: mockPromptInstall,
      dismiss: mockDismiss,
      state: 'prompt-available',
      resetDismissal: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders after delay when canInstall is true', async () => {
    render(<PWAInstallPrompt showDelay={1000} />);

    // Should not be visible immediately
    expect(screen.queryByRole('banner')).toBeInTheDocument();
    expect(screen.queryByText('Install Pubky')).not.toBeVisible;

    // Fast-forward past the delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText('Install Pubky')).toBeInTheDocument();
    });
  });

  it('does not render when isInstalled is true', () => {
    mockedUsePWAInstall.mockReturnValue({
      canInstall: false,
      isInstalled: true,
      promptInstall: mockPromptInstall,
      dismiss: mockDismiss,
      state: 'installed',
      resetDismissal: vi.fn(),
    });

    render(<PWAInstallPrompt showDelay={0} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByText('Install Pubky')).not.toBeInTheDocument();
  });

  it('does not render when canInstall is false', () => {
    mockedUsePWAInstall.mockReturnValue({
      canInstall: false,
      isInstalled: false,
      promptInstall: mockPromptInstall,
      dismiss: mockDismiss,
      state: 'not-supported',
      resetDismissal: vi.fn(),
    });

    render(<PWAInstallPrompt showDelay={0} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByText('Install Pubky')).not.toBeInTheDocument();
  });

  it('calls promptInstall when Install button is clicked', async () => {
    mockPromptInstall.mockResolvedValue({ outcome: 'accepted', platform: 'web' });

    render(<PWAInstallPrompt showDelay={0} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(screen.getByText('Install Pubky')).toBeInTheDocument();
    });

    const installButton = screen.getByRole('button', { name: /install/i });
    fireEvent.click(installButton);

    expect(mockPromptInstall).toHaveBeenCalled();
  });

  it('calls dismiss when X button is clicked', async () => {
    render(<PWAInstallPrompt showDelay={0} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(screen.getByText('Install Pubky')).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissButton);

    // Wait for the delayed dismiss call
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockDismiss).toHaveBeenCalled();
  });

  it('renders at bottom by default', async () => {
    render(<PWAInstallPrompt showDelay={0} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await waitFor(() => {
      const banner = screen.getByRole('banner');
      expect(banner).toHaveClass('bottom-0');
    });
  });

  it('renders at top when position is top', async () => {
    render(<PWAInstallPrompt showDelay={0} position="top" />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await waitFor(() => {
      const banner = screen.getByRole('banner');
      expect(banner).toHaveClass('top-0');
    });
  });

  it('applies custom className', async () => {
    render(<PWAInstallPrompt showDelay={0} className="custom-class" />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await waitFor(() => {
      const banner = screen.getByRole('banner');
      expect(banner).toHaveClass('custom-class');
    });
  });
});

