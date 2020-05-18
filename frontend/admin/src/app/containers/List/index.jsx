import React, { Component } from 'react';
import { getItems, saveItems } from 'actions/Items';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import Emitter from 'core/emitter';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import Button from 'components/Button';
import { setRemovingItem } from 'actions/Items';
import Transactions from 'components/Transactions';
import Table from 'components/Table';
import { historyPush } from 'actions/App';
import './styles/styles.scss';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: false,
    };
    this.getItems = this.getItems.bind(this);
    this.reOrder = this.reOrder.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  reOrder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    for (let i = result.length - 1; i >= 0; i--) {
      result[i].order = Math.abs(result.length - 1 - i);
    }
    return result;
  }
  onDragEnd(items) {
    for (let i = items.length - 1; i >= 0; i--) {
      items[i].order = Math.abs(items.length - 1 - i);
    }
    this.setState(
      {
        items,
      },
      () => {
        saveItems(items);
      }
    );
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
    let { items } = this.state;
    return (
      <Table
        onDragEnd={this.onDragEnd}
        className="spotter-list"
        items={items}
        structure={[
          {
            name: 'id',
            label: 'Id',
          },
          {
            name: 'title',
            label: 'Title',
          },
          {
            name: 'time',
            label: 'Last update',
            content: (data) => {
              let time =
                data.time && parseInt(data.time)
                  ? parseInt(data.time) * 1000
                  : false;
              return time
                ? new Date(time).formatting('dd.mm.yyyy hh:ii:ss')
                : '';
            },
          },
          {
            label: 'Used by',
            content: (data) => {
              return data?.usedBy?.length ? (
                <>
                  {data.usedBy.map((item, index) => (
                    <div>
                      <a href={item.link} target="_blank">
                        {item.title}
                      </a>
                    </div>
                  ))}
                </>
              ) : 'No one';
            },
          },
          {
            label: 'Actions',
            buttons: [
              {
                type: 'edit',
                onClick: (data) => {
                  historyPush('/item/' + data.id);
                },
              },
              {
                type: 'remove',
                onClick: (data) => {
                  setRemovingItem(data.id);
                },
              },
            ],
          },
        ]}
      />
    );
  }
}

export default List;
