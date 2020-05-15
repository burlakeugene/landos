import React , {Component} from 'react';

export default class Transaction extends Component {
    render() {
        let {data} = this.props;
        return (
            <div className="transaction">
                <div className="transaction-block transaction-block__id">
                    1
                </div>
                <div className="transaction-block">
                   test
                </div>
                <div className="transaction-block">
                    time
                </div>
                <div className="transaction-block">
                    312
                </div>
            </div>
        )
    }
}