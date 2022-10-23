import { useEffect, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      const offset = state.offset + 1;
      const history = [...state.history.slice(0, offset), action.newState];
      return { history, offset };
    case 'back':
      return { ...state, offset: state.offset - 1};
    case 'forward':
      return { ...state, offset: state.offset + 1};
    }
}

export default function useHistory(initial, callback=() => {}) {
  const [{history, offset}, dispatch] = useReducer(reducer, {history: [initial], offset: 0});
  const state = history[offset];

  useEffect(() => callback(state), [state, callback]);

  return {
    state,
    add: newState => dispatch({type: 'add', newState}),
    back: () => dispatch({type: 'back'}),
    forward: () => dispatch({type: 'forward'}),
    canForward: (history.length - 1) > offset,
    canBack: offset > 0
  };
}
