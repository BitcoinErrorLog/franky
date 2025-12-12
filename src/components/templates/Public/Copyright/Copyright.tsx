'use client';

import * as React from 'react';
import * as Atoms from '@/atoms';
import * as Molecules from '@/molecules';
import * as Libs from '@/libs';

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

export interface CopyrightProps {
  className?: string;
}

/**
 * Copyright
 *
 * DMCA Copyright Removal Request form matching the old pubky-app functionality.
 * Submits to Chatwoot API for processing.
 */
export function Copyright({ className }: CopyrightProps) {
  // Form state
  const [isRightsOwner, setIsRightsOwner] = React.useState(true);
  const [nameOwner, setNameOwner] = React.useState('');
  const [originalContentUrls, setOriginalContentUrls] = React.useState('');
  const [briefDescription, setBriefDescription] = React.useState('');
  const [infringingContentUrl, setInfringingContentUrl] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [streetAddress, setStreetAddress] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [city, setCity] = React.useState('');
  const [stateProvince, setStateProvince] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');
  const [signature, setSignature] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  // Validation state
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const isValidEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!nameOwner.trim()) {
      newErrors.nameOwner = 'Name of rights owner is required';
    }
    if (!originalContentUrls.trim()) {
      newErrors.originalContentUrls = 'Original content URLs are required';
    }
    if (!briefDescription.trim()) {
      newErrors.briefDescription = 'Brief description is required';
    }
    if (!infringingContentUrl.trim()) {
      newErrors.infringingContentUrl = 'Infringing content URL is required';
    }
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }
    if (!country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!stateProvince.trim()) {
      newErrors.stateProvince = 'State/Province is required';
    }
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }
    if (!signature.trim()) {
      newErrors.signature = 'Signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const formData = {
        nameOwner,
        originalContentUrls,
        briefDescription,
        infringingContentUrl,
        firstName,
        lastName,
        email,
        phoneNumber,
        streetAddress,
        country,
        city,
        stateProvince,
        zipCode,
        signature,
        isRightsOwner,
        isReportingOnBehalf: !isRightsOwner,
      };

      const response = await fetch('/api/chatwoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pubky: 'copyright-request',
          comment: `Copyright Removal Request:\n\n${JSON.stringify(formData, null, 2)}`,
          name: `${firstName} ${lastName}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSubmitted(true);
      // Reset form
      setNameOwner('');
      setOriginalContentUrls('');
      setBriefDescription('');
      setInfringingContentUrl('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setStreetAddress('');
      setCountry('');
      setCity('');
      setStateProvince('');
      setZipCode('');
      setSignature('');
      setErrors({});
    } catch (error) {
      Libs.Logger.error('DMCA form submission failed', { error });
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Atoms.Container size="narrow" className={Libs.cn('py-8', className)}>
        <Molecules.SettingsSectionCard>
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <Libs.CheckCircle size={48} className="text-brand" />
            <Atoms.Heading level={2} size="lg">Request Submitted</Atoms.Heading>
            <p className="text-muted-foreground">
              Your copyright removal request has been submitted successfully. We will review it and respond within one
              week.
            </p>
            <Atoms.Button variant="secondary" onClick={() => setSubmitted(false)}>
              Submit Another Request
            </Atoms.Button>
          </div>
        </Molecules.SettingsSectionCard>
      </Atoms.Container>
    );
  }

  return (
    <Atoms.Container size="narrow" className={Libs.cn('py-8', className)}>
      {/* Header Card */}
      <div className="mb-6 rounded-t-lg bg-white/10 p-8 md:p-12">
        <Atoms.Heading level={1} size="lg">Copyright Removal Request</Atoms.Heading>
        <p className="mt-2 text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          <strong className="text-foreground">{COMPANY_INFO.name}</strong> (&quot;{COMPANY_INFO.shortName}&quot;)
          <br />
          {COMPANY_INFO.address.street}, {COMPANY_INFO.address.district}, {COMPANY_INFO.address.region}. Código postal{' '}
          {COMPANY_INFO.address.postalCode}, {COMPANY_INFO.address.country}.
        </p>
      </div>

      {/* Form Card */}
      <Molecules.SettingsSectionCard className="rounded-t-none">
        {/* Introduction */}
        <div className="rounded-lg bg-white/5 p-4">
          <p className="text-sm text-muted-foreground">Dear {COMPANY_INFO.shortName}:</p>
          <p className="mt-2 text-sm text-muted-foreground">We write on behalf of:</p>
        </div>

        {/* Rights Owner Information */}
        <div className="mt-6">
          <Atoms.Heading level={2} size="md">Rights Owner Information</Atoms.Heading>
          <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:justify-between">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                checked={isRightsOwner}
                onChange={() => setIsRightsOwner(true)}
                className="size-5 accent-primary"
              />
              <span className="text-sm text-foreground">I am the rights owner</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                checked={!isRightsOwner}
                onChange={() => setIsRightsOwner(false)}
                className="size-5 accent-primary"
              />
              <span className="text-sm text-foreground">I am reporting on behalf of my organization or client</span>
            </label>
          </div>

          <div className="mt-4">
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Name of the rights owner{' '}
              <span className="normal-case">(This may be your full name or the name of the organization)</span>
            </label>
            <Atoms.Input
              value={nameOwner}
              onChange={(e) => setNameOwner(e.target.value)}
              placeholder="Name of the rights owner"
              className="mt-1"
              maxLength={50}
            />
            {errors.nameOwner && <p className="mt-1 text-sm text-destructive">{errors.nameOwner}</p>}
          </div>
        </div>

        <Molecules.SettingsDivider className="my-6" />

        {/* Copyright Notice */}
        <div className="rounded-lg bg-white/5 p-4">
          <p className="text-sm text-muted-foreground">
            We hereby provide notice of copyright infringements pursuant to the terms of the Digital Millennium
            Copyright Act (the &quot;Act&quot;) and the Pubky Terms and Conditions. Copyright Owner is the owner of the
            copyrights in the following work(s) (collectively, the &quot;Work(s)&quot;):
          </p>
        </div>

        {/* Original Content */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase text-muted-foreground">Original Content URLs</label>
            <Atoms.Textarea
              value={originalContentUrls}
              onChange={(e) => setOriginalContentUrls(e.target.value)}
              placeholder="Enter URLs of your original content"
              className="mt-1 min-h-[100px]"
            />
            {errors.originalContentUrls && <p className="mt-1 text-sm text-destructive">{errors.originalContentUrls}</p>}
          </div>
          <div>
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Brief description of your original content
            </label>
            <Atoms.Textarea
              value={briefDescription}
              onChange={(e) => setBriefDescription(e.target.value)}
              placeholder="Describe your original content"
              className="mt-1 min-h-[100px]"
            />
            {errors.briefDescription && <p className="mt-1 text-sm text-destructive">{errors.briefDescription}</p>}
          </div>
        </div>

        <Molecules.SettingsDivider className="my-6" />

        {/* Infringing Content Notice */}
        <div className="rounded-lg bg-white/5 p-4">
          <p className="text-sm text-muted-foreground">
            It has come to Copyright Owner&apos;s attention that your platform (the &quot;Platform&quot;) displays,
            provides access to or caches materials that infringe Copyright Owner&apos;s copyrights in the Work(s). The
            following is a list of the infringing material(s) and the URL(s), if applicable, at which the infringing
            material(s) are accessible on the Platform:
          </p>
        </div>

        {/* Infringing Work Details */}
        <div className="mt-6">
          <Atoms.Heading level={2} size="md">Infringing work details</Atoms.Heading>
          <div className="mt-4">
            <label className="text-xs font-medium uppercase text-muted-foreground">Infringing Content URLs</label>
            <Atoms.Textarea
              value={infringingContentUrl}
              onChange={(e) => setInfringingContentUrl(e.target.value)}
              placeholder="Enter URLs of infringing content on Pubky"
              className="mt-1 min-h-[100px]"
            />
            {errors.infringingContentUrl && <p className="mt-1 text-sm text-destructive">{errors.infringingContentUrl}</p>}
          </div>
        </div>

        <Molecules.SettingsDivider className="my-6" />

        {/* Legal Statement */}
        <div className="rounded-lg bg-white/5 p-4">
          <p className="text-sm text-muted-foreground">
            We have a good faith belief that the use of the Works described in this letter are not authorized by
            Copyright Owner, any agent of Copyright Owner or any applicable law. The information in this notification is
            accurate. We swear under penalty of perjury that we are authorized to act on behalf of Copyright Owner with
            respect to the subject matter of this letter.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            We therefore request that you remove or disable access to the infringing materials as set forth in Section
            512(c)(1)(C), Section 512(d)(3) and/or Section 512(b)(2)(E) of the Act, as applicable, and pursuant to the
            Pubky Terms and Conditions. Please contact the undersigned no later than one week from the date of this
            copyright removal request to confirm that the infringing materials have been removed or access disabled.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mt-6">
          <Atoms.Heading level={2} size="md">Contact Information</Atoms.Heading>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">First Name</label>
              <Atoms.Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Satoshi"
                className="mt-1"
                maxLength={30}
              />
              {errors.firstName && <p className="mt-1 text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">Last Name</label>
              <Atoms.Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nakamoto"
                className="mt-1"
                maxLength={30}
              />
              {errors.lastName && <p className="mt-1 text-sm text-destructive">{errors.lastName}</p>}
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">Email</label>
              <Atoms.Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="mt-1"
                maxLength={50}
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">Phone Number</label>
              <Atoms.Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="000-000-0000"
                className="mt-1"
                maxLength={20}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-destructive">{errors.phoneNumber}</p>}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <Atoms.Heading level={2} size="md">Address</Atoms.Heading>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">Street Address</label>
              <Atoms.Input
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Street number and name"
                className="mt-1"
                maxLength={100}
              />
              {errors.streetAddress && <p className="mt-1 text-sm text-destructive">{errors.streetAddress}</p>}
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">Country</label>
              <Atoms.Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="mt-1"
                maxLength={50}
              />
              {errors.country && <p className="mt-1 text-sm text-destructive">{errors.country}</p>}
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">City</label>
              <Atoms.Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City name"
                className="mt-1"
                maxLength={50}
              />
              {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city}</p>}
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">State/Province</label>
              <Atoms.Input
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                placeholder="State name"
                className="mt-1"
                maxLength={50}
              />
              {errors.stateProvince && <p className="mt-1 text-sm text-destructive">{errors.stateProvince}</p>}
            </div>
          </div>
          <div className="mt-4 xl:w-1/2">
            <label className="text-xs font-medium uppercase text-muted-foreground">Zip Code</label>
            <Atoms.Input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="000000"
              className="mt-1"
              maxLength={20}
            />
            {errors.zipCode && <p className="mt-1 text-sm text-destructive">{errors.zipCode}</p>}
          </div>
        </div>

        <Molecules.SettingsDivider className="my-6" />

        {/* Signature */}
        <div>
          <Atoms.Heading level={2} size="md">Signature</Atoms.Heading>
          <div className="mt-4 xl:w-1/2">
            <label className="text-xs font-medium uppercase text-muted-foreground">Full Name as Signature</label>
            <Atoms.Input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Full name"
              className="mt-1"
              maxLength={50}
            />
            {errors.signature && <p className="mt-1 text-sm text-destructive">{errors.signature}</p>}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <Atoms.Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {loading ? (
              <>
                <Libs.Loader2 className="mr-2 size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Form'
            )}
          </Atoms.Button>
        </div>
      </Molecules.SettingsSectionCard>
    </Atoms.Container>
  );
}
