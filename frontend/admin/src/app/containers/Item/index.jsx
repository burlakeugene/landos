import React, { Component } from 'react';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import { getItem } from 'actions/Items';
import Button from 'components/Button';
import { setRemovingItem, saveItem } from 'actions/Items';
import Sections from './components/Sections';
import { getItemStructure } from 'core/structures';
import history from 'core/history';
import './styles/styles.scss';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      id: props.match.params.id,
    };
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
    this.setField = this.setField.bind(this);
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
      let obj = getItemStructure();
      if (resp) obj = resp;
      this.setState({
        item: obj,
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
  setField(name, value) {
    let { item } = this.state;
    item[name] = value;
    this.setState({
      item,
    });
  }
  render() {
    let { item, id } = this.state,
      { title = '', data = false } = item;
    console.log(data);
    return (
      <div className="spotter-item">
        <div className="spotter-item-title">
          <button
            className="spotter-item-title-back"
            onClick={() => {
              history.goBack();
            }}
          ></button>
          <input
            type="text"
            onChange={(e) => {
              this.changeField(e, 'title');
            }}
            value={title}
          />
        </div>
        {data && (
          <Sections
            data={data}
            onChange={(data) => {
              this.setField('data', data);
            }}
          />
        )}

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
