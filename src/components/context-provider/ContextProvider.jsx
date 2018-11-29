import React, {Component} from 'react';

export const Context = React.createContext();

class ContextProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'Anton',
            age: 30
        };

        this.actions = {
            makeOlder: this.makeOlder,
            makeYounger: this.makeYounger,
            setAge: this.setAge
        };

    }

    makeOlder = () => {
        console.log(this.state.name);

        this.setState(({age}) => ({
            age: age + 1
        }));
    };

    makeYounger = () => {
        console.log(this.state.name);
        this.setState(({age}) => ({
            age: age - 1
        }));
    };

    setAge = ({target: {value}}) => {
        console.log(this.state.name);

        const age = Number(value) || 0;
        this.setState({age});
    };

    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                actions: this.actions
            }}>
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default ContextProvider;