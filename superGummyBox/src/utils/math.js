
export function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.pow(xDist, 2) + Math.pow(yDist, 2)
}

export function hypotenuse(width, height) {
  return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
}