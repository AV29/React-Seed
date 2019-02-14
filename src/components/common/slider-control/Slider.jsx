import React, { PureComponent } from 'react';
import { arrayOf, shape, number, string, func, object, objectOf, checkPropTypes, oneOfType } from 'prop-types';
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
 * @param {array} props.tickMarks An array of strings representing tick marks.
 */
class Slider extends PureComponent {

  constructor (props) {
    super(props);

    this.handleDragThumb = this.handleDragThumb.bind(this);
    this.handleClickSlider = this.handleClickSlider.bind(this);
    this.handleCaptureDrag = this.handleCaptureDrag.bind(this);
    this.handleReleaseDrag = this.handleReleaseDrag.bind(this);
    this.tickMarkRenderer = this.tickMarkRenderer.bind(this);

    this.isThumbBeingDragged = false;

  }

  getThumbDragDirection (mouseX) {
    const { left: thumbLeft, right: thumbRight } = this.thumb.getBoundingClientRect();
    const { left: sliderLeft, right: sliderRight } = this.slider.getBoundingClientRect();
    const sectionWidth = (sliderRight - sliderLeft) / (this.props.max - this.props.min);
    return {
      isMovingRight: mouseX > thumbRight + (sectionWidth * this.props.step / 2),
      isMovingLeft: mouseX < thumbLeft - (sectionWidth * this.props.step / 2)
    };
  }

  getReachedBounds () {
    return {
      minReached: this.props.value <= this.props.min,
      maxReached: this.props.value >= this.props.max
    }
  }

  handleClickSlider ({ clientX: mouseX }) {
    const { maxReached, minReached } = this.getReachedBounds();
    const { left: thumbLeft, right: thumbRight } = this.thumb.getBoundingClientRect();
    if (mouseX < thumbLeft - 5 && !minReached) {
      this.decrease();
    } else if (mouseX > thumbRight + 5 && !maxReached) {
      this.increase();
    }
  }

  handleDragThumb ({ clientX: mouseX }) {
    const { maxReached, minReached } = this.getReachedBounds();
    const { isMovingRight, isMovingLeft } = this.getThumbDragDirection(mouseX);
    if (isMovingRight && !maxReached) {
      this.increase();
    } else if (isMovingLeft && !minReached) {
      this.decrease();
    }
  }

  handleCaptureDrag () {
    this.toggleMouseEventsOnDrag(this.slider);
    document.addEventListener('mousemove', this.handleDragThumb);
    document.addEventListener('mouseup', this.handleReleaseDrag);
  }

  handleReleaseDrag () {
    this.toggleMouseEventsOnDrag(this.slider);
    document.removeEventListener('mousemove', this.handleDragThumb);
    document.removeEventListener('mouseup', this.handleReleaseDrag);
  }

  increase () {
    this.props.onChange(this.props.value + this.props.step);
  }

  decrease () {
    this.props.onChange(this.props.value - this.props.step);
  }

  /**
   * Handling situation when mouseDown event starts on thumb but release ends on slider thus causing sliders onClick.
   * Even with stopPropagation being called.
   * Event only stops propagation if release phase was while over the same element.
   * */
  toggleMouseEventsOnDrag (element) {
    this.isThumbBeingDragged = !this.isThumbBeingDragged;
    element.style.pointerEvents = this.isThumbBeingDragged ? 'none' : 'all';
  }

  getLeftOffset (index) {
    return 100 * index / (this.props.max - this.props.min);
  }

  tickMarkRenderer ({ tickMark }, index) {
    const offset = this.getLeftOffset(index);
    return tickMark && (
      <span
        key={index}
        className="tickMark label"
        style={{
          left: `${offset}%`,
          transform: `translateX(${-1 * offset}%)`
        }}
      >
        {tickMark}
      </span>
    );
  }

  getCurrentTooltip () {
    return this.props.info ? (this.props.info[this.props.value] || {}).tooltip : null;
  }

  getTickMarks () {
    const { info = {} } = this.props;
    return Object.values(info).map(this.tickMarkRenderer)
  }

  getValidatedValue () {
    if (this.props.value > this.props.max) {
      return this.props.max - 1;
    } else if (this.props.value < this.props.min) {
      return this.props.min - 1;
    } else {
      return Math.round(this.props.value - 1);
    }
  }

  render () {
    const { label, style } = this.props;
    const leftOffset = this.getLeftOffset(this.getValidatedValue());
    const tooltip = this.getCurrentTooltip();

    return (
      <div className="sliderControl" style={style}>
        {label && <div className="label">{label}</div>}
        <div
          ref={slider => this.slider = slider}
          onClick={this.handleClickSlider}
          className="slider"
        >
          <div className="fillLower" style={{ width: `${leftOffset}%` }}/>
          <button
            ref={th => this.thumb = th}
            className="thumb"
            style={{ left: `${leftOffset}%` }}
            onMouseDown={this.handleCaptureDrag}
            onDragStart={() => false}
          >
            <div
              className="tooltip"
              style={{ transform: `translateX(${-1 * leftOffset}%)` }}
            >
              {tooltip && <div style={{ padding: 5 }}>{tooltip}</div>}
            </div>
          </button>
        </div>
        <div className="tickMarks">{this.getTickMarks()}</div>
      </div>
    );
  }
}

Slider.propTypes = {
  step: number,
  min: number.isRequired,
  max: number.isRequired,
  value: number.isRequired,
  onChange: func.isRequired,
  label: string,
  style: object,
  info: (objectOf(shape({
    tooltip: oneOfType([number, string]),
    tickMark: oneOfType([number, string])
  }))),
};

Slider.defaultProps = {
  step: 1,
  min: 1,
  max: 2,
  onChange: () => {
  }
};

export default Slider;
