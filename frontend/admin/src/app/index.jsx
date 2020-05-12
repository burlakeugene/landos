import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import history from 'core/history';
import Index from 'pages/Index';
import Item from 'pages/Item';
import Status from 'components/Status';
import './styles.scss';

class App extends Component {
  render() {
    return (
      <div className="spotter">
        <div className="spotter-inner">
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Index} />
              <Route exact path="/item"component={Item} />
            </Switch>
          </Router>
          <Status />
        </div>
      </div>
    );
  }
}

export default App;
