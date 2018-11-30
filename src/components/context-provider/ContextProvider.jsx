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
      makeOlder: this.makeOlder.bind(this),
      makeYounger: this.makeYounger.bind(this),
      setAge: this.setAge.bind(this)
    };

  }

  makeOlder() {
    this.setState(({age}) => ({
      age: age + 1
    }));
  }

  makeYounger() {
    this.setState(({age}) => ({
      age: age - 1
    }));
  }

  setAge({target: {value}}) {
    const age = Number(value) || 0;
    this.setState({age});
  }

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
