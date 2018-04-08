
export const drawTrace = ({ ctx, map, fontSize }) => {
    let dy = 15;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = fontSize;
    ctx.fillText('debug', 10, dy);
    ctx.font = fontSize;
    dy += 5;
    Object.entries(map).forEach(([prop, value]) => {
        dy += 10;
        const text = `${prop} : ${JSON.stringify(value).slice(1, -1)}`;
        ctx.fillText(text, 10, dy);
    });
};

export const drawDebug = ({
    ctx,
    map,
    width,
    fontSize
}) => {
    let dy = 15;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = fontSize;
    ctx.fillText('trace', width - 10, dy);
    ctx.font = fontSize;
    dy += 5;
    Object.entries(map).forEach(([prop, value]) => {
        dy += 10;
        const text = `${prop} : ${value}`;

        ctx.fillText(text, width - 10, dy);
    });
};
