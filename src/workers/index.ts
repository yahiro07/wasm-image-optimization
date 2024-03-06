import LibImage from './libImage.js';
import WASM from '../esm/libImage.wasm';

const libImage = LibImage({
  instantiateWasm: async (imports, receiver) => {
    receiver(await WebAssembly.instantiate(WASM, imports));
  },
});

export const optimizeImage = async ({
  image,
  width = 0,
  height = 0,
  quality = 100,
  format = 'webp',
}: {
  image: BufferSource;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}) => libImage.then(({ optimize }) => optimize(image, width, height, quality, format));

export const getImageDimension = async (image: BufferSource) => {
  return libImage.then(({ getDimension }) => {
    const sizeRes = getDimension(image);
    if (sizeRes && sizeRes > 0) {
      const width = (sizeRes >> 16) & 0x7fff;
      const height = sizeRes & 0x7fff;
      return { width, height };
    } else {
      return null;
    }
  });
};
