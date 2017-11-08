import React from 'react';

import '../../style/components/progress.css';

const Progress = ({percent = 10}) => {
  const circumference = 2 * 3.14 * 54;
  const dashOffset = circumference * (1 - (percent)/100);
  return (
    <div className="progressCircle">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" strokeWidth="12" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="blue" strokeWidth="12"
          strokeDasharray="339.292" strokeDashoffset={dashOffset} />
      </svg>
    </div>
  );
};

export default Progress;
