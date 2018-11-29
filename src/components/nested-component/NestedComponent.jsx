import React, {Fragment} from 'react';
import {Context} from '../context-provider/ContextProvider';

const NestedComponent = props => {

    return (
        <Context.Consumer>
            {({state, actions, instance, setAge}) => {
                return (
                    <Fragment>
                        <p>{state.name}</p>
                        <p>{state.age}</p>
                        <button onClick={actions.makeOlder}>Make Older</button>
                        <button onClick={actions.makeYounger}>Make Younger</button>
                        <input type="number" onChange={actions.setAge} value={state.age}/>
                    </Fragment>
                );
            }}
        </Context.Consumer>
    );
};

export default NestedComponent;