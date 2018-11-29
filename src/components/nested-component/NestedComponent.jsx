import React, {Fragment} from 'react';
import {string} from 'prop-types';
import {Context} from '../context-provider/ContextProvider';

const NestedComponent = ({passedProp}) => {
    return (
        <Context.Consumer>
            {({state, actions}) => (
                <Fragment>
                    <p>{state.name}</p>
                    <p>{state.age}</p>
                    <p>{passedProp}</p>
                    <button onClick={actions.makeOlder}>Make Older</button>
                    <button onClick={actions.makeYounger}>Make Younger</button>
                    <input type="number" onChange={actions.setAge} value={state.age}/>
                </Fragment>
            )}
        </Context.Consumer>
    );
};

NestedComponent.propTypes = {
    passedProp: string
};

export default NestedComponent;