import "@babel/polyfill";

import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider, Button, ColorModeScript } from '@chakra-ui/react';

import GUN from 'gun';

import Editor from 'scrawl';


const gun = GUN();
const db = gun.get('dbRoot');


const coords = location => `${location[0]}x${location[1]}`;
const cleaned = event => {
  const { "#": _k, ">": _l, "_": _h, ...data } = event;
  const stripped = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));
  return stripped;
};

const App = () => {
  const [location, setLocation] = useState([0, 0]);
  const [initial, setInitial] = useState('loading');

  const callback = useCallback((oldState, newState) => {
    const cleaned = oldState ? Object.fromEntries(Object.keys(oldState).map(key => [key, null])) : {};
    db.get(coords(location)).put({ ...cleaned, ...newState});
  }, [location]);

  const source = useCallback(sub => {
    const node = db.get(coords(location));
    node.on(event => sub(cleaned(event)));
    return () => {
      node.off();
    }
  }, [location]);

  useEffect(() => {
    setInitial('loading');
    const node = db.get(coords(location));
    node.once(e => {
      setInitial((e === null || e === undefined) ? {} : cleaned(e));
    });
  }, [location]);


  const advance = direction => () => {
    setLocation([location[0] + direction, 0]);
  }

  return <ChakraProvider>
    { initial != 'loading' && <Editor key={location} initial={initial} callback={callback} source={source}/> }
    <Button onClick={advance(-1)}>Back</Button>
    <Button onClick={advance(1)}>Forward</Button>
    {coords(location)}
  </ChakraProvider>
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
