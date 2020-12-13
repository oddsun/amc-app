import React from 'react';
import TimerStatic from './TimerStatic';

function Timer(props: { max_secs: number, timerRunning: boolean }) {
  const [secs, setSecs] = React.useState(0);

  const { max_secs, timerRunning } = props;

  React.useEffect(() => {
    if (timerRunning) {
      // console.log(timerRunning);
      var startTime = new Date().getTime();
      // console.log(startTime);
      setSecs(0);
      const timer = setInterval(() => {
        var secs = Math.floor((new Date().getTime() - startTime) / 1000);
        // console.log(secs);
        // console.log(timerRunning);
        if (!timerRunning || secs > max_secs) {
          clearInterval(timer);
          if (secs > max_secs) {
            setSecs(max_secs);
          }
        } else {
          setSecs(secs);
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    } else {
      console.log(timerRunning);
    }
  }, [max_secs, timerRunning]);

  return (
    <TimerStatic max_secs={max_secs} secs={secs} />
  );
}

export default Timer;
