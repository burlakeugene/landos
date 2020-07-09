import React, { Component } from 'react';
import './styles/styles.scss';

export default class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      step: props.step || false,
      readOnly: props.readOnly || false,
      disabled: props.disabled || false,
      placeholder: props.placeholder || ''
    };
    if (props.hasOwnProperty('min')) this.state.min = parseFloat(props.min);
    if (props.hasOwnProperty('max')) this.state.max = parseFloat(props.max);
    this.buttonOff = this.buttonOff.bind(this);
    this.inc = this.inc.bind(this);
    this.dec = this.dec.bind(this);
    this.change = this.change.bind(this);
    this.blur = this.blur.bind(this);
    this.focus = this.focus.bind(this);
    this.changed = this.changed.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    let min = parseFloat(props.min);
    let max = parseFloat(props.max);
    if (
      state.disabled !== props.disabled ||
      state.placeholder !== props.placeholder ||
      state.step !== props.step ||
      (min && min !== state.min) ||
      (max && max !== state.max) ||
      state.readOnly !== props.readOnly
    ) {
      let obj = {
        disabled: props.disabled,
        placeholder: props.placeholder,
        step: props.step,
        readOnly: props.readOnly
      };
      if (min && min !== state.min) {
        obj.min = min;
      }
      if (max && max !== state.max) {
        obj.max = max;
      }
      return obj;
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.buttonOff);
    document.addEventListener('touchend', this.buttonOff);
  }
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.buttonOff);
    document.removeEventListener('touchend', this.buttonOff);
  }

  setStep(step) {
    this.setState({
      step
    });
  }

  getValue() {
    return this.state.value;
  }

  setValue(value, callback = true) {
    this.setState(
      {
        value
      },
      () => {
        callback && this.changed();
      }
    );
  }

  changed() {
    let { min, max, value } = this.state;
    value = parseFloat(value);
    if (
      (value && this.state.hasOwnProperty('min') && value < min) ||
      (this.state.hasOwnProperty('max') && value > max)
    ) {
      if (value < min) value = min;
      if (value > max) value = max;
      this.setState(
        {
          value
        },
        () => {
          this.props.onChange && this.props.onChange(this.state, this);
        }
      );
    } else if (this.props.afterChange) {
      value = this.props.afterChange(this.state, this) || this.state.value;
      this.setState(
        {
          value
        },
        () => {
          this.props.onChange && this.props.onChange(this.state, this);
        }
      );
    } else {
      this.props.onChange && this.props.onChange(this.state, this);
    }
  }

  change(e) {
    let { value } = e.target;
    if (/^[0]\d/.test(value) || /\.\d*\./.test(value)) {
      return;
    }
    if (!/^([\d\.]*)$/.test(value)) {
      return;
    }
    this.setState({ value }, () => {
      this.changed();
    });
  }

  blur(e) {
    this.setState({
      focused: false
    })
    this.props.onBlur && this.props.onBlur(this.state, this);
  }
  focus(e){
    this.setState({
      focused: true
    })
  }

  inc() {
    if (this.props.onIncDec) {
      let result = this.props.onIncDec(this.state, this);
      if (result) {
        this.setState({ value: result }, () => {
          this.changed();
        });
        return;
      }
    }
    if (this.props.onInc) {
      let result = this.props.onInc(this.state, this);
      if (result) {
        this.setState({ value: result }, () => {
          this.changed();
        });
        return;
      }
    }
    let { value, step } = this.state,
      stepArr = step.toString().split('.'),
      digits = stepArr.length > 1 ? stepArr[stepArr.length - 1].length : 0;
    value = parseFloat(value);
    step = parseFloat(step);
    this.setState({ value: (value + step).toFixed(digits) }, () => {
      this.props.afterIncDec && this.props.afterIncDec(this.state, this);
      this.props.afterInc && this.props.afterInc(this.state, this);
      this.changed();
    });
    this.buttonPressTimer = setTimeout(() => {
      if (this.buttonPressTimer) {
        this.buttonPressInterval = setInterval(() => {
          let { value } = this.state;
          value = parseFloat(value);
          this.setState({ value: (value + step).toFixed(digits) }, () => {
            this.props.afterIncDec && this.props.afterIncDec(this.state, this);
            this.props.afterInc && this.props.afterInc(this.state, this);
            this.changed();
          });
        }, 100);
      }
    }, 500);
  }

  dec() {
    if (this.props.onIncDec) {
      let result = this.props.onIncDec(this.state, this);
      if (result) {
        this.setState({ value: result }, () => {
          this.changed();
        });
        return;
      }
    }
    if (this.props.onDec) {
      let result = this.props.onInc(this.state, this);
      if (result) {
        this.setState({ value: result }, () => {
          this.changed();
        });
        return;
      }
    }
    let { value, step, min } = this.state,
      stepArr = step.toString().split('.'),
      digits = stepArr.length > 1 ? stepArr[stepArr.length - 1].length : 0;
    value = parseFloat(value);
    step = parseFloat(step);
    min = parseFloat(min);
    if (
      value.toFixed(digits) - step >=
      (this.state.hasOwnProperty('min') ? min : step)
    ) {
      this.setState({ value: (value - step).toFixed(digits) }, () => {
        this.props.afterIncDec && this.props.afterIncDec(this.state, this);
        this.props.afterDec && this.props.afterDec(this.state, this);
        this.changed();
      });
      this.buttonPressTimer = setTimeout(() => {
        if (this.buttonPressTimer) {
          this.buttonPressInterval = setInterval(() => {
            if (this.buttonPressInterval) {
              let { value } = this.state;
              value = parseFloat(value);
              if (value.toFixed(digits) - step >= step) {
                this.setState({ value: (value - step).toFixed(digits) }, () => {
                  this.props.afterIncDec &&
                    this.props.afterIncDec(this.state, this);
                  this.props.afterDec && this.props.afterDec(this.state, this);
                  this.changed();
                });
              }
            }
          }, 100);
        }
      }, 500);
    }
  }

  buttonOff() {
    this.buttonPressTimer = clearTimeout(this.buttonPressTimer);
    this.buttonPressInterval = clearInterval(this.buttonPressInterval);
    this.forceUpdate();
  }

  render() {
    let { value, step, disabled, placeholder, min, max, readOnly, focused } = this.state;
    return (
      <div
        className={[
          'field',
          step ? 'field__with-steps' : '',
          disabled ? 'field__disabled' : ''
        ].join(' ')}
      >
        {step ? (
          <button
            className="field-dec"
            onMouseDown={this.dec}
            onTouchStart={this.dec}
            onMouseUp={this.buttonOff}
            onTouchEnd={this.buttonOff}
            disabled={
              disabled || (!this.buttonPressTimer && min && min >= value)
            }
          />
        ) : null}

        <div className="field-value">
          <input
            type="text"
            onChange={this.change}
            onBlur={this.blur}
            onFocus={this.focus}
            value={value}
            readOnly={readOnly}
            disabled={disabled}
            placeholder={focused ? '' : placeholder}
          />
        </div>
        {step ? (
          <button
            className="field-inc"
            onMouseDown={this.inc}
            onTouchStart={this.inc}
            onMouseUp={this.buttonOff}
            onTouchEnd={this.buttonOff}
            disabled={
              disabled || (!this.buttonPressTimer && max && max <= value)
            }
          />
        ) : null}
      </div>
    );
  }
}
