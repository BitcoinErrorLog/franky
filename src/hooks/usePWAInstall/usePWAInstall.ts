'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  BeforeInstallPromptEvent,
  PWAInstallState,
  PWAInstallResult,
  UsePWAInstallOptions,
  UsePWAInstallReturn,
} from './usePWAInstall.types';

const DEFAULT_STORAGE_KEY = 'pwa-install-dismissed';
const DEFAULT_DISMISSAL_DAYS = 7;

/**
 * Check if the app is running in standalone mode (installed PWA)
 */
function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  // Check display-mode media query
  if (window.matchMedia('(display-mode: standalone)').matches) return true;

  // Check iOS standalone mode
  if ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone) return true;

  // Check if running in TWA
  if (document.referrer.includes('android-app://')) return true;

  return false;
}

/**
 * Check if dismissal is still valid
 */
function isDismissed(storageKey: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const dismissedAt = localStorage.getItem(storageKey);
    if (!dismissedAt) return false;

    const dismissedDate = new Date(dismissedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysDiff < DEFAULT_DISMISSAL_DAYS;
  } catch {
    return false;
  }
}

/**
 * Hook to manage PWA installation prompts
 *
 * @param options - Configuration options
 * @returns Install state and methods
 *
 * @example
 * ```tsx
 * function InstallBanner() {
 *   const { canInstall, promptInstall, dismiss } = usePWAInstall();
 *
 *   if (!canInstall) return null;
 *
 *   return (
 *     <div>
 *       <button onClick={promptInstall}>Install App</button>
 *       <button onClick={dismiss}>Not Now</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePWAInstall(options: UsePWAInstallOptions = {}): UsePWAInstallReturn {
  const { storageKey = DEFAULT_STORAGE_KEY, dismissalDays = DEFAULT_DISMISSAL_DAYS } = options;

  const [state, setState] = useState<PWAInstallState>('not-supported');
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Check initial state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already installed
    if (isStandalone()) {
      setState('installed');
      return;
    }

    // Check if previously dismissed
    if (isDismissed(storageKey)) {
      setState('dismissed');
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();

      // Store the event for later use
      deferredPromptRef.current = event;
      setState('prompt-available');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      deferredPromptRef.current = null;
      setState('installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [storageKey, dismissalDays]);

  // Show the install prompt
  const promptInstall = useCallback(async (): Promise<PWAInstallResult | null> => {
    const deferredPrompt = deferredPromptRef.current;

    if (!deferredPrompt) {
      return null;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome, platform } = await deferredPrompt.userChoice;

    // Clear the deferred prompt
    deferredPromptRef.current = null;

    if (outcome === 'accepted') {
      setState('installed');
    } else {
      setState('dismissed');
      try {
        localStorage.setItem(storageKey, new Date().toISOString());
      } catch {
        // Ignore storage errors
      }
    }

    return { outcome, platform };
  }, [storageKey]);

  // Dismiss the prompt
  const dismiss = useCallback(() => {
    setState('dismissed');
    try {
      localStorage.setItem(storageKey, new Date().toISOString());
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  // Reset dismissal
  const resetDismissal = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      // If we still have a deferred prompt, show it
      if (deferredPromptRef.current) {
        setState('prompt-available');
      } else {
        setState('not-supported');
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  return {
    state,
    canInstall: state === 'prompt-available',
    isInstalled: state === 'installed',
    promptInstall,
    dismiss,
    resetDismissal,
  };
}

