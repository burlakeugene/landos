import React, { Component } from 'react';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import { getItem } from 'actions/Items';
import Button from 'components/Button';
import { setRemovingItem, saveItem, uploadImage } from 'actions/Items';
import history from 'core/history';
import Modal from 'burlak-react-modal';
import { getSectionsStructure, getItemDefault } from 'core/structures';
import { getSectionImage } from './previews';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import ContentEditable from 'components/ContentEditable';
import './styles/styles.scss';

let sectionRerenderKey = 0;

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
    this.changeSectionTitle = this.changeSectionTitle.bind(this);
    this.removeSection = this.removeSection.bind(this);
    this.toggleFields = this.toggleFields.bind(this);
  }
  toggleFields(sectionId) {
    let { item } = this.state;
    item.data.sections[sectionId].opened = !item.data.sections[sectionId]
      .opened;
    this.setState({
      item,
    });
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
  changeSectionTitle(value, sectionIndex) {
    let { item } = this.state;
    if (!item.data.sections) return;
    item.data.sections[sectionIndex].title = value;
    this.setState({
      item,
    });
  }
  removeSection(sectionIndex) {
    let { item } = this.state;
    if (!item.data.sections) return;
    item.data.sections.splice(sectionIndex, 1);
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
  buildFile(field, index, sectionIndex) {
    return (
      <div
        className={[
          'spotter-section-field',
          'spotter-section-field__' + field.type,
        ].join(' ')}
      >
        {field?.value?.thumb && <img src={field.value.thumb} />}
        <input
          type={field.type}
          name={field.name}
          onChange={(event) => {
            let { values } = this.state;
            let filesObject = [],
              files = event.target.files;
            new Promise((resolve, reject) => {
              if (!files.length) resolve(filesObject);
              for (let i = 1; i <= files.length; i++) {
                let file = files[i - 1];
                let reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = function () {
                  let base64 = btoa(reader.result);
                  filesObject.push({
                    name: file.name,
                    data: 'data:' + file.type + ';base64,' + base64,
                    type: file.type,
                    size: file.size,
                  });
                  if (i === files.length) {
                    setTimeout(() => {
                      resolve(filesObject);
                    }, 0);
                  }
                };
              }
            }).then((resp) => {
              uploadImage(resp)
                .then((resp) => {
                  console.log(resp);
                  this.changeSectionField(resp[0], index, sectionIndex);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }}
        />
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
      case 'file':
        return this.buildFile(field, index, sectionIndex);
        break;
      case 'deliver':
        break;
      default:
        return null;
    }
  }
  save() {
    let { item } = this.state;
    item.data.sections.forEach((section, index) => {
      delete item.data.sections[index].opened;
    });
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
    ++sectionRerenderKey;
    this.setState({
      item,
    });
  }
  render() {
    this.sectionsTitles = [];
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
          <ContentEditable
            html={title}
            onChange={(e) => {
              this.changeField(e, 'title');
            }}
            ref={(node) => (this.itemTitle = node)}
          />
          <button
            className="spotter-item-title-edit"
            onClick={() => {
              this.itemTitle.focus();
            }}
          >
            <Icon type="edit" />
          </button>
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
                            <div
                              key={
                                'section-' + sectionIndex + sectionRerenderKey
                              }
                              className="spotter-section-inner"
                              onClick={() => {
                                this.toggleFields(sectionIndex);
                                let sectionTitles = this.sectionsTitles;
                                sectionTitles &&
                                  sectionTitles.forEach((section) => {
                                    section && section.blur();
                                  });
                              }}
                            >
                              <div className="spotter-section-header">
                                <div className="spotter-section-header-title">
                                  <ContentEditable
                                    html={section.title}
                                    ref={(node) => {
                                      this[
                                        'sectionTitle' + sectionIndex
                                      ] = node;
                                      this.sectionsTitles.push(
                                        this['sectionTitle' + sectionIndex]
                                      );
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    onChange={(e) => {
                                      this.changeSectionTitle(
                                        e.target.value,
                                        sectionIndex
                                      );
                                    }}
                                  />
                                  <button
                                    className="spotter-section-header-title-edit"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this[
                                        'sectionTitle' + sectionIndex
                                      ].focus();
                                    }}
                                  >
                                    <Icon type="edit" />
                                  </button>
                                </div>
                                <div className="spotter-section-header-actions">
                                  <button
                                    className="spotter-section-header-action spotter-section-header-action__remove"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.removeSection(sectionIndex);
                                    }}
                                  >
                                    <Icon type={'remove'} />
                                  </button>
                                  <button
                                    className={[
                                      'spotter-section-header-action',
                                      'spotter-section-header-action__arrow',
                                      section.opened
                                        ? 'spotter-section-header-action__arrow__active'
                                        : '',
                                    ].join(' ')}
                                  >
                                    <Icon type={'arrow_down'} />
                                  </button>
                                </div>
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className={[
                                  'spotter-section-fields',
                                  section.opened
                                    ? 'spotter-section-fields__opened'
                                    : '',
                                ].join(' ')}
                              >
                                <div className="spotter-section-fields-inner">
                                  {section.fields.map((field, index) => {
                                    return this.switchField(
                                      field,
                                      index,
                                      sectionIndex
                                    );
                                  })}
                                </div>
                              </div>
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
