export interface RemoveBackgroundOptions {
  quality?: 'low' | 'medium' | 'high';
  progress?: (progress: number) => void;
}

// Singleton segmenter instance
let segmenter: any | null = null;
let isInitializing = false;
let initializationPromise: Promise<any> | null = null;

/**
 * Initialize MediaPipe Selfie Segmentation model
 * Uses singleton pattern to avoid multiple initializations
 */
async function getSegmenter(): Promise<any> {
  // If already initialized, return it
  if (segmenter) {
    return segmenter;
  }

  // If currently initializing, wait for it
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  isInitializing = true;
  initializationPromise = (async () => {
    try {
      console.log('🤖 Initializing Selfie Segmentation (TensorFlow.js)...');

      // Dynamically import the libraries to avoid build-time errors
      const [bodySegmentation] = await Promise.all([
        import('@tensorflow-models/body-segmentation'),
        import('@tensorflow/tfjs-core'),
        import('@tensorflow/tfjs-backend-webgl')
      ]);

      const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      const segmenterConfig: any = {
        runtime: 'tfjs',
        modelType: 'general' // 'general' is lighter and faster than 'landscape'
      };

      segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
      console.log('✅ Selfie Segmentation (TensorFlow.js) loaded successfully!');

      isInitializing = false;
      return segmenter;
    } catch (error) {
      isInitializing = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Removes background from an image using MediaPipe Selfie Segmentation
 * Much lighter and faster than ML-based background removal
 * @param imageSource - Image file, blob, or data URL
 * @param options - Configuration options
 * @returns Promise resolving to Blob with transparent background
 */
export async function removeSelfieBackground(
  imageSource: File | Blob | string,
  options: RemoveBackgroundOptions = {}
): Promise<Blob> {
  try {
    const { progress } = options;

    // Report progress: initializing
    if (progress) progress(0.1);

    // Load the image
    const img = await loadImage(imageSource);

    // Report progress: image loaded
    if (progress) progress(0.3);

    // Get or create segmenter
    const segmenter = await getSegmenter();

    // Report progress: model loaded
    if (progress) progress(0.5);

    // Perform segmentation
    const segmentation = await segmenter.segmentPeople(img, {
      multiSegmentation: false,
      segmentBodyParts: false
    });

    // Report progress: segmentation complete
    if (progress) progress(0.7);

    // Create canvas for processing
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Get segmentation mask
    const mask = segmentation[0].mask;
    const maskData = await mask.toImageData();

    // Apply mask to remove background
    for (let i = 0; i < data.length; i += 4) {
      const maskValue = maskData.data[i]; // R channel contains mask (0-255)

      // If mask value is low (background), make transparent
      if (maskValue < 128) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      } else {
        // Optional: smooth edges by using mask value as alpha
        data[i + 3] = maskValue;
      }
    }

    // Put processed image back
    ctx.putImageData(imageData, 0, 0);

    // Report progress: processing complete
    if (progress) progress(0.9);

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        'image/png',
        1.0
      );
    });

    // Report progress: complete
    if (progress) progress(1.0);

    console.log('✅ Background removed successfully!');
    return blob;
  } catch (error) {
    console.error('Background removal failed:', error);
    throw new Error(`Failed to remove background from image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Converts File/Blob to data URL for canvas operations
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Loads an image from various sources
 */
export function loadImage(source: string | Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = reject;

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const url = URL.createObjectURL(source);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.src = url;
    }
  });
}

/**
 * Cleanup function to dispose of the segmenter when no longer needed
 */
export function disposeSegmenter(): void {
  if (segmenter) {
    segmenter.dispose();
    segmenter = null;
    initializationPromise = null;
    console.log('🧹 Selfie Segmentation disposed');
  }
}
