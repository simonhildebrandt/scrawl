import { useReducer } from 'react';

import { isEqual } from 'lodash';


const newOffset = (o, i) => String(Number(o) + i);

export default function useHistory(initial = {}, callback=() => {}) {
  const [{history, offset}, dispatch] = useReducer(reducer, {history: { 0: initial }, offset: "0"});
  const currentState = history[offset];

  function process(state, action) {
    function add(state, action) {
      const offset = newOffset(state.offset, 1);
      const nextOffset = newOffset(state.offset, 2);
      const history = { ...state.history, [offset]: action.newState, [nextOffset]: null };
      return { history, offset };
    }

    switch (action.type) {
      case 'add':
        return add(state, action);
      case 'sync':
        if (isEqual(state.history[state.offset], action.newState)) {
          return state;
        } else {
          return add(state, action);
        }
      case 'back':
        return { ...state, offset: newOffset(state.offset, - 1)};
      case 'forward':
        return { ...state, offset: newOffset(state.offset, 1)};
      }
  }

  function reducer(state, action) {
    const newState = process(state, action);

    if (action.type !== 'sync') {
      callback(state.history[state.offset], newState.history[newState.offset]);
    }

    return newState;
  }

  return {
    state: currentState,
    add: newState => dispatch({type: 'add', newState}),
    sync: newState => dispatch({type: 'sync', newState}),
    back: () => dispatch({type: 'back'}),
    forward: () => dispatch({type: 'forward'}),
    canForward: !!history[newOffset(offset, 1)],
    canBack: offset != '0'
  };
}
