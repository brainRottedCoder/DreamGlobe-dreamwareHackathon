/**
 * Photo Compositing - Simple and Natural
 * Blends selfie with destination background without artificial filters
 */

export interface CompositeOptions {
  /** Scale factor for selfie (0.1 - 1.0) */
  scale?: number;
  /** X position (0 - 1, where 0 is left, 1 is right) */
  positionX?: number;
  /** Y position (0 - 1, where 0 is top, 1 is bottom) */
  positionY?: number;
  /** Position preset: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

/**
 * Main compositing function - combines selfie with background naturally
 */
export async function compositePhoto(
  selfieImage: HTMLImageElement,
  backgroundImage: HTMLImageElement,
  options: CompositeOptions = {}
): Promise<Blob> {
  const {
    scale = 0.4,
    position = 'bottom-left',
  } = options;

  // Create main canvas with background dimensions
  const canvas = document.createElement('canvas');
  canvas.width = backgroundImage.width;
  canvas.height = backgroundImage.height;
  const ctx = canvas.getContext('2d')!;

  // Draw background first
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Calculate selfie dimensions
  const maxSelfieSize = Math.min(canvas.width, canvas.height) * scale;
  const aspectRatio = selfieImage.width / selfieImage.height;
  const selfieWidth = maxSelfieSize * aspectRatio;
  const selfieHeight = maxSelfieSize;

  // Calculate position - extreme corner with no padding
  let x: number, y: number;
  const padding = 0; // No padding - extreme corner placement

  switch (position) {
    case 'bottom-left':
      x = padding;
      y = canvas.height - selfieHeight - padding;
      break;
    case 'bottom-right':
      x = canvas.width - selfieWidth - padding;
      y = canvas.height - selfieHeight - padding;
      break;
    case 'top-left':
      x = padding;
      y = padding;
      break;
    case 'top-right':
      x = canvas.width - selfieWidth - padding;
      y = padding;
      break;
    default:
      x = padding;
      y = canvas.height - selfieHeight - padding;
  }

  // Draw selfie on top of background (no filters, just natural blending)
  ctx.drawImage(selfieImage, x, y, selfieWidth, selfieHeight);

  // Convert to high-quality webp
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create composite image'));
    }, 'image/webp', 0.95);
  });
}
