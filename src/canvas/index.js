const noop = () => undefined;
const isFunc = v => v instanceof Object;
const { isArray } = Array;
const setFunc = fn => (isFunc(fn) ? fn : noop);
const addListeners = (el, map) => (
    Object.entries(map).forEach(([eventName, cb]) => el.addEventListener(eventName, cb))
);

const initialArea = {
    left: -10,
    bottom: -10,
    width: 20,
    height: 20
};

export default function Canvas({
    parent = 'body',
    width = 300,
    height = 300,
    area = initialArea,
    callbacks = {}
} = {}) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const eventMap = {
        wheel: setFunc(callbacks.wheel),
        mousedown: setFunc(callbacks.mouseDown),
        mouseup: setFunc(callbacks.mouseUp),
        mousemove: setFunc(callbacks.mouseMove),
        mouseout: setFunc(callbacks.mouseOut)
    };

    const xs = x => width * (x - area.left) / area.width;
    const ys = y => height - height * (y - area.bottom) / area.height;
    const rs = r => r / area.width * width;

    canvas.width = width;
    canvas.height = height;
    document.querySelector(parent).appendChild(canvas);

    addListeners(canvas, eventMap);

    return {
        xg: x => (x * area.width) / width + area.left,
        yg: y => (area.height * (height - y)) / height + area.bottom,
        polygon(points, color) {
            if (isArray(points) && points.length >= 3) {
                context.fillStyle = (color) || '#000000';
                context.beginPath();
                context.moveTo(xs(points[0].x), ys(points[0].y));
                for (let i = 1; i < points.length; i += 1) {
                    context.lineTo(xs(points[i].x), ys(points[i].y));
                }
                context.lineTo(xs(points[0].x), ys(points[0].y));
                context.closePath();
                context.fill();
            }
        },
        clear(color) {
            context.fillStyle = color || '#d0d0d0';
            context.fillRect(0, 0, width, height);
        },
        point(x, y, radius, color) {
            context.fillStyle = color || '#FF0000';
            context.beginPath();
            context.arc(
                xs(x), ys(y), // center
                (radius) ? rs(radius) : 3, // radius
                0,
                Math.PI * 2, // angles start and end draw
                true
            );
            context.closePath();
            context.fill();
        },
        line(x1, y1, x2, y2, color, lineWidth) {
            context.strokeStyle = color || '#000000';
            context.beginPath();
            context.lineWidth = (lineWidth) || 1;
            context.moveTo(xs(x1), ys(y1));
            context.lineTo(xs(x2), ys(y2));
            context.closePath();
            context.stroke();
        },
        arrow() {
            context.strokeStyle = '#000000';
            context.beginPath();
            context.moveTo(xs(0), 0);
            context.lineTo(xs(0) + 10, 20);
            context.moveTo(xs(0), 0);
            context.lineTo(xs(0) - 10, 20);
            context.moveTo(width, ys(0));
            context.lineTo(width - 20, ys(0) + 10);
            context.moveTo(width, ys(0));
            context.lineTo(width - 20, ys(0) - 10);
            context.closePath();
            context.stroke();
        }
    };
}
