import "@babel/polyfill";

import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider, Button, ColorModeScript } from '@chakra-ui/react';

import GUN from 'gun';

import Editor from 'scrawl';



const gun = GUN();


// gun.get(location).on((data, key) => {
//   console.log("realtime updates:", data);
// });

// setInterval(() => { gun.get('mark').get('live').put(Math.random()) }, 9);


// const source = () => {
//   console.log('on');
//   return () => console.log('off');
// }

const coords = location => `${location[0]}x${location[1]}`;


const App = () => {
  const [location, setLocation] = useState([0, 0]);

  console.log('render')

  const callback = useCallback(state => {
    console.log({state});
    gun.get(coords(location)).put(state);
  }, [location]);

  const source = useCallback(sub => {
    const node = gun.get(coords(location));
    console.log('on', {node, sub})
    node.on(sub);
    console.log('subbing');
    return () => {
      node.off();
    }
  }, [location]);

  const advance = direction => () => {
    setLocation([location[0] + direction, 0]);
  }

  return <ChakraProvider>
    <Editor callback={callback} source={source}/>
    <Button onClick={advance(-1)}>Back</Button>
    <Button onClick={advance(1)}>Forward</Button>
    {coords(location)}
  </ChakraProvider>
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
