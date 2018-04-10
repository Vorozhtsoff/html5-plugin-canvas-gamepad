import font from '../config/font';

const getStyles = (fontSrc, id) => (
    `@font-face { font-family: 'bit'; src: url( ${fontSrc}) format('truetype'); font-weight: normal; font-style: normal; }`
    + '* { padding: 0; margin: 0; -webkit-touch-callout: none; -webkit-user-select: none; }'
    + 'html { -ms-touch-action: manipulation; touch-action: manipulation; }'
    + 'body { width:  100%; height: 100%; margin: 0px; padding:0px; touch-action: none; -ms-touch-action: none; overflow: hidden; }'
    + 'canvas { image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast;'
    + 'image-rendering: -o-crisp-edges; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor;'
    + 'touch-action-delay: none; touch-action: none; -ms-touch-action: none; position:fixed; }'
    + `#${id} { z-index: 999 }`
);

export const css = id => getStyles(font, id);

export const appendCss = (id = 'CanvasGamepad') => {
    const style = document.createElement('style');
    style.innerHTML = css(id);
    document.head.appendChild(style);
};
