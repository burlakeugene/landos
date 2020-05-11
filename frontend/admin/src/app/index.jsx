import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import history from 'core/history';
import Index from 'pages/Index';
import Prealoader from 'components/Preloader';
import './styles.scss';

class App extends Component {
  render() {
    return (
      <div className="landos">
        <div className="landos-inner">
          <Prealoader />
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Index} />
              {/* <Route exact path="/item"component={Item} /> */}
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
