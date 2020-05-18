import React, { Component } from 'react';
import Modal from 'burlak-react-modal';
import { getSectionsStructure } from 'core/structures';
import { getSectionImage } from '../../previews';
import './styles/styles.scss';

class Sections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      newSection: false,
    };
    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addSection = this.addSection.bind(this);
  }
  onChange() {
    let { data } = this.state;
    this.props.onChange && this.props.onChange(data);
  }
  openModal(index = 0) {
    index = index < 0 ? 0 : index;
    this.setState({
      newSection: index,
    });
  }
  closeModal() {
    this.setState({
      newSection: false,
    });
  }
  addSection(section) {
    let { newSection, data } = this.state;
    data.sections.splice(newSection, 0, section);
    this.setState({
      data,
      newSection: false,
    });
  }
  render() {
    let { data, newSection } = this.state;
    console.log(data);
    return (
      <>
        <Modal
          opened={newSection !== false}
          onHide={this.closeModal}
          title={'Add new section'}
          centered
          maxWidth={500}
        >
          <div className="spotter-sections-choose">
            {(() => {
              let sectionsList = getSectionsStructure();
              console.log(sectionsList);
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
        <div className="spotter-sections">
          {data.sections && data.sections.length ? (
            data.sections.map((section, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    this.openModal(index);
                  }}
                >
                  {section.name}
                </div>
              );
            })
          ) : (
            <div
              className="spotter-sections-add"
              onClick={() => {
                this.openModal(0);
              }}
            ></div>
          )}
        </div>
      </>
    );
  }
}

export default Sections;
