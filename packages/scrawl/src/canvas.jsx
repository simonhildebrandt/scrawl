import React from 'react';

const PIXEL_SIZE = 20;

const getKey = ({x, y}) => `${x}-${y}`;


export default function Canvas(state) {
  const { width, height, pixels, defaultColor = '#fff', draw, commit } = state;

  function pointerUp() {
    commit();
  }

  function pointerMove(event) {
    event.target.releasePointerCapture(event.pointerId);

    const {
      target: {dataset: { x, y }},
      pointerType,
      buttons
    } = event;

    if (pointerType == 'mouse' && buttons !== 1) return;

    draw([getKey({x, y})]);
  };

  function *getPositions() {
    for (let y = 0; y < width; y++) {
      for (let x = 0; x < height; x++) {
        yield {x, y};
      }
    }
  }

  function getColor({x, y}) {
    const key = getKey({x, y});
    return pixels[key] || defaultColor;
  }

  function getPixels() {
    return [...getPositions()].map((coords) => {
      const { x, y } = coords;

      return {
        "data-x": x,
        "data-y": y,
        key: getKey(coords),
        x: x * PIXEL_SIZE,
        y: y * PIXEL_SIZE,
        fill: getColor(coords),
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
      }
    })
  }

  return <svg style={{touchAction: 'none'}}
    width={width*PIXEL_SIZE}
    height={height*PIXEL_SIZE}
    onPointerMove={pointerMove}
    onPointerUp={pointerUp}
  >
    { getPixels().map( props => <rect {...props}/>)}
  </svg>
}
