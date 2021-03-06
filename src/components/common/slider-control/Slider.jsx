import React, { PureComponent } from 'react';
import { arrayOf, shape, number, string, func, object, objectOf, oneOfType, bool } from 'prop-types';
import './Slider.less';

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

  getSectionWidth () {
    const { left: sliderLeft, right: sliderRight } = this.track.getBoundingClientRect();
    return (sliderRight - sliderLeft) / (this.props.max - this.props.min);
  }

  getThumbDragDirection (mouseX) {
    const { left: thumbLeft, right: thumbRight } = this.thumb.getBoundingClientRect();
    const sectionWidth = this.getSectionWidth();
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
    if (this.props.jumpToClickedPosition) {
      this.props.onChange(Math.round(mouseX / this.getSectionWidth()) + 1);
      return;
    }
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
    this.toggleMouseEventsOnDrag(this.track);
    document.addEventListener('mousemove', this.handleDragThumb);
    document.addEventListener('mouseup', this.handleReleaseDrag);
  }

  handleReleaseDrag () {
    this.toggleMouseEventsOnDrag(this.track);
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
      <div className="slider" style={style}>
        {label && <div className="label">{label}</div>}
        <div
          ref={track => this.track = track}
          onClick={this.handleClickSlider}
          className="track"
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
  jumpToClickedPosition: bool,
  label: string,
  style: object,
  info: (objectOf(shape({
    tooltip: oneOfType([number, string]),
    tickMark: oneOfType([number, string])
  }))),
};

Slider.defaultProps = {
  jumpToClickedPosition: false,
  step: 1,
  min: 1,
  max: 2,
  onChange: () => {
  }
};

export default Slider;
