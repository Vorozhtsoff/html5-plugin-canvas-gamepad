export default function roundRect(x, y, w, h, r) {
    let rad;
    if (w < 2 * r) {
        rad = w / 2;
    }
    if (h < 2 * r) {
        rad = h / 2;
    }

    this.beginPath();
    this.moveTo(x + rad, y);
    this.arcTo(x + w, y, x + w, y + h, rad);
    this.arcTo(x + w, y + h, x, y + h, rad);
    this.arcTo(x, y + h, x, y, rad);
    this.arcTo(x, y, x + w, y, rad);
    this.closePath();
    return this;
}
