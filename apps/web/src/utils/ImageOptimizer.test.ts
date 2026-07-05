import { describe, expect, it, beforeEach, vi } from 'vitest';
import { optimizeImage } from './ImageOptimizer';

describe('optimizeImage', () => {
  beforeEach(() => {
    // Stub HTMLImageElement so the optimizer's <img> reports a known size
    // and fires onload synchronously after `src` is assigned.
    class StubImage {
      width = 2400;
      height = 1200;
      onload: (() => void) | null = null;
      _src = '';
      get src() {
        return this._src;
      }
      set src(_v: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    vi.stubGlobal('Image', StubImage);
  });

  it('passes gifs through unchanged', async () => {
    const gif = new File([new Uint8Array([0])], 'pixel.gif', { type: 'image/gif' });
    const out = await optimizeImage(gif);
    expect(out).toBe(gif);
  });

  it('downsizes and converts to webp with the new extension', async () => {
    const file = new File([new Uint8Array([1])], 'big.jpg', { type: 'image/jpeg' });

    const out = await optimizeImage(file);

    expect(out.type).toBe('image/webp');
    expect(out.name).toBe('big.webp');
  });
});
