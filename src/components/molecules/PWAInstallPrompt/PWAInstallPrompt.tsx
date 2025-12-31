'use client';

import * as React from 'react';
import * as Atoms from '@/atoms';
import * as Libs from '@/libs';
import { usePWAInstall } from '@/hooks';
import type { PWAInstallPromptProps } from './PWAInstallPrompt.types';

/**
 * PWAInstallPrompt
 *
 * A banner component that prompts users to install the PWA.
 * Automatically shows when the browser supports installation.
 *
 * @example
 * ```tsx
 * // Add to layout or main page
 * <PWAInstallPrompt position="bottom" />
 * ```
 */
export function PWAInstallPrompt({
  className,
  position = 'bottom',
  showDelay = 3000,
  ...hookOptions
}: PWAInstallPromptProps) {
  const { canInstall, promptInstall, dismiss, isInstalled } = usePWAInstall(hookOptions);
  const [visible, setVisible] = React.useState(false);
  const [isPrompting, setIsPrompting] = React.useState(false);

  // Delay showing the prompt to avoid interrupting page load
  React.useEffect(() => {
    if (!canInstall) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [canInstall, showDelay]);

  const handleInstall = async () => {
    setIsPrompting(true);
    try {
      await promptInstall();
    } finally {
      setIsPrompting(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    // Small delay before actually dismissing to allow animation
    setTimeout(dismiss, 300);
  };

  // Don't render if installed or can't install
  if (isInstalled || !canInstall || !visible) {
    return null;
  }

  const positionClasses = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <div
      className={Libs.cn(
        'fixed inset-x-0 z-50 p-4 transition-transform duration-300',
        positionClasses,
        visible ? 'translate-y-0' : position === 'top' ? '-translate-y-full' : 'translate-y-full',
        className,
      )}
      role="banner"
      aria-label="Install app prompt"
    >
      <div className="mx-auto max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        <div className="flex items-center gap-4 p-4">
          {/* App Icon */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10">
            <Libs.Download size={24} className="text-brand" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">Install Pubky</p>
            <p className="truncate text-sm text-muted-foreground">Add to home screen for quick access</p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Atoms.Button variant="ghost" size="sm" onClick={handleDismiss} className="text-muted-foreground">
              <Libs.X size={20} />
              <span className="sr-only">Dismiss</span>
            </Atoms.Button>
            <Atoms.Button size="sm" onClick={handleInstall} disabled={isPrompting} className="bg-brand hover:bg-brand/90">
              {isPrompting ? <Libs.Loader2 size={16} className="animate-spin" /> : 'Install'}
            </Atoms.Button>
          </div>
        </div>
      </div>
    </div>
  );
}

