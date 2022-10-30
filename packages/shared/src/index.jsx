import "@babel/polyfill";

import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider, Flex, Box } from '@chakra-ui/react';

import OutsideClickHandler from 'react-outside-click-handler';

import GUN from 'gun';

import { Editor, Display } from 'scrawl';



const dimensions = {
  width: 16,
  height: 16,
  size: 10
}


const gun = GUN(['http://127.0.0.1:8765/gun']);
const db = gun.get('dbRoot');


const coords = location => `${location[0]}x${location[1]}`;
const cleaned = event => {
  const { "#": _k, ">": _l, "_": _h, ...data } = event;
  const stripped = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));
  return stripped;
};



function useDataForLocation(location) {
  const [initial, setInitial] = useState('loading');

  const callback = useCallback((oldState, newState) => {
    // const cleaned = oldState ? Object.fromEntries(Object.keys(oldState).map(key => [key, null])) : {};
    // db.get(location).put({ ...cleaned, ...newState});
    db.get(location).put(JSON.stringify(newState));
  }, [location]);

  const source = useCallback(sub => {
    if (location) {
      const node = db.get(location);
      node.on(event => sub(cleaned(JSON.parse(event))));
      return () => {
        node.off();
      }
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      setInitial('loading');
      db.get(location).once(e => {
        setInitial((e === null || e === undefined) ? {} : cleaned(e));
      });
    }
  }, [location]);

  return { initial, callback, source };
}

const Node = ({location, active, onSelect}) => {
  const { initial, callback, source } = useDataForLocation(location);
  const [hovering, setHovering] = useState(false);

  const onMouseOver = () => setHovering(true);
  const onMouseOut = () => setHovering(false);

  if (initial == 'loading') return null;

  const borderColor = hovering ? 'gray.200' : 'white';

  if (active) {
    return <OutsideClickHandler onOutsideClick={() => onSelect(null)}>
      <Editor initial={initial} source={source} callback={callback} {...dimensions}/>
    </OutsideClickHandler>
  } else {
    return <Flex position="relative" onClick={() => onSelect(location)} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      { hovering && <Box position="absolute">{location}</Box> }
      <Display initial={initial} source={source} {...dimensions}/>
      {/* <Flex boxSizing="border-box" position="absolute" width="100%" height="100%" borderWidth={1} borderColor={borderColor}></Flex> */}
    </Flex>
  }
}

const App = () => {
  const [location, setLocation] = useState(null);

  const select = loc => {
    const pos = loc == null ? null : loc.split('x').map(v => Number(v));
    setLocation(pos);
  }

  return <ChakraProvider>
    <Flex>
      { [0, 1, 2, 3, 4, 5].map(x => (
        <Node key={coords([x, 0])} location={coords([x, 0])} active={false} onSelect={select} />
      )) }
    </Flex>
    {location && <Flex flexDir="column">
      <Node key={location} location={coords(location)} active={true} onSelect={select} />
    </Flex> }
    { location && coords(location)}
  </ChakraProvider>
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
