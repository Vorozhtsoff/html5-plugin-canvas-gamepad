const noop = () => void 0; // eslint-disable-line
const isFunc = fn => fn instanceof Function;

function Canvas(options = {}) {
    const parent = options.parent || 'body';
    const width = options.width || 300;
    const height = options.height || 300;
    const area = options.area || {
        left: -10,
        bottom: -10,
        width: 20,
        height: 20
    };
    const callbacks = isFunc(options.callback) ? options.callback : {};
    const wheelCallback = isFunc(callbacks.wheel) ? callbacks.wheel : noop;
    const MouseMoveCallback = isFunc(callbacks.mouseMove) ? callbacks.mouseMove : noop;
    const MouseDownCallback = isFunc(callbacks.mouseDown) ? callbacks.mouseDown : noop;
    const MouseUpCallback = isFunc(callbacks.mouseUp) ? callbacks.mouseUp : noop;
    const MouseOutCallback = isFunc(callbacks.mouseOut) ? callbacks.mouseOut : noop;
    let canvas;
    let context;

    function xs(x) {
        return width * (x - area.left) / area.width;
    }

    function ys(y) {
        return height - height * (y - area.bottom) / area.height;
    }

    function rs(r) {
        return r / area.width * width;
    }

    this.xg = x => (x * area.width) / width + area.left;

    this.yg = y => (area.height * (height - y)) / height + area.bottom;

    this.polygon = function polygon(points, color) {
        if (points instanceof Array && points.length >= 3) {
            context.fillStyle = color || '#000000';
            context.beginPath();
            context.moveTo(xs(points[0].x), ys(points[0].y));
            for (let i = 1; i < points.length; i += 1) {
                context.lineTo(xs(points[i].x), ys(points[i].y));
            }
            context.lineTo(xs(points[0].x), ys(points[0].y));
            context.closePath();
            context.fill();
        }
    };

    this.clear = function clear(color) {
        context.fillStyle = (color) || '#d0d0d0';
        context.fillRect(0, 0, width, height);
    };

    function point(x, y, radius, color) {
        context.fillStyle = (color) || '#FF0000';
        context.beginPath();
        context.arc(
            xs(x), ys(y), // center
            (radius) ? rs(radius) : 3, // radius
            0, Math.PI * 2, // angles start and end draw
            true
        );
        context.closePath();
        context.fill();
    };

    this.point = point;

    function line(x1, y1, x2, y2, color, lineWidth) {
        context.strokeStyle = color || '#000000';
        context.beginPath();
        context.lineWidth = lineWidth || 1;
        context.moveTo(xs(x1), ys(y1));
        context.lineTo(xs(x2), ys(y2));
        context.closePath();
        context.stroke();
    };

    this.line = line;

    this.arrow = function arrow() {
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
    };

    function init() {
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        canvas.addEventListener('wheel', wheelCallback);
        canvas.addEventListener('mousedown', MouseDownCallback);
        canvas.addEventListener('mouseup', MouseUpCallback);
        canvas.addEventListener('mousemove', MouseMoveCallback);
        canvas.addEventListener('mouseout', MouseOutCallback);

        context = canvas.getContext('2d');
        document.querySelector(parent).appendChild(canvas);
    }
    init();
}

export default Canvas;
