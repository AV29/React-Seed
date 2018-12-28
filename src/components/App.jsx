import React, {Component} from 'react';
import NestedComponent from './nested-component/NestedComponent';
import styled, {ThemeProvider} from 'styled-components';

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
  color: ${({theme: {color}}) => color};
`;

export const AppWrapper = styled.div`
  background-color: transparent;
  padding: 10px;
`;

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={mainTheme}>
        <AppWrapper>
          <Title>Hello World!!!</Title>
          <Title theme={secondaryTheme}>Hello World!!!</Title>
          <NestedComponent passedProp={'Some passed prop'}/>
        </AppWrapper>
      </ThemeProvider>
    );
  }
}

export default App;
