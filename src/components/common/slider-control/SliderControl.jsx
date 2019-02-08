import React from 'react';
import PropTypes from 'prop-types';
import './SliderControl.less';

class SliderControl extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickSlider = this.handleClickSlider.bind(this);
    this.handleCaptureDrag = this.handleCaptureDrag.bind(this);
    this.handleReleaseDrag = this.handleReleaseDrag.bind(this);
    this.handleDragThumb = this.handleDragThumb.bind(this);

  }

  handleClickSlider({ clientX: mouseX }) {
    const { left: thumbLeft, right: thumbRight } = this.thumb.getBoundingClientRect();

    if (mouseX < thumbLeft - 5) {
      this.stepDown();
    } else if (mouseX > thumbRight + 5) {
      this.stepUp();
    }
  }

  stepDown() {
    this.props.onChange(this.props.value - 1)
  }

  stepUp() {
    this.props.onChange(this.props.value + 1)
  }

  getLeftOffset(index) {
    return 100 * index / (this.props.steps.length - 1);
  }

  handleDragThumb(event) {
    event.stopPropagation();
    const { left: thumbLeft, right: thumbRight } = this.thumb.getBoundingClientRect();
    const { left: sliderLeft, right: sliderRight } = this.slider.getBoundingClientRect();
    const offsetForChangeValueWhileDragging = (sliderRight - sliderLeft) / 8;
    if (event.clientX > thumbRight + offsetForChangeValueWhileDragging && event.clientX <= sliderRight) {
      this.stepUp();
    } else if (event.clientX < thumbLeft - offsetForChangeValueWhileDragging && event.clientX >= sliderLeft) {
      this.stepDown();
    }
    this.setTooltipPosition();
  }

  setTooltipPosition() {
    this.tooltip.style.transform = this.getTranslateOffset(this.props.value - 1);
  }

  getTranslateOffset(index) {
    return `translateX(${-1 * this.getLeftOffset(index)}%)`
  }

  getTooltipContent() {
    const currentStepObj = this.props.steps.find(({ value, tooltip }) => value === this.props.value && tooltip);
    return currentStepObj ? currentStepObj.tooltip : null;
  }

  handleCaptureDrag() {
    this.tooltip.style.visibility = 'visible';
    this.setTooltipPosition();
    document.addEventListener('mousemove', this.handleDragThumb);
    document.addEventListener('mouseup', this.handleReleaseDrag);
  }

  handleReleaseDrag() {
    this.tooltip.style.visibility = 'hidden';
    document.removeEventListener('mousemove', this.handleDragThumb);
    document.removeEventListener('mouseup', this.handleReleaseDrag);
  }

  render() {
    const { label, style, steps, value } = this.props;
    const leftOffset = `${this.getLeftOffset(value - 1)}%`;
    return (
      <div className="sliderControl" style={style}>
        {label && <div className="label">{label}</div>}
        <div
          ref={slider => this.slider = slider}
          onClick={this.handleClickSlider}
          className="slider"
        >
          <div className="fillLower" style={{ width: leftOffset }}/>
          <div
            ref={th => this.thumb = th}
            className="thumb"
            style={{ left: leftOffset }}
            onMouseDown={this.handleCaptureDrag}
            onDragStart={() => false}
          >
            <div
              ref={t => this.tooltip = t}
              className="tooltip"
            >
              {this.getTooltipContent()}
            </div>
          </div>
        </div>
        <div className="stepLabels">
          {
            steps.map(({ label }, index) => label && (
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

SliderControl.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string,
    tooltip: PropTypes.string
  })).isRequired,
  initialValue: PropTypes.number
};

SliderControl.defaultProps = {
  onChange: () => {
  }
};


export default SliderControl;
