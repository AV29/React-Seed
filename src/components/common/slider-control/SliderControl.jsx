import React from 'react';
import PropTypes from 'prop-types';
import './SliderControl.less';

class SliderControl extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickSlider = this.handleClickSlider.bind(this);

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

  getThumbOffset() {
    return `${100 * (this.props.value - 1) / (this.props.steps.length - 1)}%`;
  }

  getLabelOffset(index) {
    return `${100 * index / (this.props.steps.length - 1)}%`;
  }

  render() {
    const { label, style } = this.props;
    const thumbOffset = this.getThumbOffset();
    return (
      <div className="slider-control" style={style}>
        {label && <div className="label">{label}</div>}
        <div
          ref={slider => this.slider = slider}
          onClick={this.handleClickSlider}
          className="slider"
        >
          <div className="progress-shade" style={{ width: thumbOffset }}/>
          <div
            className="thumb"
            style={{ left: thumbOffset }}
            ref={thumb => this.thumb = thumb}
          />
        </div>
        <div className="labels">
          {this.props.steps.map(({label}, index) => label && (
            <span className="labelQWerty" key={index} style={{fontSize: 16, position: 'absolute', left: this.getLabelOffset(index) }}>{label}</span>
          ))}
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
  onChange: () => {}
};


export default SliderControl;
