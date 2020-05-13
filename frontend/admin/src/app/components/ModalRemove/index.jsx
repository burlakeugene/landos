import React, { Component } from 'react';
import Modal from 'burlak-react-modal';
import { connect } from 'react-redux';
import { setRemovingItem, removeItem } from 'actions/Items';

class ModalRemove extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { id } = this.props;
    return (
      <Modal
        opened={id}
        maxWidth={320}
        title={'Remove'}
        onHide={() => {
          setRemovingItem(false);
        }}
        buttons={[
          {
            text: 'Accept',
            type: 'success',
            onClick: (e, instance) => {
              removeItem(id).then(() => {
                instance.close();
              })
            },
          },
          {
            text: 'Cancel',
            type: 'error',
            onClick: (e, instance) => {
              instance.close();
            },
          },
        ]}
      >
        Are you sure to remove this item?
      </Modal>
    );
  }
}

ModalRemove = connect((state) => {
  return {
    id: state.removingReducer.removing.id || false,
  };
})(ModalRemove);

export default ModalRemove;
