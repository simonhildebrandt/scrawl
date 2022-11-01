import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';

import OutsideClickHandler from 'react-outside-click-handler';

import GUN from 'gun';

import { Editor, Display } from 'scrawl';

import { dimensions } from './utils';


const gun = GUN(['http://127.0.0.1:8765/gun']);
const db = gun.get('dbRoot');


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



export default ({location, active, onSelect, scale}) => {
  const { initial, callback, source } = useDataForLocation(location);
  const [hovering, setHovering] = useState(false);

  const onMouseOver = () => setHovering(true);
  const onMouseOut = () => setHovering(false);

  if (initial == 'loading') return null;

  if (active) {
    return <OutsideClickHandler onOutsideClick={() => onSelect(null)}>
      <Editor initial={initial} source={source} callback={callback} {...dimensions} scale={scale}/>
    </OutsideClickHandler>
  } else {
    return <Flex position="relative" onClick={() => onSelect(location)} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      { hovering && <Box position="absolute">{location}</Box> }
      <Display initial={initial} source={source} {...dimensions} scale={scale}/>
      <Flex bgColor={hovering ? "#0001" : "#0000"} boxSizing="border-box" position="absolute" width="100%" height="100%"></Flex>
    </Flex>
  }
}
