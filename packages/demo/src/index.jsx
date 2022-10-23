import "@babel/polyfill";

import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider } from '@chakra-ui/react';

import Editor from 'scrawl';

const App = () => {
  const callback = useCallback(state => console.log({state}), []);

  return <ChakraProvider><Editor callback={callback}/></ChakraProvider>
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
