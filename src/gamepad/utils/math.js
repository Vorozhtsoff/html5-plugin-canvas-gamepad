export const toDec = v => parseInt(v, 10);
export const toInt = i => Math[i > 0 ? 'ceil' : 'floor'](i);

export const radians = degrees => degrees * Math.PI / 180;
export const degrees = radians => radians * 180 / Math.PI;

export const getAngle = (x, y) => Math.atan(x/y);

console.log(getAngle(1,1) === radians(45))
window.getAngle = getAngle;