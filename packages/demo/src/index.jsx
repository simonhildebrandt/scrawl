import "@babel/polyfill";

import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider, Flex, Text, Link } from '@chakra-ui/react';

import { Editor } from 'scrawl';

const App = () => {
  const callback = useCallback((oldState, newState) => console.log({oldState, newState}), []);

  return <ChakraProvider>
    <Editor callback={callback}/>

    <Flex m="2" fontSize="lg" gap={2} flexDir="column">
    <Text>Scrawl Pixel Editor by <Link color="green" href="https://simonhildebrandt">Simon Hildebrandt</Link>.</Text>
    <Text>Source available <Link color="green" href="https://github.com/simonhildebrandt/scrawl">here</Link>.</Text>
    </Flex>
  </ChakraProvider>
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
