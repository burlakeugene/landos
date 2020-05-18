import React, { Component } from 'react';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import { getItem } from 'actions/Items';
import Button from 'components/Button';
import { setRemovingItem, saveItem } from 'actions/Items';
import history from 'core/history';
import Modal from 'burlak-react-modal';
import { getSectionsStructure, getItemDefault } from 'core/structures';
import { getSectionImage } from './previews';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import './styles/styles.scss';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      newSectionIndex: false,
      id: props.match.params.id,
    };
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
    this.addSection = this.addSection.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.changeSectionField = this.changeSectionField.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  openModal(index = 0) {
    index = index < 0 ? 0 : index;
    this.setState({
      newSectionIndex: index,
    });
  }
  closeModal() {
    this.setState({
      newSectionIndex: false,
    });
  }
  addSection(section) {
    let { newSectionIndex, item } = this.state;
    item.data.sections.splice(newSectionIndex, 0, section);
    this.setState({
      item,
      newSectionIndex: false,
    });
  }
  componentDidMount() {
    let { id } = this.state;
    loaderOn();
    getItem(id).then((resp) => {
      loaderOff();
      let obj = getItemDefault();
      if (resp) obj = resp;
      this.setState({
        item: obj,
      });
    });
  }
  changeField(e, name) {
    let { item } = this.state;
    item[name] = e.target.value;
    this.setState({
      item,
    });
  }
  changeSectionField(value, fieldIndex, sectionIndex) {
    let { item } = this.state;
    if (!item.data.sections) return;
    item.data.sections[sectionIndex].fields[fieldIndex].value = value;
    this.setState({
      item,
    });
  }
  buildText(field, index, sectionIndex) {
    return (
      <div
        key={index}
        className={[
          'spotter-section-field',
          'spotter-section-field__' + field.type,
        ].join(' ')}
      >
        <label>
          <div className="spotter-section-field-label">{field.label}</div>
          <div className="spotter-section-field-control">
            <input
              type="text"
              value={field.value}
              onChange={(e) => {
                this.changeSectionField(e.target.value, index, sectionIndex);
              }}
            />
          </div>
        </label>
      </div>
    );
  }
  switchField(field, index, sectionIndex) {
    switch (field.type) {
      case 'text':
        return this.buildText(field, index, sectionIndex);
        break;
      case 'switch':
        break;
      case 'textarea':
        break;
      case 'color':
        break;
      case 'deliver':
        break;
      default:
        return null;
    }
  }
  save() {
    let { item } = this.state;
    saveItem(item);
  }
  remove() {
    let { id } = this.state;
    setRemovingItem(id);
  }
  reOrder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  onDragEnd(result) {
    let { item } = this.state,
      { sections } = item.data;
    if (!result.destination) {
      return;
    }
    sections = this.reOrder(
      sections,
      result.source.index,
      result.destination.index
    );
    item.data.sections = sections;
    this.setState({
      item,
    });
  }
  render() {
    let { item, id, newSectionIndex } = this.state,
      { title = '', data = false } = item;
    if (!data) return null;
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
        <Modal
          opened={newSectionIndex !== false}
          onHide={this.closeModal}
          title={'Add new section'}
          centered
          maxWidth={500}
        >
          <div className="spotter-sections-choose">
            {(() => {
              let sectionsList = getSectionsStructure();
              if (sectionsList?.displayedList?.length) {
                return sectionsList.displayedList.map((name, index) => {
                  let section = (sectionsList.list || []).find(
                    (item, index) => {
                      return item.name === name;
                    }
                  );
                  if (!section) return null;
                  return (
                    <div
                      key={index}
                      className="spotter-sections-choose-item"
                      onClick={() => {
                        this.addSection(section);
                      }}
                    >
                      <div className="spotter-sections-choose-item-image">
                        <img src={getSectionImage(section.name)} />
                      </div>
                      <div className="spotter-sections-choose-item-title">
                        {section.title}
                      </div>
                    </div>
                  );
                });
              } else {
                return null;
              }
            })()}
          </div>
        </Modal>
        {data.sections && data.sections.length ? (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className="spotter-sections">
                  {data.sections.map((section, sectionIndex) => {
                    return (
                      <Draggable
                        key={sectionIndex}
                        draggableId={'' + sectionIndex}
                        index={sectionIndex}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="spotter-section"
                          >
                            <button
                              className="spotter-section-add spotter-section-add__top"
                              onClick={() => {
                                this.openModal(sectionIndex);
                              }}
                            ></button>
                            <div className="spotter-section-inner">
                              {section.title}
                              {section.fields.map((field, index) => {
                                return this.switchField(
                                  field,
                                  index,
                                  sectionIndex
                                );
                              })}
                            </div>
                            <button
                              className="spotter-section-add spotter-section-add__bottom"
                              onClick={() => {
                                this.openModal(sectionIndex + 1);
                              }}
                            ></button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div
            className="spotter-sections-add"
            onClick={() => {
              this.openModal(0);
            }}
          ></div>
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
