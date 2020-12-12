import React from 'react';
import './App.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Timer from './Timer';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       display: 'flex',
//     },
//     appBar: {
//       zIndex: theme.zIndex.drawer + 1,
//     },
//     drawer: {
//       width: drawerWidth,
//       flexShrink: 0,
//     },
//     drawerPaper: {
//       width: drawerWidth,
//     },
//     drawerContainer: {
//       overflow: 'auto',
//     },
//     content: {
//       flexGrow: 1,
//       padding: theme.spacing(3),
//     },
//   }),
// );

function App() {
  // const [startTime, setStartTime] = React.useState(0);
  const [secs, setSecs] = React.useState(0);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [buttonText, setButtonText] = React.useState('Start');

  const max_secs = 10;

  React.useEffect(() => {
    if (timerRunning) {
      console.log(timerRunning);
      var startTime = new Date().getTime();
      console.log(startTime);
      setSecs(0);
      const timer = setInterval(() => {
        var secs = Math.floor((new Date().getTime() - startTime) / 1000);
        console.log(secs);
        console.log(timerRunning);
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
  }, [timerRunning]);

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
    <div className="App" id="outer-container">
      <div id="page-wrap">
        <h1>Cool Timer</h1>
        <h2>Check out our offerings in the sidebar!</h2>
        <div><Timer max_secs={max_secs} secs={secs} /></div><br />
        <div><Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button></div>
      </div>
    </div>
  );
}

export default App;
