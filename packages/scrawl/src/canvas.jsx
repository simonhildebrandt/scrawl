import React from 'react';

const PIXEL_SIZE = 20;

const getKey = ({x, y}) => `${x}-${y}`;


export default function Canvas(state) {
  const { width, height, size, pixels, defaultColor = '#fff', draw, commit, active } = state;

  function onPointerUp() {
    commit();
  }

  function onPointerMove(event) {
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
        x: x * size,
        y: y * size,
        fill: getColor(coords),
        width: size,
        height: size,
      }
    })
  }

  const handlers = active ? { onPointerMove, onPointerUp } : {};

  return <svg style={{touchAction: 'none'}}
    width={width*size}
    height={height*size}
    {...handlers}
  >
    { getPixels().map( props => <rect {...props}/>)}
  </svg>
}
