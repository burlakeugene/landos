import React, { Component } from 'react';
import Transaction from './components/Transaction';
import './styles/styles.scss';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title
        ? this.props.title
        : 'RECENT NETWORK TRANSACTIONS',
    };
  }
  render() {
    return (
      <div className="transactions">
        <div className="transactions-title">{this.state.title}</div>
        <div className="transactions-list">
          <div className="transaction">
            <div className="transaction-block transaction-block__id">Id</div>
            <div className="transaction-block">
              title
            </div>
            <div className="transaction-block">
              last update
            </div>
            <div className="transaction-block">
              actions
            </div>
          </div>
          <div className="transactions-list-inner">
            {[1, 2, 3].map((element, index) => {
              return <Transaction key={index} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Transactions;
