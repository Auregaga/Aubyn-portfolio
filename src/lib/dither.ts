/**
 * Bayer Ordered Dither - 有序抖动算法
 * 
 * 将灰度图像转换为两色（黑白/灰点+白点）的点阵效果
 * 使用 Bayer 阈值矩阵实现 ordered dither
 * 
 * 可调节参数：
 * - matrixSize: Bayer 矩阵大小（4 或 8），值越大细节越丰富
 * - lightColor: 亮部颜色（白点）
 * - darkColor: 暗部颜色（灰点）
 * - threshold: 灰度阈值偏移（-50 ~ 50），正值整体更亮，负值整体更暗
 */

// Bayer 4x4 阈值矩阵（归一化到 0-255）
const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
].map(row => row.map(v => (v / 16) * 255));

// Bayer 8x8 阈值矩阵（归一化到 0-255）
const BAYER_8X8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map(row => row.map(v => (v / 64) * 255));

export interface DitherOptions {
  /** Bayer 矩阵大小：4 或 8，值越大细节越丰富（默认 8） */
  matrixSize?: 4 | 8;
  /** 亮部颜色（白点），默认 #ffffff */
  lightColor?: string;
  /** 暗部颜色（灰点），默认 #999999 */
  darkColor?: string;
  /** 灰度阈值偏移 -50~50，正值整体更亮，负值整体更暗（默认 0） */
  threshold?: number;
  /** 输出缩放比例，默认 1（与原图同尺寸），值越小像素感越强 */
  scale?: number;
}

/**
 * 解析 hex 颜色为 RGB
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [255, 255, 255];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

/**
 * 对 ImageData 应用 Bayer Ordered Dither
 * 返回新的 ImageData（两色点阵效果）
 */
export function bayerDither(
  imageData: ImageData,
  options: DitherOptions = {}
): ImageData {
  const {
    matrixSize = 8,
    lightColor = '#ffffff',
    darkColor = '#999999',
    threshold = 0,
    scale = 1,
  } = options;

  const matrix = matrixSize === 4 ? BAYER_4X4 : BAYER_8X8;
  const [lightR, lightG, lightB] = hexToRgb(lightColor);
  const [darkR, darkG, darkB] = hexToRgb(darkColor);

  const { width, height, data } = imageData;
  const outputWidth = Math.floor(width * scale);
  const outputHeight = Math.floor(height * scale);

  // 创建输出画布
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;
  const outputCtx = outputCanvas.getContext('2d')!;
  const outputData = outputCtx.createImageData(outputWidth, outputHeight);
  const output = outputData.data;

  // 降采样处理：按 scale 比例取样
  for (let y = 0; y < outputHeight; y++) {
    for (let x = 0; x < outputWidth; x++) {
      // 对应原图的像素位置
      const srcX = Math.floor(x / scale);
      const srcY = Math.floor(y / scale);
      const srcIdx = (srcY * width + srcX) * 4;

      // 计算灰度值 (Luma 公式)
      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      // 获取 Bayer 阈值
      const bayerValue = matrix[y % matrixSize][x % matrixSize];

      // 带偏移的阈值比较
      const adjustedGray = gray + threshold;

      const isLight = adjustedGray > bayerValue;

      const outIdx = (y * outputWidth + x) * 4;
      if (isLight) {
        output[outIdx] = lightR;
        output[outIdx + 1] = lightG;
        output[outIdx + 2] = lightB;
        output[outIdx + 3] = 255;
      } else {
        output[outIdx] = darkR;
        output[outIdx + 1] = darkG;
        output[outIdx + 2] = darkB;
        output[outIdx + 3] = 255;
      }
    }
  }

  return outputData;
}

/**
 * 从图片 URL 生成 dither 效果的 canvas
 * @param imageSrc 图片 URL
 * @param canvas 目标 canvas 元素
 * @param options dither 配置
 * @returns Promise，在图片加载并处理完成后 resolve
 */
export function renderDitherToCanvas(
  imageSrc: string,
  canvas: HTMLCanvasElement,
  options: DitherOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const { scale = 1 } = options;
      const outputWidth = Math.floor(img.width * scale);
      const outputHeight = Math.floor(img.height * scale);

      // 先把图片画到临时画布获取像素数据
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.drawImage(img, 0, 0);

      const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
      const ditheredData = bayerDither(imageData, options);

      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(ditheredData, 0, 0);

      resolve();
    };

    img.onerror = reject;
    img.src = imageSrc;
  });
}

export default { bayerDither, renderDitherToCanvas };
