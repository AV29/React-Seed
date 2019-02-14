import React, { Component, useState } from 'react';
import NestedComponent from './nested-component/NestedComponent';
import styled, { ThemeProvider } from 'styled-components';
import HookExample from "./hooks/HooksSample";
import SliderControl from "./common/slider-control/Slider";

const h1FontSize = 20;

const mainTheme = {
  color: 'orange'
};


const secondaryTheme = {
  color: 'tomato'
};

export const Title = styled.h1`
  font-size: ${h1FontSize};
  text-align: center;
  color: ${({ theme: { color } }) => color};
`;

export const AppWrapper = styled.div`
  background-color: transparent;
  padding: 10px;
`;

class App extends Component {
  constructor (props) {
    super(props);

    this.handleChangeSliderValue = this.handleChangeSliderValue.bind(this);
    this.handleSequencedClick = this.handleSequencedClick.bind(this);
    this.handleSporadicClick = this.handleSporadicClick.bind(this);
    this.handleBatchedClick = this.handleBatchedClick.bind(this);

    this.state = {
      sliderValue: 2,
      counterBatched: 0,
      counterSequenced: 0,
      counterSporadic: 0
    }
  }

  handleChangeSliderValue (sliderValue) {
    console.log(sliderValue);
    this.setState({ sliderValue });
  }

  handleBatchedClick () {
    for (let i = 0; i < 5; i += 1) {
      this.setState(({ counterBatched }) => ({ counterBatched: counterBatched + 1 }));
    }
  }

  handleSporadicClick () {
    // for (let i = 0; i < 5; i += 1) {
    //   console.log('qw');
    //   this.setState({ counterSporadic: this.state.counterSporadic + 1 });
    // }
    this.setState({ counterSporadic: this.state.counterSporadic + 1 });
    this.setState({ counterSporadic: this.state.counterSporadic + 1 });
    this.setState({ counterSporadic: this.state.counterSporadic + 1 });
    this.setState({ counterSporadic: this.state.counterSporadic + 1 });
    this.setState({ counterSporadic: this.state.counterSporadic + 1 });
  }

  handleSequencedClick () {
    //this.makeSequencedUpdates(5, () => ({ counterSequenced: this.state.counterSequenced + 1 }));
    this.makeSequencedUpdates(5);
  }

  makeSequencedUpdates (count, updater) {
    let counter = 0;

    const func = () => {
      counter += 1;
      if (counter > count) return;
      //this.setState(updater(), func);
      this.setState({ counterSequenced: this.state.counterSequenced + 1 }, func);
    };

    func.bind(this)();
  }


  render () {
    return (
      <ThemeProvider theme={mainTheme}>
        <AppWrapper style={{ width: '50%' }}>
          {/*<Title>Hello World!!!</Title>
          <Title theme={secondaryTheme}>Hello World!!!</Title>
          <NestedComponent passedProp={'Some passed prop'}/>
          <HookExample/>*/}
          {/*<button onClick={this.handleBatchedClick}>Batched = {this.state.counterBatched}</button>
          <button onClick={this.handleSequencedClick}>Sequenced = {this.state.counterSequenced}</button>
          <button onClick={this.handleSporadicClick}>Sporadic = {this.state.counterSporadic}</button>*/}
          <SliderControl
            label="Slider Example"
            value={this.state.sliderValue}
            onChange={this.handleChangeSliderValue}
            min={1}
            max={8}
            step={2}
            info={{
              1: { tickMark: 3},
              2: { tooltip: 'Fast, Basic Search' },
              3: { tickMark: 'Balanced'},
              4: { tooltip: 'Slower, Expanded Search' },
              5: { tooltip: 'Wow', tickMark: 'Detailed'}
            }}
          />
          {/*<Parent/>*/}
        </AppWrapper>
      </ThemeProvider>
    );
  }
}

function Parent () {
  let [count, setCount] = useState(0);
  return (
    <h1 onClick={() => setCount(count + 1)}>
      Parent clicked {count} times
      <Child/>
    </h1>
  );
}

function Child () {
  let [count, setCount] = useState(0);
  return (
    <button onClick={() => {
      setCount(count + 1);
    }}>
      Child clicked {count} times
    </button>
  );
}

export default App;
