import React, { useState, useEffect }  from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import history from './history';
import './App.scss';

import {
  Home
} from 'app/views';

const gradients = [
  '#355C7D',
  '#6C5B7B',
  '#C06C84',
  '#ef8e38',
  '#659999',
  '#91EAE4',
  '#86A8E7',
  // '#7F7FD5',
];

function App() {

  const [currentLeft, setCurrentLeft] = useState(0);
  const [currentRight, setCurrentRight] = useState(1);

  useEffect(() => {
    const interval = setInterval(function() {
      console.log('in interval?', currentLeft, currentRight);
      setCurrentLeft(currentLeft < gradients.length ? currentLeft + 1 : 0);
      setCurrentRight(currentRight < gradients.length ? currentRight + 1 : 0);
    }, 3000);
    return () => clearInterval(interval);
  });

  function getGradient(left, right) {
    return {
      'backgroundImage': 'linear-gradient( to bottom right, ' + gradients[left] + ', ' + gradients[right] + ')'
    }
  }

  return (
    <div className='App' style={getGradient(currentLeft, currentRight)}>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Home}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
