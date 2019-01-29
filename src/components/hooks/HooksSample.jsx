import React, { useState, useReducer } from 'react';
import Row from '../common/row/Row';

const initialState = { age: 30 };

function HookExample() {

  const name = useFormValue('Anton');
  const surname = useFormValue('Vlasik');

  const [state, dispatch] = useReducer((state, { type, payload }) => {
    switch (type) {
      case 'MAKE_OLDER':
        return {
          ...state,
          age: state.age + 1
        };

      case 'MAKE_YOUNGER':
        return {
          ...state,
          age: state.age - 1
        };

      case 'SET_AGE':
        return {
          ...state,
          age: payload.age
        };

      default:
        return state;
    }
  }, initialState);

  function handleMakeOlder() {
    dispatch({ type: 'MAKE_OLDER' });
  }

  function handleMakeYounger() {
    dispatch({ type: 'MAKE_YOUNGER' });
  }

  function handleSetAge({ target: { value } }) {
    const age = parseInt(value);
    dispatch({ type: 'SET_AGE', payload: { age } });
  }

  return (
    <div style={{ width: 500 }}>
      <h1>HOOKS EXAMPLE</h1>
      <h2>Name: {name.value}</h2>
      <h2>Surname: {surname.value}</h2>
      <h2>Age: {state.age}</h2>
      <Row label="Name">
        <input {...name}/>
      </Row>
      <Row label="Surname">
        <input {...surname}/>
      </Row>
      <Row label="Age">
        <button onClick={handleMakeYounger}>-</button>
        <input onChange={handleSetAge} value={state.age}/>
        <button onClick={handleMakeOlder}>+</button>
      </Row>
    </div>
  );
}

function useFormValue(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange({ target: { value } }) {
    setValue(value);
  }

  return { value, onChange: handleChange };
}

export default HookExample;
