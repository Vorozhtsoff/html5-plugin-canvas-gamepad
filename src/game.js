import Canvas from './Canvas';

const createCanvas = (id = 'game') => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', id);
    document.body.appendChild(canvas);
    return canvas;
};

const initialState = {};

const init = ({ CENTER = {}, X_SIZE, Y_SIZE, Z_SIZE } = initialState) => {
    return new Canvas({
        area: {
            left: CENTER.x - X_SIZE / 2,
            bottom: CENTER.y - Y_SIZE / 2,
            width: X_SIZE,
            height: Y_SIZE,
            z: Z_SIZE
        },
        width: 640,
        height: 360,
        callback: {
            /* wheel: wheelCallback,
            mouseMove: mouseMoveCallback,
            mouseDown: mouseDownCallback,
            mouseUp: mouseUpCallback,
            mouseOut: mouseOutCallback */
        }
    });
};

export default init;
