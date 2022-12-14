import React, { useState, useCallback, useEffect } from 'react';
import { FaUndo, FaRedo } from 'react-icons/fa';
import Canvas from './canvas';
import Colors from './colors';
import useHistory from './useHistory';
import { styled, Flex } from './styled';


const noop = () => {};

const Wrapper = styled(Flex)`
  border-width: 1px;
  border-color: #ccc;
`;

const UndoRedo = styled(Flex)`
  font-size: 32px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const SubPalette = styled(Flex)`
  margin-right: 8px;
  gap: 8px;
`;

const Controls = ({color, setColor, back, forward, canBack, canForward}) => {
  return <Flex position="relative" align="center" justify="space-between" width="100%">
    <Colors color={color} setColor={setColor}/>
    <SubPalette>
      <UndoRedo onClick={canBack ? back : noop} disabled={!canBack}>
        <FaUndo/>
      </UndoRedo>
      <UndoRedo onClick={canForward ? forward: noop} disabled={!canForward}>
        <FaRedo/>
      </UndoRedo>
    </SubPalette>
  </Flex>
};


export default ({initial = {}, callback = noop, source = () => noop, width, height, scale }) => {
  const [color, setColor] = useState('#000');
  const [stroke, setStroke] = useState({});

  const {
    state,
    add,
    sync,
    back,
    forward,
    canBack,
    canForward,
  } = useHistory(initial, callback);

  useEffect(() => {
    return source(data => sync(data));
  }, [source]);

  const draw = coords => {
    const newPixels = Object.fromEntries(coords.map(coord => ([coord, color])));
    setStroke({...stroke, ...newPixels});
  };

  const commit = (coords = []) => {
    const newPixels = Object.fromEntries(coords.map(coord => ([coord, color])));
    add({...state, ...stroke, ...newPixels});
    setStroke({});
  };

  const pixels = {...state, ...stroke};

  return <Flex>
    <Flex flexDir="column">
      <Flex>
        <Controls
          color={color}
          setColor={setColor}
          back={back}
          forward={forward}
          canBack={canBack}
          canForward={canForward}
        />
      </Flex>
      <Wrapper>
        <Canvas scale={scale} active={true} width={width} height={height} pixels={pixels} draw={draw} commit={commit}/>
      </Wrapper>
    </Flex>
  </Flex>
}
