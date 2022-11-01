import "@babel/polyfill";

import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { HiMagnifyingGlass, HiMagnifyingGlassMinus, HiMagnifyingGlassPlus } from 'react-icons/hi2';

import useSize from './useSize';
import Content from  './content';


const DEFAULT_SCALE = 10;

const App = () => {
  const target = useRef(null);
  const rect = useSize(target);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const rescale = s => () => setScale(scale * s);

  return <ChakraProvider>
    <Flex width="100%" height="100%" overflow="hidden" position="relative" ref={target}>
      { rect && <Content rect={rect} scale={scale}/> }
      <Flex position="absolute" right={0} bottom={0} fontSize={32} color="black">
        <HiMagnifyingGlass onClick={() => setScale(DEFAULT_SCALE)}/>
        <HiMagnifyingGlassMinus onClick={rescale(.8)}/>
        <HiMagnifyingGlassPlus onClick={rescale(1.2)}/>
      </Flex>
    </Flex>
  </ChakraProvider>
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
