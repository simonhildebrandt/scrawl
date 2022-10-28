import { useEffect, useReducer } from 'react';

export default function useHistory(initial, callback=() => {}) {
  const [{history, offset}, dispatch] = useReducer(reducer, {history: [initial], offset: 0});
  const currentState = history[offset];

  function process(state, action) {
    function add(state, action) {
      const offset = state.offset + 1;
      const history = [...state.history.slice(0, offset), action.newState];
      return { history, offset };
    }

    switch (action.type) {
      case 'add':
        return add(state, action);
      case 'sync':
        return add(state, action);
      case 'back':
        return { ...state, offset: state.offset - 1};
      case 'forward':
        return { ...state, offset: state.offset + 1};
      }
  }

  function reducer(state, action) {
    const newState = process(state, action);

    console.log({action})
    if (action.type !== 'sync') {
      callback(newState.history[newState.offset]);
    }
    return newState;
  }

  return {
    state: currentState,
    add: newState => dispatch({type: 'add', newState}),
    sync: newState => dispatch({type: 'sync', newState}),
    back: () => dispatch({type: 'back'}),
    forward: () => dispatch({type: 'forward'}),
    canForward: (history.length - 1) > offset,
    canBack: offset > 0
  };
}
