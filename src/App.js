import React, { Component } from 'react';
import './App.css';
import Todo from './components/todo';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Todo/>
        </header>
      </div>
    );
  }
}

export default App;
