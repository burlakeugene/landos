import React, { Component } from 'react';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import { getItem } from 'actions/Items';
import Button from 'components/Button';
import { setRemovingItem, saveItem } from 'actions/Items';
class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      id: props.match.params.id,
    };
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
  }
  save() {
    let { item } = this.state;
    saveItem(item);
  }
  remove() {
    let { id } = this.state;
    setRemovingItem(id);
  }
  componentDidMount() {
    let { id } = this.state;
    loaderOn();
    getItem(id).then((resp) => {
      loaderOff();
      if (!resp) return;
      this.setState({
        item: resp,
      });
    });
  }
  getField(name) {
    let { item } = this.state,
      result = '';
    if (item[name]) result = item[name];
    return result;
  }
  changeField(e, name) {
    let { item } = this.state;
    item[name] = e.target.value;
    this.setState({
      item,
    });
  }
  render() {
    let { item, id } = this.state;
    return (
      <div className="spotter-item">
        <input
          type="text"
          onChange={(e) => {
            this.changeField(e, 'title');
          }}
          value={this.getField('title')}
        />
        <textarea
          type="text"
          onChange={(e) => {
            this.changeField(e, 'data');
          }}
          value={this.getField('data')}
        />
        <div className="spotter-item-buttons">
          <Button
            type={'success'}
            onClick={this.save}
            text={id ? 'Save' : 'Add'}
          />
          {id && (
            <Button type={'error'} onClick={this.remove} text={'Remove'} />
          )}
        </div>
      </div>
    );
  }
}

export default Item;
