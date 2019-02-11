import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Slider.less';
/**
 * @description Slider component.
 * Represents a Slider control with click for increase/decrease functionality and draggability.
 * @example
 <SliderControl
 label="Slider Example"
 value={this.state.sliderValue}
 simpleValue={false}
 onChange={this.handleChangeSliderValue}
 steps={[
              { value: 10, label: 'Fast', tooltip: 'Fastest, Test Feasibility' },
              { value: 223, tooltip: 'Fast, Basic Search' },
              { value: 312, label: 'Balanced', tooltip: 'Default' },
              { value: 43, tooltip: 'Slower, Expanded Search' },
              { value: 56, label: 'Detailed', tooltip: 'Slowest, Advanced Search' }
            ]}
 />
 * @class
 * @name Slider
 * @param {object} props Properties for Slider component.
 * @param {string} props.label A Label for Slider Control.
 * @param {number | object} props.value Actual value of Slider. Required.
 * @param {function} props.onChange Function to handle value change. Required.
 * @param {string} props.className Class name to extend Slider's styles.
 * @param {boolean} props.style Additional styles for Slider
 * @param {string} props.simpleValue Defines whether returned value in onChange would be an entire object or just a number value. Default - 'true'
 * @param {array} props.steps An array of objects representing steps for Slider control. Each consists of value (required), tooltip (optional) and label (optional). Required.
 */
class Slider extends Component {

  /** Handling actual index-value and thus not being depend on whether passed values are incremental and starting from 1 or not */
  static getDerivedStateFromProps(props) {
    const index = props.steps.findIndex(({ value }) => value === Slider.getProperValue(props));
    return {
      value: index > 0 ? index : 0
    };
  }

  static getProperValue({ value, simpleValue }) {
    if (simpleValue) {
      return value;
    } else {
      return typeof value === 'object' ? value.value : value;
    }
  }

  constructor(props) {
    super(props);

    this.handleDragThumb = this.handleDragThumb.bind(this);
    this.handleClickSlider = this.handleClickSlider.bind(this);
    this.handleCaptureDrag = this.handleCaptureDrag.bind(this);
    this.handleReleaseDrag = this.handleReleaseDrag.bind(this);

    this.isThumbBeingDragged = false;

    this.state = {
      value: props.steps.findIndex(({ value }) => value === Slider.getProperValue(props))
    };
  }

  getThumbDragDirection(mouseX) {
    const { left: thumbLeft, right: thumbRight } = this.thumb.getBoundingClientRect();
    const { left: sliderLeft, right: sliderRight } = this.slider.getBoundingClientRect();
    const sectionWidth = (sliderRight - sliderLeft) / (this.props.steps.length - 1);
    return {
      isMovingRight: mouseX > thumbRight + (sectionWidth / 2) && mouseX <= sliderRight,
      isMovingLeft: mouseX < thumbLeft - (sectionWidth / 2) && mouseX >= sliderLeft
    };
  }

  handleClickSlider({ clientX: mouseX }) {
    const { left: thumbLeft, right: thumbRight } = this.thumb.getBoundingClientRect();
    if (mouseX < thumbLeft - 5) {
      this.stepDown();
    } else if (mouseX > thumbRight + 5) {
      this.stepUp();
    }
  }

  handleDragThumb({ clientX: mouseX }) {
    const { isMovingRight, isMovingLeft } = this.getThumbDragDirection(mouseX);
    if (isMovingRight) {
      this.stepUp();
    } else if (isMovingLeft) {
      this.stepDown();
    }
    this.setTooltipPosition();
  }

  handleCaptureDrag() {
    this.setTooltipPosition();
    this.toggleMouseEventsOnDrag(this.slider);
    document.addEventListener('mousemove', this.handleDragThumb);
    document.addEventListener('mouseup', this.handleReleaseDrag);
  }

  handleReleaseDrag() {
    this.toggleMouseEventsOnDrag(this.slider);
    document.removeEventListener('mousemove', this.handleDragThumb);
    document.removeEventListener('mouseup', this.handleReleaseDrag);
  }

  stepDown() {
    this.step(this.state.value - 1);
  }

  stepUp() {
    this.step(this.state.value + 1);
  }

  step(index) {
    const { simpleValue, steps, onChange } = this.props;
    const nextValue = simpleValue ? steps[index].value : steps[index];
    onChange(nextValue);
  }

  /**
   * Handling situation when mouseDown event starts on thumb but release ends on slider thus causing sliders onClick.
   * Even with stopPropagation being called.
   * Event only stops propagation if release phase was while over the same element.
   * */
  toggleMouseEventsOnDrag(element) {
    this.isThumbBeingDragged = !this.isThumbBeingDragged;
    element.style.pointerEvents = this.isThumbBeingDragged ? 'none' : 'all';
  }

  getLeftOffset(index) {
    return 100 * index / (this.props.steps.length - 1);
  }

  getTranslateOffset(index) {
    return `translateX(${-1 * this.getLeftOffset(index)}%)`;
  }

  setTooltipPosition() {
    this.tooltip.style.transform = this.getTranslateOffset(this.state.value);
  }

  getTooltipContent() {
    const tooltipContent = this.props.steps[this.state.value].tooltip;
    return tooltipContent
      ? <div style={{ padding: 5 }}>{tooltipContent}</div>
      : null;
  }

  render() {
    const { label, style, className } = this.props;
    const leftOffset = `${this.getLeftOffset(this.state.value)}%`;
    return (
      <div
        className={`sliderControl ${className}`}
        style={style}
      >
        {label && <div className="label">{label}</div>}
        <div
          ref={slider => this.slider = slider}
          onClick={this.handleClickSlider}
          className="slider"
        >
          <div className="fillLower" style={{ width: leftOffset }}/>
          <button
            ref={th => this.thumb = th}
            className="thumb"
            style={{ left: leftOffset }}
            onClick={event => event.preventDefault()}
            onMouseDown={this.handleCaptureDrag}
            onDragStart={() => false}
          >
            <div
              ref={tt => this.tooltip = tt}
              className="tooltip"
            >
              {this.getTooltipContent()}
            </div>
          </button>
        </div>
        <div className="stepLabels">
          {
            this.props.steps.map(({ label }, index) => label && (
              <span
                key={index}
                className="stepLabel label"
                style={{
                  left: `${this.getLeftOffset(index)}%`,
                  transform: this.getTranslateOffset(index)
                }}
              >
                {label}
              </span>
            ))
          }
        </div>
      </div>
    );
  }
}

Slider.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string,
    tooltip: PropTypes.string
  })).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
  simpleValue: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

Slider.defaultProps = {
  simpleValue: true,
  onChange: () => {
  }
};

export default Slider;
