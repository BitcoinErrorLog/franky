'use client';

import * as Atoms from '@/atoms';
import * as Molecules from '@/molecules';
import * as Libs from '@/libs';

/**
 * Current year for copyright notice
 */
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Company information
 */
const COMPANY_INFO = {
  name: 'Synonym Software, S.A. de C.V.',
  shortName: 'Synonym',
  address: {
    street: '87 avenida norte, calle El Mirador, edificio Torre Futura, oficina 06, nivel 11',
    district: 'colonia Escalón, del municipio de San Salvador',
    region: 'departamento de San Salvador',
    postalCode: '01101',
    country: 'República de El Salvador',
  },
} as const;

/**
 * External links
 */
const LINKS = {
  termsOfService: 'https://pubky.org/terms',
  privacyPolicy: 'https://pubky.org/privacy',
  dmca: 'https://www.copyright.gov/dmca/',
} as const;

export interface CopyrightProps {
  className?: string;
}

/**
 * Copyright
 *
 * Displays copyright information, legal notices, and DMCA compliance details.
 * This is a public informational page accessible without authentication.
 */
export function Copyright({ className }: CopyrightProps) {
  return (
    <Atoms.Container size="narrow" className={Libs.cn('py-8', className)}>
      <Molecules.SettingsSectionCard>
        {/* Header */}
        <div className="inline-flex items-center justify-start gap-2">
          <Libs.Copyright size={24} />
          <h1 className="text-2xl font-bold leading-8 text-foreground">Copyright Notice</h1>
        </div>

        {/* Copyright Statement */}
        <div className="mt-6 space-y-4">
          <p className="text-base font-medium leading-6 text-foreground">
            © {CURRENT_YEAR} {COMPANY_INFO.name}. All rights reserved.
          </p>

          <p className="text-sm leading-6 text-muted-foreground">
            The content, design, graphics, and other materials on this platform are protected by copyright and other
            intellectual property laws. Unauthorized use, reproduction, or distribution of any content without prior
            written permission is strictly prohibited.
          </p>
        </div>

        <Molecules.SettingsDivider className="my-6 h-px w-full bg-white/10" />

        {/* Company Information */}
        <div className="inline-flex items-center justify-start gap-2">
          <Libs.Building2 size={24} />
          <h2 className="text-xl font-bold leading-7 text-foreground">Company Information</h2>
        </div>

        <div className="mt-4 rounded-lg bg-white/5 p-4">
          <p className="text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">{COMPANY_INFO.name}</strong>
            <br />
            {COMPANY_INFO.address.street}
            <br />
            {COMPANY_INFO.address.district}
            <br />
            {COMPANY_INFO.address.region}
            <br />
            Código postal {COMPANY_INFO.address.postalCode}, {COMPANY_INFO.address.country}
          </p>
        </div>

        <Molecules.SettingsDivider className="my-6 h-px w-full bg-white/10" />

        {/* DMCA Compliance */}
        <div className="inline-flex items-center justify-start gap-2">
          <Libs.Shield size={24} />
          <h2 className="text-xl font-bold leading-7 text-foreground">DMCA Compliance</h2>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            {COMPANY_INFO.shortName} respects the intellectual property rights of others and expects users of our
            platform to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond
            expeditiously to claims of copyright infringement.
          </p>

          <p className="text-sm leading-6 text-muted-foreground">
            If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement
            and is accessible on this platform, please submit a copyright removal request with the required information.
          </p>

          <Atoms.Button
            id="dmca-info-btn"
            variant="secondary"
            size="default"
            onClick={() => window.open(LINKS.dmca, '_blank', 'noopener,noreferrer')}
          >
            <Libs.ExternalLink size={16} />
            Learn About DMCA
          </Atoms.Button>
        </div>

        <Molecules.SettingsDivider className="my-6 h-px w-full bg-white/10" />

        {/* User Content */}
        <div className="inline-flex items-center justify-start gap-2">
          <Libs.Users size={24} />
          <h2 className="text-xl font-bold leading-7 text-foreground">User-Generated Content</h2>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Users retain ownership of the content they create and post on the platform. By posting content, users grant{' '}
            {COMPANY_INFO.shortName} a non-exclusive license to display and distribute their content as part of the
            platform&apos;s normal operation.
          </p>

          <p className="text-sm leading-6 text-muted-foreground">
            Users are solely responsible for ensuring that any content they post does not infringe upon the intellectual
            property rights of third parties.
          </p>
        </div>

        <Molecules.SettingsDivider className="my-6 h-px w-full bg-white/10" />

        {/* Legal Links */}
        <div className="inline-flex items-center justify-start gap-2">
          <Libs.FileText size={24} />
          <h2 className="text-xl font-bold leading-7 text-foreground">Legal Documents</h2>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Atoms.Button
            id="terms-btn"
            variant="secondary"
            size="default"
            onClick={() => window.open(LINKS.termsOfService, '_blank', 'noopener,noreferrer')}
          >
            <Libs.FileText size={16} />
            Terms of Service
          </Atoms.Button>

          <Atoms.Button
            id="privacy-btn"
            variant="secondary"
            size="default"
            onClick={() => window.open(LINKS.privacyPolicy, '_blank', 'noopener,noreferrer')}
          >
            <Libs.Lock size={16} />
            Privacy Policy
          </Atoms.Button>
        </div>

        {/* Footer */}
        <div className="mt-8 rounded-lg bg-white/5 p-4">
          <p className="text-xs leading-5 text-muted-foreground">
            Last updated: January 2025. This copyright notice is subject to change. Please review periodically for
            updates.
          </p>
        </div>
      </Molecules.SettingsSectionCard>
    </Atoms.Container>
  );
}

