const { min, max, floor, pow, abs } = Math;

export const SQUARE = "SQUARE";
export const CIRCLE = "CIRCLE";
export const TRIANGLE = "TRIANGLE";
export const VERTICAL_BAR = "VERTICAL_BAR";
export const HYPHEN = "HYPHEN";

export const iterateShape = (
  shape,
  size,
  pointX,
  pointY,
  rows,
  columns,
  iterator
) => {
  let halfSize = floor(size / 2);
  let minY = max(0, pointY - halfSize);
  let maxY = min(rows - 1, pointY - halfSize + size - 1);
  let minX = max(0, pointX - halfSize);
  let maxX = min(columns - 1, pointX - halfSize + size - 1);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (
        shape === SQUARE ||
        (shape === CIRCLE &&
          pow(x - pointX, 2) + pow(y - pointY, 2) <= pow(halfSize, 2)) ||
        (shape === TRIANGLE &&
          abs(x - pointX) * 2 <= y - pointY - halfSize + size - 1) ||
        (shape === VERTICAL_BAR && x === pointX) ||
        (shape === HYPHEN && y === pointY)
      ) {
        iterator(y, x);
      }
    }
  }
};
