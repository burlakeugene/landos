import React, { Component } from 'react';
import Button from 'components/Button';
import { setRemovingItem } from 'actions/Items';

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      dragging: false,
    };
    this.mouseMove = this.mouseMove.bind(this);
    this.dragOn = this.dragOn.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps;
  }
  dragOn(e, dragging) {
    dragging.target = e.target.closest('.spotter-list-item');
    console.log(dragging);
    this.setState({
      dragging,
    });
  }
  mouseUp(e) {
    this.setState({
      dragging: false,
    });
  }
  mouseMove(e) {
    let { dragging } = this.state;
    if (!dragging) return;
    console.log(e);
  }
  componentDidMount() {
    document.addEventListener('mouseup', this.mouseUp);
    document.addEventListener('mousemove', this.mouseMove);
  }
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.mouseUp);
    document.removeEventListener('mousemove', this.mouseMove);
  }
  render() {
    let { items } = this.state;
    return (
      <div className="spotter-list">
        {items &&
          (items.length ? (
            items.map((item) => {
              return (
                <div
                  className="spotter-list-item"
                  onMouseDown={(e) => {
                    this.dragOn(e, item);
                  }}
                >
                  {item.title} <Button to={'/item/' + item.id} text="Edit" />{' '}
                  <Button
                    onClick={() => {
                      setRemovingItem(item.id);
                    }}
                    type="error"
                    text="Delete"
                  />
                </div>
              );
            })
          ) : (
            <div>No one, yet</div>
          ))}
      </div>
    );
  }
}

export default Items;
