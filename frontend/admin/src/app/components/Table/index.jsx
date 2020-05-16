import React, { Component } from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import './styles/styles.scss';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: props.structure,
      items: props.items || false,
      emptyText: props.emptyText || 'Still empty',
      className: props.className || '',
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.reOrder = this.reOrder.bind(this);
  }
  reOrder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  onDragEnd(result) {
    let { items } = this.state;
    if (!result.destination) {
      return;
    }
    items = this.reOrder(items, result.source.index, result.destination.index);
    this.props.onDragEnd && this.props.onDragEnd(items);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let obj = {
      items: nextProps.items,
      structure: nextProps.structure,
    };
    if (nextProps.className !== prevState.className) {
      obj.className = nextProps.className;
    }
    return obj;
  }
  render() {
    let { items, structure, title, emptyText, className } = this.state,
      { onDragEnd, overLabels } = this.props;
    if (!structure) return null;
    return (
      <div
        className={[
          'spotter-table',
          className,
          overLabels ? 'spotter-table__over-labels' : '',
        ].join(' ')}
      >
        <div className="spotter-table-rows">
          <div className="spotter-table-row spotter-table-row__header">
            <div className="spotter-table-row-inner">
              {structure.map((item, index) => {
                return (
                  <div
                    key={'head-' + index}
                    className={['spotter-table-col', item.className].join(' ')}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className="spotter-table-items">
                  {items &&
                    (items.length ? (
                      items.map((item, itemIndex) => (
                        <Draggable
                          isDragDisabled={!onDragEnd}
                          key={'row-' + item.id}
                          draggableId={item.id}
                          index={itemIndex}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="spotter-table-row">
                                <div className="spotter-table-row-inner">
                                  {structure.map(
                                    (structureItem, structureIndex) => {
                                      return (
                                        <div
                                          key={'col-' + structureIndex}
                                          className={[
                                            'spotter-table-col',
                                            item.className,
                                          ].join(' ')}
                                        >
                                          {structureItem.content
                                            ? structureItem.content(item)
                                            : item[structureItem.name] || ''}
                                          {structureItem.buttons &&
                                            structureItem.buttons.length && (
                                              <div className="spotter-table-buttons">
                                                {structureItem.buttons.map(
                                                  (button, buttonIndex) => {
                                                    return (
                                                      <button
                                                        key={
                                                          'button-' +
                                                          buttonIndex
                                                        }
                                                        className={[
                                                          'spotter-table-button',
                                                          button.type
                                                            ? 'spotter-table-button__' +
                                                              button.type
                                                            : '',
                                                        ].join(' ')}
                                                        onClick={() => {
                                                          button.onClick &&
                                                            button.onClick(
                                                              item
                                                            );
                                                        }}
                                                      >
                                                        <Icon type={button.type} />
                                                      </button>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="spotter-table-empty">{emptyText}</div>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }
}

export default Table;
