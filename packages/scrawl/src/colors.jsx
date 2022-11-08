import React, { useState } from 'react';
import { CompactPicker } from 'react-color';
import OutsideClickHandler from 'react-outside-click-handler';
// import { MdInvertColors } from 'react-icons/md';

import { styled, Box, Flex } from './styled';


const Palette = styled(Box)`
  width: 64px;
  height: 54px;
`;

const PositionBox = styled(Box)`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`;

const ColorBox = styled(PositionBox)`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border: 1px solid black;
`;

const InvertButton = styled(PositionBox)`
  padding: 5px;
`;


export default function Colors({color, setColor}) {
  const [showPicker, setShowPicker] = useState(false);
  const [secondaryColor, setSecondaryColor] = useState('#fff');

  function handleChange(c) {
    setColor(c.hex);
    setShowPicker(false);
  }

  function flipColors() {
    setColor(secondaryColor);
    setSecondaryColor(color);
  }

  return <Flex align="center">
    <OutsideClickHandler onOutsideClick={() => setShowPicker(false)}>
    <Palette position="relative">
      <ColorBox size={24} color={secondaryColor} top={8} left={32} onClick={flipColors}/>
      <ColorBox size={32} color={color} top={16} left={8} onClick={() => setShowPicker(true)}/>
      {/* <InvertButton left={44} top={40}><MdInvertColors/></InvertButton> */}
    </Palette>
    { showPicker &&
        <Flex position="absolute">
          <CompactPicker color={color} onChange={handleChange}/>
        </Flex>
    }
    </OutsideClickHandler>
  </Flex>
}
