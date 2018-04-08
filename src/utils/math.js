export const toDec = v => parseInt(v, 10);
export const toInt = i => Math[i > 0 ? 'ceil' : 'floor'](i);

export const toRadians = degrees => degrees * Math.PI / 180;
export const toDegrees = radians => radians * 180 / Math.PI;

export const getAngle = (x, y) => Math.atan(x / y);
