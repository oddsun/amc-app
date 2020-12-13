import React from 'react';
import TimerStatic from './TimerStatic';
import Button from '@material-ui/core/Button';

function Timer(props: { max_secs: number }) {
  const [startTime, setStartTime] = React.useState(0);
  const [secs, setSecs] = React.useState(0);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [buttonText, setButtonText] = React.useState('Start');

  const { max_secs } = props;

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

  const handleButtonClick = () => {
    // console.log('clicked')
    if (!timerRunning) {
      // setStartTime(new Date().getTime());
      setTimerRunning(true);
      setButtonText('Stop');
    } else {
      // updating timerRunning calls useEffect and cleans up previous call
      // via the returned method (i.e. clearInterval), i.e. stopping the timer
      setTimerRunning(false);
      setButtonText('Start');
    }
  };

  return (
    <div className="Timer" id="timer-container">
      <TimerStatic max_secs={max_secs} secs={secs} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
  // return (
  //   <TimerStatic max_secs={max_secs} secs={secs} />
  // );
}

export default Timer;
