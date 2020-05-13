import React, { Component } from 'react';
import Button from 'components/Button';
import { setRemovingItem } from 'actions/Items';
import './styles/styles.scss';
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
    dragging.startX = e.clientX;
    dragging.startY = e.clientY;
    dragging.target = e.target.closest('.spotter-list-item');
    dragging.cloneNode = dragging.target.cloneNode(true);
    dragging.cloneNode.classList.add('spotter-list-item__dragged');
    let parent = dragging.target.closest('.spotter-list');
    dragging.cloneNode.style.top = dragging.target.offsetTop + 'px';
    dragging.startTop = dragging.target.offsetTop;
    dragging.cloneNode.style.left = 0;
    parent.appendChild(dragging.cloneNode);
    dragging.target.style.opacity = 0;
    dragging.target.style.height =
      dragging.target.querySelector('.spotter-list-item-inner').clientHeight +
      'px';
    this.setState({
      dragging,
    });
  }
  mouseUp(e) {
    let { dragging } = this.state;
    if (!dragging) return;
    let { cloneNode } = dragging;
    if (cloneNode) cloneNode.parentNode.removeChild(cloneNode);
    this.setState({
      dragging: false,
    });
  }
  mouseMove(e) {
    let { dragging } = this.state;
    if (!dragging) return;
    let x = e.clientX,
      y = e.clientY,
      target = e.target.closest('.spotter-list-item');
    if (!target) return;
    let parent = target.closest('.spotter-list');
    let top = dragging.startTop + y - dragging.startY;
    if (top < 0) top = 0;
    if (top > parent.clientHeight - dragging.cloneNode.clientHeight)
      top = parent.clientHeight - dragging.cloneNode.clientHeight;
    dragging.cloneNode.style.top = top + 'px';
    parent.querySelectorAll('.spotter-list-item').forEach((item, index) => {
      if (item !== target) {
        setTimeout(() => {
          item.style.paddingTop = 0;
          item.style.paddingBottom = 0;
        }, 0);
      }
    });
    if (target !== dragging.target) {
      dragging.target.style.height = '0px';
      setTimeout(() => {
        dragging.target.style.display = 'none';
      }, 300);
      let draggedHalf = top + dragging.cloneNode.clientHeight / 2,
        targetHalf = target.offsetTop + target.clientHeight / 2,
        draggedHeight = dragging.target.querySelector(
          '.spotter-list-item-inner'
        ).clientHeight;
      if (draggedHalf > targetHalf) {
        target.style.paddingTop = 0;
        target.style.paddingBottom = draggedHeight + 'px';
      }
      if (draggedHalf <= targetHalf) {
        target.style.paddingBottom = 0;
        target.style.paddingTop = draggedHeight + 'px';
      }
      // if(draggedHalf >= (targetHalf - draggedHeight) * 2 || draggedHalf <= (targetHalf - draggedHeight) * 2)
    }
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
            items.map((item, index) => {
              return (
                <div
                  key={index}
                  className="spotter-list-item"
                  data-order={item.order}
                  data-id={item.id}
                >
                  <div className="spotter-list-item-inner">
                    <div
                      className="spotter-list-item-dragger"
                      onMouseDown={(e) => {
                        this.dragOn(e, item);
                      }}
                    >
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
