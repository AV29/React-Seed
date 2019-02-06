import React, { useState, useReducer } from 'react';
import Row from '../common/row/Row';
import ageReducer from './ageReducer';

function HookExample() {

  const name = useFormValue('Anton');
  const surname = useFormValue('Vlasik');

  const [state, dispatch] = useReducer(ageReducer.reducer, ageReducer.initialState);

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
