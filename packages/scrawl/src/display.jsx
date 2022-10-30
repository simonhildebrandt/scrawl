import React, { useState, useEffect } from 'react';

import Canvas from './canvas';

export default ({initial, source, ...rest}) => {
  const [state, setState] = useState(initial);

  useEffect(() => {
    return source(data => {
      setState(data);
    });
  }, [source]);

  return <Canvas pixels={state} {...rest} />;
}


