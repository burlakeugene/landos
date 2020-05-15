import React, { Component } from 'react';
import { getItems, saveItems } from 'actions/Items';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import Emitter from 'core/emitter';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import Button from 'components/Button';
import { setRemovingItem } from 'actions/Items';
import Transactions from 'components/Transactions';
import './styles/styles.scss';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: false,
    };
    this.getItems = this.getItems.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.reOrder = this.reOrder.bind(this);
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
  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const items = this.reOrder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({
      items,
    }, () => {
      saveItems(items);
    });
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
      <div className="spotter-list">
        <Transactions />
        {items &&
          (items.length ? (
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="spotter-list-item">
                              <div className="spotter-list-item-inner">
                                <div className="spotter-list-item-dragger">
                                  <div className="spotter-list-item-dragger-inner">
                                    {item.id}
                                  </div>
                                </div>
                                <div className="spotter-list-item-content">
                                  {item.title}{' '}
                                  <Button to={'/item/' + item.id} text="Edit" />{' '}
                                  <Button
                                    onClick={() => {
                                      setRemovingItem(item.id);
                                    }}
                                    type="error"
                                    text="Delete"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div>No one, yet</div>
          ))}
      </div>
    );
  }
}

export default List;
