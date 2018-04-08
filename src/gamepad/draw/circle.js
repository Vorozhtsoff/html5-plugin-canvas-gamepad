const { PI } = Math;

export default function drawCircle({
    ctx,
    fill,
    x,
    y,
    radius
}) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * PI);
    ctx.fill();
    ctx.closePath();
}
