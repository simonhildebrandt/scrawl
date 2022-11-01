import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import Node from './node';
import { coords, tileSize } from './utils';
import useKeyCodeListener from './useKeyCodeListener';


const keycodes = {
  ArrowLeft: [-1, 0],
  ArrowUp: [0, -1],
  ArrowRight: [1, 0],
  ArrowDown: [0, 1]
}

export default ({rect, scale}) => {
  const { width, height } = rect;
  const [center, setCenter] = useState({x: 0, y: 0});

  const size = tileSize * scale;
  const tilesX = ((Math.floor((((width * 4) / size) + 4) / 8)) * 2) + 1;
  const tilesY = ((Math.floor((((height * 4) / size) + 4) / 8)) * 2) + 1;

  const centerX = width / 2;
  const centerY = height / 2;
  const startX = centerX - ((tilesX / 2) * size);
  const startY = centerY - ((tilesY / 2) * size);

  function *getPositions() {
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        const locX = center.x - (tilesX / 2) + 0.5 + x;
        const locY = center.y - (tilesY / 2) + 0.5 + y;
        const posX = startX + x * size;
        const posY = startY + y * size;
        yield { x, y, location: coords([locX, locY]), posX, posY };
      }
    }
  }

  useKeyCodeListener(keycode => {
    const direction = keycodes[keycode];
    setCenter({x: center.x + direction[0], y: center.y + direction[1]});
  }, Object.keys(keycodes));

  useKeyCodeListener(() => {
    setLocation(null);
  }, ["Escape"]);

  const [location, setLocation] = useState(null);

  function renderEditor() {
    const editorX = centerX - (size / 2) - 1;
    const editorY = centerY - (size / 2) - 55;

    return <Flex bgColor="white" flexDir="column" zIndex={1} width={size + 2} height={size + 76} position="absolute" left={editorX} top={editorY}>
      <Node key={location} location={coords(location)} active={true} onSelect={select} scale={scale} />
      { location && coords(location)}
    </Flex>
  }

  const select = loc => {
    if (loc == null) {
      setLocation(null);
    } else {
      const pos = loc.split('x').map(v => Number(v));
      setCenter({x: pos[0], y: pos[1]});
      setLocation(pos);
    }
  }

  return <>
      { [...getPositions()].map(({location, posX, posY}) => (
        <Box key={location} position="absolute" left={`${posX}px`} top={`${posY}px`}>
          <Node location={location} active={false} onSelect={select} scale={scale}/>
        </Box>
      )) }
    {location && renderEditor() }
  </>
}

