/**
 * BILEKSA PRIVATE RESIDENCES — PROPERTY VALIDATION UTILITIES
 * Defensive schema validation for property data integrity.
 */

import { Property, PropertyType, PropertyStatus } from '../types/property';

export const VALID_PROPERTY_TYPES: PropertyType[] = [
  'villa',
  'penthouse',
  'waterfront',
  'estate',
  'apartment',
  'residential_development'
];

export const VALID_PROPERTY_STATUSES: PropertyStatus[] = [
  'available',
  'reserved',
  'sold',
  'under_construction',
  'private_listing'
];

export interface PropertyValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PropertyDatasetValidationResult {
  isValid: boolean;
  errors: string[];
  totalChecked: number;
  duplicateSlugs: string[];
}

/**
 * Validates a single property entity against structural and domain constraints.
 */
export function validateProperty(property: unknown): PropertyValidationResult {
  const errors: string[] = [];

  if (!property || typeof property !== 'object') {
    return { isValid: false, errors: ['Property entity must be a non-null object'] };
  }

  const p = property as Partial<Property>;

  // 1. Mandatory Identity Fields
  if (!p.id || typeof p.id !== 'string' || p.id.trim() === '') {
    errors.push('Missing or invalid "id"');
  }

  if (!p.slug || typeof p.slug !== 'string' || p.slug.trim() === '') {
    errors.push('Missing or invalid "slug"');
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) {
    errors.push(`Slug "${p.slug}" must be lowercase and hyphen-delimited alphanumeric`);
  }

  if (!p.name || typeof p.name !== 'string' || p.name.trim() === '') {
    errors.push('Missing or invalid "name"');
  }

  if (!p.tagline || typeof p.tagline !== 'string' || p.tagline.trim() === '') {
    errors.push('Missing or invalid "tagline"');
  }

  // 2. Enum Types
  if (!p.propertyType || !VALID_PROPERTY_TYPES.includes(p.propertyType as PropertyType)) {
    errors.push(`Invalid "propertyType" "${p.propertyType}". Expected one of: ${VALID_PROPERTY_TYPES.join(', ')}`);
  }

  if (!p.status || !VALID_PROPERTY_STATUSES.includes(p.status as PropertyStatus)) {
    errors.push(`Invalid "status" "${p.status}". Expected one of: ${VALID_PROPERTY_STATUSES.join(', ')}`);
  }

  // 3. Location
  if (!p.location || typeof p.location !== 'object') {
    errors.push('Missing "location" object');
  } else {
    if (!p.location.city || typeof p.location.city !== 'string') {
      errors.push('Missing or invalid "location.city"');
    }
    if (!p.location.country || typeof p.location.country !== 'string') {
      errors.push('Missing or invalid "location.country"');
    }
  }

  // 4. Pricing Validation
  if (p.price !== undefined && p.price !== null) {
    if (typeof p.price !== 'number' || isNaN(p.price) || p.price < 0) {
      errors.push(`Invalid price value "${p.price}". Must be positive number or null for enquiry-only.`);
    }
  }

  // 5. Spatial Metrics
  if (typeof p.bedrooms !== 'number' || p.bedrooms < 0) {
    errors.push('Invalid "bedrooms" count. Must be non-negative integer.');
  }

  if (typeof p.bathrooms !== 'number' || p.bathrooms < 0) {
    errors.push('Invalid "bathrooms" count. Must be non-negative integer.');
  }

  if (!p.carpetArea || typeof p.carpetArea.value !== 'number' || p.carpetArea.value <= 0) {
    errors.push('Missing or invalid "carpetArea" value');
  }

  if (!p.builtUpArea || typeof p.builtUpArea.value !== 'number' || p.builtUpArea.value <= 0) {
    errors.push('Missing or invalid "builtUpArea" value');
  }

  // 6. Cover Image & Media Validation
  if (!p.coverImage || typeof p.coverImage !== 'string' || p.coverImage.trim() === '') {
    errors.push('Missing or empty "coverImage" URL');
  } else {
    const isAbsolute = p.coverImage.startsWith('http://') || p.coverImage.startsWith('https://') || p.coverImage.startsWith('/');
    if (!isAbsolute) {
      errors.push(`Cover image "${p.coverImage}" must be an absolute URL or root-relative path`);
    }
  }

  if (p.gallery) {
    if (!Array.isArray(p.gallery)) {
      errors.push('"gallery" must be an array of media items');
    } else {
      p.gallery.forEach((item, index) => {
        if (!item.id) errors.push(`Gallery item at index ${index} is missing "id"`);
        if (!item.url || typeof item.url !== 'string') errors.push(`Gallery item at index ${index} is missing "url"`);
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates an entire collection of properties, checking individual entities
 * as well as dataset-level constraints such as duplicate slugs.
 */
export function validatePropertyDataset(properties: Property[]): PropertyDatasetValidationResult {
  const datasetErrors: string[] = [];
  const seenSlugs = new Set<string>();
  const duplicateSlugs: string[] = [];

  properties.forEach((p, idx) => {
    // Individual entity validation
    const entityResult = validateProperty(p);
    if (!entityResult.isValid) {
      entityResult.errors.forEach((err) => {
        datasetErrors.push(`[Property #${idx + 1} (${p.slug || 'unknown'})] ${err}`);
      });
    }

    // Slug uniqueness check
    if (p.slug) {
      if (seenSlugs.has(p.slug)) {
        duplicateSlugs.push(p.slug);
        datasetErrors.push(`Duplicate slug detected: "${p.slug}"`);
      } else {
        seenSlugs.add(p.slug);
      }
    }
  });

  return {
    isValid: datasetErrors.length === 0,
    errors: datasetErrors,
    totalChecked: properties.length,
    duplicateSlugs
  };
}
