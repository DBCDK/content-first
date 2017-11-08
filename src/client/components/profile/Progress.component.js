import React from 'react';

import '../../style/components/progress.css';

const Progress = ({percent = 10, strokeWidth = 12}) => {
  const radius = (60 - strokeWidth/2);
  const circumference = 2 * 3.14 * radius;
  const dashOffset = circumference * (1 - (percent)/100);
  return (
    <div className="progress-circle">
      <svg viewBox="0 0 120 120">
        <circle className="passive" cx="60" cy="60" r={radius} fill="none" strokeWidth={strokeWidth} />
        <circle className="active" cx="60" cy="60" r={radius} fill="none" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={dashOffset} />
      </svg>
      <div className="progress-text raleway">
        <span className="value">{percent}</span>
        <span className="percent">%</span>
      </div>
    </div>
  );
};

class ProgressTicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {percent: 0};
  }
  componentDidMount() {
    setInterval(() => {
      const percent = this.state.percent >= 100 ? 0 : this.state.percent + 10;
      this.setState({percent});
    }, 1000);
  }

  render() {
    return (<Progress percent={this.state.percent} strokeWidth={this.props.strokeWidth} />);
  }
}

export default ProgressTicker;
