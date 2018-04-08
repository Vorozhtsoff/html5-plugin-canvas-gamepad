import drawCircle from './circle';

const DEFAULT_COLOR = 'rgba(0,0,0,0)';
const initialState = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    radius: 0,
    colors: {
        base: DEFAULT_COLOR,
        dust: DEFAULT_COLOR,
        stick: DEFAULT_COLOR,
        ball: DEFAULT_COLOR
    }
};

export default function drawStick({
    x,
    y,
    dx,
    dy,
    radius,
    colors: {
        base,
        dust,
        stick,
        ball
    } = {},
    ctx
} = initialState) {
    const baseConfig = {
        ctx,
        x,
        y,
        radius,
        fill: DEFAULT_COLOR
    };

    drawCircle({ ...baseConfig, fill: base });
    drawCircle({ ...baseConfig, radius: radius - 5, fill: dust });
    drawCircle({ ...baseConfig, radius: 10, fill: stick });
    drawCircle({
        ...baseConfig,
        x: dx,
        y: dy,
        radius: radius - 10,
        fill: ball
    });
}
