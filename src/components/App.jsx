import React, {Component} from 'react';
import NestedComponent from './nested-component/NestedComponent';
import styled from 'styled-components';

const h1FontSize = 20;

const Title = styled.h1`
  font-size: ${h1FontSize};
  text-align: center;
  color: ${props => props.redTheme ? 'tomato' : 'black'};
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
          <AppWrapper>
                <Title redTheme={false}>Hello World!!!</Title>
                <NestedComponent passedProp={'Some passed prop'}/>
          </AppWrapper>
        );
    }
}

export default App;
