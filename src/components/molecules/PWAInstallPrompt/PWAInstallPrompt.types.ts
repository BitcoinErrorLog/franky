import type { UsePWAInstallOptions } from '@/hooks';

export interface PWAInstallPromptProps extends UsePWAInstallOptions {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Position of the prompt
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';

  /**
   * Delay before showing the prompt (in ms)
   * Gives time for the page to load before showing the banner
   * @default 3000
   */
  showDelay?: number;
}

