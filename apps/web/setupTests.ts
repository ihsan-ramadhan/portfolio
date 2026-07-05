import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// jsdom doesn't ship URL.createObjectURL/revokeObjectURL — stub them once at
// module load so code that builds blob: URLs (e.g. ImageOptimizer) works.
// Must run BEFORE vi.restoreAllMocks() in any beforeEach.
if (!('createObjectURL' in URL)) {
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: vi.fn(() => 'blob:test'),
  });
}
if (!('revokeObjectURL' in URL)) {
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
}

// jsdom's canvas getContext('2d') returns null. Provide minimal stubs so
// ImageOptimizer can complete its draw/toBlob pipeline.
const proto = HTMLCanvasElement.prototype as unknown as {
  getContext: (id: string) => unknown;
  toBlob: (cb: (b: Blob | null) => void) => void;
};
proto.getContext = function () {
  return {
    drawImage: vi.fn(),
    canvas: { width: 0, height: 0 },
  } as unknown as CanvasRenderingContext2D;
};
proto.toBlob = function (cb) {
  cb(new Blob([new Uint8Array([1])], { type: 'image/webp' }));
};
