import React, { Component } from 'react';
import './App.scss';
import FormContainer from "./componets/FormContainer";
import HeaderContainer from "./componets/HeaderContainer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            <HeaderContainer />
        </header>
        <FormContainer />
      </div>
    );
  }
}

export default App;
