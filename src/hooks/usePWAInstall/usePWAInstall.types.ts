/**
 * BeforeInstallPromptEvent - The event fired before the browser shows the install prompt
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
 */
export interface BeforeInstallPromptEvent extends Event {
  /**
   * Platforms on which the app can be installed (e.g., 'web', 'android')
   */
  readonly platforms: string[];

  /**
   * Promise that resolves with the user's choice
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * Shows the install prompt to the user
   */
  prompt(): Promise<void>;
}

/**
 * PWA install state
 */
export type PWAInstallState = 'not-supported' | 'prompt-available' | 'installed' | 'dismissed';

/**
 * Result of the install prompt
 */
export interface PWAInstallResult {
  outcome: 'accepted' | 'dismissed';
  platform: string;
}

/**
 * Options for the usePWAInstall hook
 */
export interface UsePWAInstallOptions {
  /**
   * Key for storing dismissal state in localStorage
   * @default 'pwa-install-dismissed'
   */
  storageKey?: string;

  /**
   * How long to remember dismissal (in days)
   * @default 7
   */
  dismissalDays?: number;
}

/**
 * Return value of the usePWAInstall hook
 */
export interface UsePWAInstallReturn {
  /**
   * Current install state
   */
  state: PWAInstallState;

  /**
   * Whether the install prompt is available
   */
  canInstall: boolean;

  /**
   * Whether the app is already installed
   */
  isInstalled: boolean;

  /**
   * Show the install prompt
   * @returns Promise with the user's choice, or null if prompt not available
   */
  promptInstall: () => Promise<PWAInstallResult | null>;

  /**
   * Dismiss the install prompt (saves to localStorage)
   */
  dismiss: () => void;

  /**
   * Reset the dismissal state
   */
  resetDismissal: () => void;
}

// Extend Window interface for TypeScript
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

