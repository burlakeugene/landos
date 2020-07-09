import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import history from 'core/history';
import Index from 'pages/Index';
import Sections from 'pages/Sections';
import Status from 'components/Status';
import ModalRemove from 'components/ModalRemove';
import Preloader from 'components/Preloader';
import 'modules/helpers';
import './styles.scss';

class App extends Component {
  render() {
    return (
      <div className="spotter">
        <div className="spotter-inner">
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Index} />
              <Route exact path="/sections" component={Sections} />
            </Switch>
          </Router>
          <Status />
          <Preloader />
          <ModalRemove />
        </div>
      </div>
    );
  }
}

export default App;
