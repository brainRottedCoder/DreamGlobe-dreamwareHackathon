/**
 * Photo Background Mapping
 * Maps destination IDs to their photo background images for compositing
 * Each destination has 3 background variants for variety
 */

export interface PhotoBackground {
  id: string;
  path: string;
  variant: number;
}

/**
 * Photo background collection - 3 variants per destination
 */
export const photoBackgroundMap: Record<string, PhotoBackground[]> = {
  // India
  'taj-mahal': [
    { id: 'taj-mahal-1', path: '/destinations/photo-backgrounds/Taj-Mahal.webp', variant: 1 },
    { id: 'taj-mahal-2', path: '/destinations/photo-backgrounds/tajmahal2_opt.webp', variant: 2 },
    { id: 'taj-mahal-3', path: '/destinations/photo-backgrounds/tajmahal3_opt.webp', variant: 3 },
  ],
  'red-fort': [
    { id: 'red-fort-1', path: '/destinations/photo-backgrounds/Red Fort-1_opt.webp', variant: 1 },
    { id: 'red-fort-2', path: '/destinations/photo-backgrounds/redfort2_opt.webp', variant: 2 },
    { id: 'red-fort-3', path: '/destinations/photo-backgrounds/redfort3_opt.webp', variant: 3 },
  ],
  'qutub-minar': [
    { id: 'qutub-minar-1', path: '/destinations/photo-backgrounds/qutubminar_opt.webp', variant: 1 },
    { id: 'qutub-minar-2', path: '/destinations/photo-backgrounds/qutubminar2_opt.webp', variant: 2 },
    { id: 'qutub-minar-3', path: '/destinations/photo-backgrounds/qutubminar3_opt.webp', variant: 3 },
  ],

  // USA
  'statue-of-liberty': [
    { id: 'statue-1', path: '/destinations/photo-backgrounds/statue.webp', variant: 1 },
    { id: 'statue-2', path: '/destinations/photo-backgrounds/statue2.webp', variant: 2 },
    { id: 'statue-3', path: '/destinations/photo-backgrounds/statue3_opt.webp', variant: 3 },
  ],
  'times-square': [
    { id: 'times-square-1', path: '/destinations/photo-backgrounds/timesquare_opt.webp', variant: 1 },
    { id: 'times-square-2', path: '/destinations/photo-backgrounds/timesquare2_opt.webp', variant: 2 },
    { id: 'times-square-3', path: '/destinations/photo-backgrounds/timesquare3_opt.webp', variant: 3 },
  ],
  'met-museum': [
    { id: 'met-1', path: '/destinations/photo-backgrounds/met_opt.webp', variant: 1 },
    { id: 'met-2', path: '/destinations/photo-backgrounds/met2.avif', variant: 2 },
    { id: 'met-3', path: '/destinations/photo-backgrounds/met3_opt.webp', variant: 3 },
  ],
  'biltmore': [
    { id: 'biltmore-1', path: '/destinations/photo-backgrounds/bilt.jpeg', variant: 1 },
    { id: 'biltmore-2', path: '/destinations/photo-backgrounds/bilt2.webp', variant: 2 },
    { id: 'biltmore-3', path: '/destinations/photo-backgrounds/bilt3_opt.webp', variant: 3 },
  ],

  // UK
  'eryri-snowdonia': [
    { id: 'eryri-1', path: '/destinations/photo-backgrounds/eriry.jpeg', variant: 1 },
    { id: 'eryri-2', path: '/destinations/photo-backgrounds/eriry2.jpeg', variant: 2 },
    { id: 'eryri-3', path: '/destinations/photo-backgrounds/eriry3.jpeg', variant: 3 },
  ],
  'buckingham-palace': [
    { id: 'buckingham-1', path: '/destinations/photo-backgrounds/buck_opt.webp', variant: 1 },
    { id: 'buckingham-2', path: '/destinations/photo-backgrounds/buck2_opt.webp', variant: 2 },
    { id: 'buckingham-3', path: '/destinations/photo-backgrounds/buck3_opt.webp', variant: 3 },
  ],
  'bath': [
    { id: 'bath-1', path: '/destinations/photo-backgrounds/bath_opt.webp', variant: 1 },
    { id: 'bath-2', path: '/destinations/photo-backgrounds/bath2.webp', variant: 2 },
    { id: 'bath-3', path: '/destinations/photo-backgrounds/bath3_opt.webp', variant: 3 },
  ],

  // Russia
  'red-square': [
    { id: 'red-square-1', path: '/destinations/photo-backgrounds/redsq.webp', variant: 1 },
    { id: 'red-square-2', path: '/destinations/photo-backgrounds/redsq2_opt.webp', variant: 2 },
    { id: 'red-square-3', path: '/destinations/photo-backgrounds/redsq3_opt.webp', variant: 3 },
  ],
  'hermitage-museum': [
    { id: 'hermitage-1', path: '/destinations/photo-backgrounds/Herm.webp', variant: 1 },
    { id: 'hermitage-2', path: '/destinations/photo-backgrounds/herm2_opt.webp', variant: 2 },
    { id: 'hermitage-3', path: '/destinations/photo-backgrounds/herm3.webp', variant: 3 },
  ],
  'peter-paul-fortress': [
    { id: 'peter-1', path: '/destinations/photo-backgrounds/peter_opt.webp', variant: 1 },
    { id: 'peter-2', path: '/destinations/photo-backgrounds/peter2.avif', variant: 2 },
    { id: 'peter-3', path: '/destinations/photo-backgrounds/peter3.webp', variant: 3 },
  ],

  // France
  'eiffel-tower': [
    { id: 'eiffel-1', path: '/destinations/photo-backgrounds/eiffel_opt.webp', variant: 1 },
    { id: 'eiffel-2', path: '/destinations/photo-backgrounds/eiffel2_opt.webp', variant: 2 },
    { id: 'eiffel-3', path: '/destinations/photo-backgrounds/eiffel3_opt.webp', variant: 3 },
  ],
  'fontainebleau': [
    { id: 'fontainebleau-1', path: '/destinations/photo-backgrounds/fount_opt.webp', variant: 1 },
    { id: 'fontainebleau-2', path: '/destinations/photo-backgrounds/fount2_opt.webp', variant: 2 },
    { id: 'fontainebleau-3', path: '/destinations/photo-backgrounds/fount3_opt.webp', variant: 3 },
  ],
};

/**
 * Get all photo backgrounds for a destination (3 variants)
 * @param destinationId - The destination ID
 * @returns Array of 3 photo backgrounds, or empty array if not found
 */
export function getPhotoBackgrounds(destinationId: string): PhotoBackground[] {
  return photoBackgroundMap[destinationId] || [];
}

/**
 * Check if a destination has photo backgrounds
 * @param destinationId - The destination ID
 * @returns True if the destination has photo backgrounds
 */
export function hasPhotoBackground(destinationId: string): boolean {
  return destinationId in photoBackgroundMap && photoBackgroundMap[destinationId].length > 0;
}
