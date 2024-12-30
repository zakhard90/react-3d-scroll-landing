export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
export const easeInOut = (x, p) => x < 0.5 ? 4 * Math.pow(x, p) : 1 - Math.pow(-2 * x + 2, p) / 2
export const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
export const deg = (d) => Math.PI * d / 180
export const ang = (a) => Math.round((180 * a) / Math.PI)