import React, { useState, useEffect }  from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import history from './history';
import './App.scss';
import ThemeContext from 'app/context/ThemeContext';

import { ToastProvider } from 'react-toast-notifications';
import axios from 'axios';

import {
  Home,
  SelectPlant
} from 'app/views';

function App() {

  const [darkmode, setDarkmode] = useState(false);
  // const { addToast } = useToasts();

  useEffect(() => {
    let interval = setInterval(() => {
      getRecentLight();
    }, 10000);
    return () => {clearInterval(interval)}
  }, []);

  function getRecentLight() {
    axios.get('/api/plant/5/data/light/value/recent')
      .then(function(response) {
        console.log(response);
        if (response.data.mostRecentVal <= 30) {
          setDarkmode(true);
        } else {
          setDarkmode(false);
        }
      })
      .catch(function(error) {
        console.log(error);
        // addToast('Unable to pull most recent light value', { appearance: 'error' });
      })
  }

  return (
    // style={getGradient(currentLeft, currentRight)}
    <div className={'App ' + (darkmode ? 'darkmode' : 'lightmode')} >
      <ToastProvider
        autoDismiss
        autoDismissTimeout={5000}
      >
        <ThemeContext.Provider value={{darkmode: darkmode}}>
          <Router history={history}>
            <Switch>
              <Route exact path='/' component={SelectPlant}/>
              <Route exact path='/:plantId' component={Home}/>
            </Switch>
          </Router>
        </ThemeContext.Provider>
      </ToastProvider>
    </div>
  );
}

export default App;
