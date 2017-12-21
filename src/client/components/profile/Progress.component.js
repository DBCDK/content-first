import React from 'react';

const Progress = ({percent = 10, strokeWidth = 12}) => {
  const radius = 60 - strokeWidth / 2;
  const circumference = 2 * 3.14 * radius;
  const dashOffset = circumference * (1 - percent / 100);
  return (
    <div className="progress-circle">
      <svg viewBox="0 0 120 120">
        <circle
          className="passive"
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className="active"
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="progress-text raleway">
        <span className="value">{percent}</span>
        <span className="percent">%</span>
      </div>
    </div>
  );
};

export default Progress;
