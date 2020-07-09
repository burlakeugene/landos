import React, { Component } from 'react';
import { getSections, saveSection, generateUniqSection } from 'actions/Sections';
import { getSectionsStructure } from 'core/structures';
import { getSectionImage } from 'core/previews';
import Modal from 'burlak-react-modal';
import 'common/styles/items.scss';
class Sections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      newSectionIndex: false,
    };
    this.addNew = this.addNew.bind(this);
    this.addItem = this.addItem.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  componentDidMount() {
    getSections().then((list) => {
      this.setState({
        list,
      });
    });
  }
  addNew(index) {
    this.openModal(index);
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
  addItem(name) {
    let { newSectionIndex, list } = this.state,
      section = generateUniqSection(name);
    if (!section) return;
    list.splice(newSectionIndex, 0, section);
    this.setState({
      list,
      newSectionIndex: false,
    }, () => {
      saveSection(section)
    });
  }
  render() {
    let { list, newSectionIndex } = this.state;
    return (
      <>
        <Modal
          opened={newSectionIndex !== false}
          onHide={this.closeModal}
          title={'Add new section'}
          centered
          maxWidth={500}
        >
          <div className="spotter-list-choose">
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
                      className="spotter-list-choose-item"
                      onClick={() => {
                        this.addItem(section.name);
                      }}
                    >
                      <div className="spotter-list-choose-item-image">
                        <img src={getSectionImage(section.name)} />
                      </div>
                      <div className="spotter-list-choose-item-title">
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
        <div className="spotter-list">
          {list.length ? (
            list.map((item, index) => {
              return item.title;
            })
          ) : (
            <div className="spotter-list-add" onClick={this.addNew}></div>
          )}
        </div>
      </>
    );
  }
}

export default Sections;
