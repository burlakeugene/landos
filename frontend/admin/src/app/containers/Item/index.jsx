import React, { Component } from 'react';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import { getItem, findAndClear } from 'actions/Items';
import Button from 'components/Button';
import {
  setRemovingItem,
  saveItem,
  uploadImage,
  generateUniqSection,
  generateUniqModal,
} from 'actions/Items';
import history from 'core/history';
import Modal from 'burlak-react-modal';
import { getSectionsStructure, getItemDefault } from 'core/structures';
import { getSectionImage } from './previews';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import ContentEditable from 'components/ContentEditable';
import { getSiteUrl } from 'modules/app';
import { loaderChange } from 'actions/Preloader';
import ContentEditor from 'components/ContentEditor';
import Field from 'components/Field';
import './styles/styles.scss';

let rerenderKey = 0;

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      newSectionIndex: false,
      id: props.match.params.id,
      errors: {},
      loadings: {},
      opened: {},
      tabs: {
        list: [
          {
            name: 'sections',
            text: 'Sections',
          },
          {
            name: 'modules',
            text: 'Modules',
          },
          {
            name: 'modals',
            text: 'Modals',
          },
          {
            name: 'forms',
            text: 'Forms',
          },
        ],
        current: 'sections',
      },
    };
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
    this.addSection = this.addSection.bind(this);
    this.addModal = this.addModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.changeItemField = this.changeItemField.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.removeSection = this.removeSection.bind(this);
    this.toggleFields = this.toggleFields.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
  }
  toggleFields(nameUniq) {
    let { opened } = this.state;
    if (opened[nameUniq]) {
      delete opened[nameUniq];
    } else {
      opened[nameUniq] = true;
    }
    this.setState({
      opened,
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
  addSection(name) {
    let { newSectionIndex, item } = this.state,
      section = generateUniqSection(name);
    if (!section) return;
    item.data.sections.splice(newSectionIndex, 0, section);
    this.setState({
      item,
      newSectionIndex: false,
    });
  }
  changeTitle(type, value, index) {
    let { item } = this.state;
    item.data[type][index].title = value;
    this.setState({
      item,
    });
  }
  addModal(index) {
    let { item } = this.state,
      modal = generateUniqModal();
    if (!index) {
      index = item.data.modals.length;
    }
    item.data.modals.splice(index, 0, modal);
    this.setState({
      item,
    });
  }
  removeModal(index) {
    let { item } = this.state;
    item.data.modals.splice(index, 1);
    this.setState({
      item,
    });
  }
  componentDidMount() {
    let { id } = this.state;
    loaderChange(true);
    getItem(id).then((resp) => {
      loaderChange(false);
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
  setRecField(value, name, fields) {
    for (let field in fields) {
      if (fields[field]['name'] === name) fields[field].value = value;
      if (fields[field].fields)
        fields[field].fields = this.setRecField(
          value,
          name,
          fields[field].fields
        );
    }
    return fields;
  }
  changeItemField(value, field) {
    if (field.onChange) {
      field.onChange(value);
      return;
    }
    let { item } = this.state;
    let parentIndex = item.data[field.parentType].findIndex((parent) => {
      return parent.nameUniq === field.parentNameUniq;
    });
    if (parentIndex < 0) return;
    let fields = item.data[field.parentType][parentIndex].fields;
    item.data[field.parentType][parentIndex].fields = this.setRecField(
      value,
      field.name,
      item.data[field.parentType][parentIndex].fields
    );
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
  setLoading(nameUniq, value) {
    let { loadings } = this.state;
    if (value) {
      loadings[nameUniq] = true;
    } else {
      delete loadings[nameUniq];
    }
    this.setState({
      loadings,
    });
  }
  getFieldNameUniq = (field) => {
    return field.parentNameUniq + field.mixinName + '_' + field.name;
  };
  setError(nameUniq, value) {
    let { errors } = this.state;
    if (value) {
      errors[nameUniq] = value;
    } else {
      delete errors[nameUniq];
    }
    this.setState({
      errors,
    });
  }
  buildFields(field) {
    return field.fields
      ? field.fields.map((field, index) => {
          return this.switchField(field);
        })
      : null;
  }
  buildDeliver(field) {
    return <div></div>;
  }
  buildText(field) {
    return (
      <div className="spotter-panel-item-field-control">
        <input
          type="text"
          value={field.value}
          onChange={(e) => {
            this.changeItemField(e.target.value, field);
          }}
        />
      </div>
    );
  }
  buildFile(field) {
    let { loadings } = this.state,
      isLoading = loadings[this.getFieldNameUniq(field)],
      preview = field?.value?.large || field?.value?.full || false;
    return (
      <>
        <div
          className={[
            'spotter-panel-item-field-control',
            !preview ? 'spotter-panel-item-field-control__empty' : '',
          ].join(' ')}
        >
          <div className="spotter-panel-item-field-control-loader"></div>
          <button
            className={[
              'spotter-panel-item-field-control-clear',
              preview && !isLoading
                ? 'spotter-panel-item-field-control-clear__show'
                : '',
            ].join(' ')}
            onClick={(e) => {
              this.changeItemField('', field);
            }}
          ></button>
          <label htmlFor={this.getFieldNameUniq(field)}>
            {preview && (
              <img
                src={getSiteUrl() + preview}
                onError={(event) => {
                  event.target.src =
                    'data:image/png;base64,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';
                }}
              />
            )}
          </label>
        </div>
        <input
          disabled={isLoading}
          type={field.type}
          name={field.name}
          id={this.getFieldNameUniq(field)}
          onChange={(event) => {
            let { values } = this.state;
            let file = event.target.files[0],
              { fileTypes = [] } = field,
              fileResult = {};
            if (!file) return;
            new Promise((resolve, reject) => {
              this.setLoading(this.getFieldNameUniq(field), true);
              this.setError(this.getFieldNameUniq(field), false);
              if (fileTypes.length && fileTypes.indexOf(file.type) < 0) {
                event.target.value = '';
                reject(fileTypes.join(', ') + ' types only');
              }
              let reader = new FileReader();
              reader.readAsBinaryString(file);
              reader.onload = function () {
                let base64 = btoa(reader.result);
                fileResult = {
                  name: file.name,
                  data: 'data:' + file.type + ';base64,' + base64,
                  type: file.type,
                  size: file.size,
                };
                resolve(fileResult);
              };
            })
              .then((resp) => {
                uploadImage(resp)
                  .then((resp) => {
                    this.changeItemField(resp, field);
                    this.setLoading(this.getFieldNameUniq(field), false);
                  })
                  .catch((error) => {});
              })
              .catch((error) => {
                this.setLoading(this.getFieldNameUniq(field), false);
                this.setError(this.getFieldNameUniq(field), error);
              });
          }}
        />
      </>
    );
  }
  buildSwitch(field) {
    return (
      <div className={'spotter-panel-item-field-control'}>
        {field.options &&
          field.options.map((option, index) => {
            return (
              <button
                key={index}
                className={[
                  'spotter-panel-item-field-control-option',
                  field.value === option.value
                    ? 'spotter-panel-item-field-control-option__active'
                    : '',
                ].join(' ')}
                onClick={() => {
                  this.changeItemField(option.value, field);
                }}
              >
                {option.text}
              </button>
            );
          })}
      </div>
    );
  }
  buildTextarea(field) {
    return (
      <div
        className={[
          'spotter-panel-item-field-control',
          field.html
            ? 'spotter-panel-item-field-control__textarea-html'
            : 'spotter-panel-item-field-control__textarea',
        ].join(' ')}
      >
        {field.html ? (
          <ContentEditor
            value={field.value}
            onChange={(value) => {
              this.changeItemField(value, field);
            }}
          />
        ) : (
          <textarea
            onChange={(event) => {
              this.changeItemField(event.target.value, field);
            }}
          >
            {field.value}
          </textarea>
        )}
      </div>
    );
  }
  buildSelect(field) {
    let options = field.options;
    if (options === 'sections') {
      options = [];
      let { item } = this.state,
        { sections } = item.data;
      sections.forEach((section) => {
        if (section.nameUniq !== field.parentNameUniq)
          options.push({
            value: section.nameUniq,
            text: section.title + ' (' + section.nameUniq + ')',
          });
      });
    }
    if (options === 'modals') {
      options = [];
      let { item } = this.state,
        { modals } = item.data;
      modals.forEach((modal) => {
        options.push({
          value: modal.nameUniq,
          text: modal.title + ' (' + modal.nameUniq + ')',
        });
      });
    }
    if (options === 'forms') {
      options = [];
    }
    return (
      <div className={['spotter-panel-item-field-control'].join(' ')}>
        <select
          value={field.value}
          onChange={(event) => {
            this.changeItemField(event.target.value, field);
          }}
        >
          <option></option>
          {options &&
            options.map((option, index) => {
              return (
                <option
                  disabled={option.disabled}
                  key={index}
                  value={option.value}
                >
                  {option.text}
                </option>
              );
            })}
        </select>
      </div>
    );
  }
  buildBool(field) {
    return (
      <div className={['spotter-panel-item-field-control'].join(' ')}>
        <div className="spotter-panel-item-field-control-checkbox">
          <label>
            <input
              type="checkbox"
              name={field.name}
              checked={field.value}
              onChange={(event) => {
                this.changeItemField(event.target.checked, field);
              }}
            />
            <div className="spotter-panel-item-field-control-checkbox-inner">
              <div className="spotter-panel-item-field-control-checkbox-point"></div>
              {field.text && field.text}
            </div>
          </label>
        </div>
      </div>
    );
  }
  removeRepeater(field, targetIndex) {
    let { value } = field;
    value = value.filter((item, index) => {
      return index !== targetIndex;
    });
    this.changeItemField(value, field);
  }
  addRepeater(field, index) {
    let { value, structure } = field,
      newField = {};
    if (!index && index !== 0) index = value.length + 1;
    Object.keys(structure).forEach((name) => {
      newField[name] = '';
    });
    value.splice(index, 0, newField);
    this.changeItemField(value, field);
  }
  repeaterChange(value, field, index, name) {
    field.value[index][name] = value;
    this.changeItemField(field.value, field);
  }
  moveRepeater(field, index, to) {
    let nextIndex = index + to;
    if (nextIndex < 0) {
      nextIndex = field.value.length - 1;
    } else if (nextIndex > field.value.length - 1) {
      nextIndex = 0;
    }
    let [removed] = field.value.splice(index, 1);
    field.value.splice(nextIndex, 0, removed);
    this.changeItemField(field.value, field);
  }
  buildRepeater(field) {
    return (
      <div className={['spotter-panel-item-field-control'].join(' ')}>
        <div className="spotter-panel-item-field-control-repeaters">
          {field.value.map((fields, index) => {
            return (
              <div
                className="spotter-panel-item-field-control-repeater"
                key={index}
              >
                {!index && (
                  <button
                    onClick={() => {
                      this.addRepeater(field, index);
                    }}
                    className="spotter-panel-item-field-control-repeater-append spotter-panel-item-field-control-repeater-append__before"
                  ></button>
                )}
                <button
                  onClick={() => {
                    this.addRepeater(field, index + 1);
                  }}
                  className="spotter-panel-item-field-control-repeater-append spotter-panel-item-field-control-repeater-append__after"
                ></button>
                <div className="spotter-panel-item-field-control-repeater-controls">
                  <button
                    className="spotter-panel-item-field-control-repeater-control spotter-panel-item-field-control-repeater-control__up"
                    onClick={() => {
                      this.moveRepeater(field, index, -1);
                    }}
                  ></button>
                  <button
                    className="spotter-panel-item-field-control-repeater-control spotter-panel-item-field-control-repeater-control__remove"
                    onClick={() => {
                      this.removeRepeater(field, index);
                    }}
                  ></button>
                  <button
                    className="spotter-panel-item-field-control-repeater-control spotter-panel-item-field-control-repeater-control__down"
                    onClick={() => {
                      this.moveRepeater(field, index, 1);
                    }}
                  ></button>
                </div>
                {Object.keys(field.structure).map((name) => {
                  let item = JSON.parse(JSON.stringify(field.structure[name]));
                  item.parentNameUniq = field.parentNameUniq;
                  item.parentType = field.parentType;
                  item.mixinName = name + '_' + index;
                  item.name = name;
                  item.value = fields[name];
                  item.onChange = (value) => {
                    this.repeaterChange(value, field, index, name);
                  };
                  if (item.rowShowConditions) {
                    let render = true;
                    for (let index in item.rowShowConditions) {
                      let condition = item.rowShowConditions[index];
                      if (fields.hasOwnProperty(condition.target)) {
                        if (condition.type === 'equal') {
                          if (fields[condition.target] !== condition.value)
                            render = false;
                        }
                      }
                      if (!render) break;
                    }
                    if (!render) return null;
                  }
                  return this.switchField(item);
                })}
              </div>
            );
          })}
        </div>
        <button
          className="spotter-panel-item-field-control-repeater-add"
          onClick={() => {
            this.addRepeater(field);
          }}
        >
          Add
        </button>
      </div>
    );
  }
  buildNumber(field) {
    return (
      <div className={['spotter-panel-item-field-control'].join(' ')}>
        <Field
          value={field.value}
          step={field.step || 1}
          onChange={(state, scope) => {
            this.changeItemField(state.value, field);
          }}
          onIncDec={(state) => {
            if (!state.value || !parseFloat(state.value)) {
              return 1;
            }
          }}
        />
      </div>
    );
  }
  switchField(field) {
    let { loadings, errors, item } = this.state,
      isLoading = loadings[this.getFieldNameUniq(field)],
      error = errors[this.getFieldNameUniq(field)];
    if (field.showConditions) {
      let render = true;
      for (let index in field.showConditions) {
        let condition = field.showConditions[index],
          parent = findAndClear(field.parentNameUniq, item, field.parentType);
        if (parent?.fields && parent.fields.hasOwnProperty(condition.target)) {
          if (condition.type === 'equal') {
            if (parent.fields[condition.target] !== condition.value)
              render = false;
          }
        }
        if (!render) break;
      }
      if (!render) return null;
    }
    return (
      <div
        key={field.index}
        style={{
          maxWidth: field.maxWidth ? field.maxWidth + 'px' : '100%',
        }}
        className={[
          'spotter-panel-item-field',
          'spotter-panel-item-field__' + field.type,
          field.width ? 'spotter-panel-item-field__' + field.width : '',
          isLoading ? 'spotter-panel-item-field__loading' : '',
        ].join(' ')}
      >
        {field.label && (
          <div className="spotter-panel-item-field-label">{field.label}</div>
        )}
        {(() => {
          switch (field.type) {
            case 'text':
              return this.buildText(field);
              break;
            case 'fields':
              return this.buildFields(field);
              break;
            case 'switch':
              return this.buildSwitch(field);
              break;
            case 'select':
              return this.buildSelect(field);
              break;
            case 'textarea':
              return this.buildTextarea(field);
              break;
            case 'file':
              return this.buildFile(field);
              break;
            case 'deliver':
              return this.buildDeliver(field);
              break;
            case 'bool':
              return this.buildBool(field);
              break;
            case 'number':
              return this.buildNumber(field);
              break;
            case 'repeater':
              return this.buildRepeater(field);
              break;
            default:
              return null;
          }
        })()}
        {error && <div className="spotter-panel-item-field-error">{error}</div>}
      </div>
    );
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
  onDragEnd(result, type) {
    let { item } = this.state;
    if (!result.destination) {
      return;
    }
    item.data[type] = this.reOrder(
      item.data[type],
      result.source.index,
      result.destination.index
    );
    ++rerenderKey;
    this.setState({
      item,
    });
  }
  changeTab(name) {
    let { tabs } = this.state;
    if (name === tabs.current) return;
    tabs.current = name;
    this.setState({
      tabs,
    });
  }
  render() {
    this.titles = [];
    let { item, id, newSectionIndex, opened, tabs } = this.state,
      { title = '', data = false } = item;
    if (!data) return null;
    let itemsType = tabs.current,
      items = data[itemsType];
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
          <div className="spotter-panel-choose">
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
                      className="spotter-panel-choose-item"
                      onClick={() => {
                        this.addSection(section.name);
                      }}
                    >
                      <div className="spotter-panel-choose-item-image">
                        <img src={getSectionImage(section.name)} />
                      </div>
                      <div className="spotter-panel-choose-item-title">
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
        <div className="spotter-tabs">
          {tabs.list.map((tab, index) => {
            return (
              <button
                key={index}
                className={[
                  'spotter-tab',
                  tab.name === tabs.current ? 'spotter-tab__active' : '',
                ].join(' ')}
                onClick={() => {
                  this.changeTab(tab.name);
                }}
              >
                {tab.text}
              </button>
            );
          })}
        </div>
        {items && items.length ? (
          <DragDropContext
            onDragEnd={(result) => {
              this.onDragEnd(result, tabs.current);
            }}
          >
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className="spotter-panel">
                  {items.map((item, index) => {
                    return (
                      <Draggable
                        key={index}
                        draggableId={'' + index}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="spotter-panel-item"
                          >
                            <button
                              className="spotter-panel-item-add spotter-panel-item-add__top"
                              onClick={() => {
                                if (itemsType === 'sections')
                                  this.openModal(index);
                                if (itemsType === 'modals')
                                  this.addModal(index);
                              }}
                            ></button>
                            <div
                              key={'item-' + index + rerenderKey}
                              className="spotter-panel-item-inner"
                              onClick={() => {
                                this.toggleFields(item.nameUniq);
                                let titles = this.titles;
                                titles &&
                                  titles.forEach((title) => {
                                    title && title.blur();
                                  });
                              }}
                            >
                              <div className="spotter-panel-item-header">
                                <div className="spotter-panel-item-header-title">
                                  <ContentEditable
                                    key={item.nameUniq}
                                    html={item.title}
                                    ref={(node) => {
                                      this['title' + index] = node;
                                      this.titles.push(this['title' + index]);
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    onChange={(e) => {
                                      this.changeTitle(
                                        tabs.current,
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                  <button
                                    className="spotter-panel-item-header-title-edit"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this['title' + index].focus();
                                    }}
                                  >
                                    <Icon type="edit" />
                                  </button>
                                </div>
                                <div className="spotter-panel-item-header-actions">
                                  <button
                                    className="spotter-panel-item-header-action spotter-panel-item-header-action__remove"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (itemsType === 'sections')
                                        this.removeSection(index);
                                      if (itemsType === 'modals')
                                        this.removeModal(index);
                                    }}
                                  >
                                    <Icon type={'remove'} />
                                  </button>
                                  <button
                                    className={[
                                      'spotter-panel-item-header-action',
                                      'spotter-panel-item-header-action__arrow',
                                      opened[item.nameUniq]
                                        ? 'spotter-panel-item-header-action__arrow__active'
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
                                  'spotter-panel-item-fields',
                                  opened[item.nameUniq]
                                    ? 'spotter-panel-item-fields__opened'
                                    : '',
                                ].join(' ')}
                              >
                                <div className="spotter-panel-item-fields-inner">
                                  {item.fields &&
                                    item.fields.map((field) => {
                                      return this.switchField(field);
                                    })}
                                </div>
                              </div>
                            </div>
                            <button
                              className="spotter-panel-item-add spotter-panel-item-add__bottom"
                              onClick={() => {
                                if (itemsType === 'sections')
                                  this.openModal(index + 1);
                                if (itemsType === 'modals')
                                  this.addModal(index + 1);
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
            className="spotter-panel-add"
            onClick={() => {
              if (itemsType === 'sections') this.openModal();
              if (itemsType === 'modals') this.addModal();
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
