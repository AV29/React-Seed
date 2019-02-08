import React, { Component } from 'react';
import NestedComponent from './nested-component/NestedComponent';
import styled, { ThemeProvider } from 'styled-components';
import HookExample from "./hooks/HooksSample";
import SliderControl from "../components/common/slider-control/SliderControl";

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
  constructor(props) {
    super(props);

    this.handleChangeSliderValue = this.handleChangeSliderValue.bind(this);

    this.state = {
      sliderValue: 4
    }
  }

  handleChangeSliderValue(sliderValue) {
    this.setState({ sliderValue });
  }

  render() {
    return (
      <ThemeProvider theme={mainTheme}>
        <AppWrapper style={{ width: '50%' }}>
          {/*<Title>Hello World!!!</Title>
          <Title theme={secondaryTheme}>Hello World!!!</Title>
          <NestedComponent passedProp={'Some passed prop'}/>
          <HookExample/>*/}
          <SliderControl
            label="Slider Example"
            value={this.state.sliderValue}
            onChange={this.handleChangeSliderValue}
            steps={[
              { value: 1, label: 'Fast', tooltip: 'Fastest, Test Feasibility' },
              { value: 2, tooltip: 'Fast, Basic Search' },
              { value: 3, label: 'Balanced', tooltip: 'Default' },
              { value: 4, tooltip: 'Slower, Expanded Search' },
              { value: 5, label: 'Detailed', tooltip: 'Slowest, Advanced Search' }
            ]}
          />
        </AppWrapper>
      </ThemeProvider>
    );
  }
}

export default App;
