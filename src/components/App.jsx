import React, {Component} from 'react';
import NestedComponent from './nested-component/NestedComponent';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app-wrapper">
                <h1>Hello World!!!</h1>
                <NestedComponent passedProp={'Some passed prop'}/>
            </div>
        );
    }
}

export default App;