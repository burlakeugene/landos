import React, { Component } from 'react';
import Items from './components/Items';
import { getItems } from 'actions/Items';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import Emitter from 'core/emitter';
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: false,
    };
    this.getItems = this.getItems.bind(this);
  }
  getItems() {
    loaderOn();
    getItems().then((resp) => {
      loaderOff();
      this.setState({
        items: resp,
      });
    });
  }
  componentDidMount() {
    this.getItems();
    Emitter.on('listReload', this.getItems);
  }
  componentWillUnmount() {
    Emitter.off('listReload', this.getItems);
  }
  render() {
    let { items } = this.state,
      { buttons } = this.props;
    return (
      <div>
        <Items items={items} />
      </div>
    );
  }
}

export default List;
