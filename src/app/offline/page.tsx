'use client';

import Image from 'next/image';

import * as Atoms from '@/atoms';
import * as Libs from '@/libs';

export default function Offline() {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 text-center">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <Image src="/pubky-logo.svg" alt="Pubky" width={64} height={64} className="opacity-50" />
      </div>

      {/* Icon and Message */}
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-muted p-4">
          <Libs.WifiOff size={48} className="text-muted-foreground" />
        </div>
        <Atoms.Heading level={1} size="xl">
          You&apos;re offline
        </Atoms.Heading>
        <p className="max-w-md text-muted-foreground">
          It looks like you&apos;ve lost your internet connection. Some features may be unavailable until you&apos;re
          back online.
        </p>
      </div>

      {/* Cached Content Hint */}
      <div className="flex max-w-md flex-col gap-2 rounded-lg border border-border bg-card/50 p-4 text-left">
        <div className="flex items-center gap-2">
          <Libs.Database size={16} className="text-brand" />
          <span className="text-sm font-medium">Cached content available</span>
        </div>
        <p className="text-xs text-muted-foreground">
          You can still browse posts you&apos;ve previously viewed. New content will sync when you reconnect.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Atoms.Button onClick={handleRetry} className="min-w-[140px]">
          <Libs.RefreshCw size={16} className="mr-2" />
          Try Again
        </Atoms.Button>
        <Atoms.Button variant="outline" onClick={handleGoHome} className="min-w-[140px]">
          <Libs.Home size={16} className="mr-2" />
          Go Home
        </Atoms.Button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block size-2 animate-pulse rounded-full bg-yellow-500" />
        Waiting for connection...
      </div>
    </div>
  );
}
