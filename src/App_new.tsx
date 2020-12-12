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
  const [startTime, setStartTime] = React.useState(0);
  const [secs, setSecs] = React.useState(0);
  const [timerRunning, setTimerRunning] = React.useState(false);

  const max_secs = 4500;

  React.useEffect(() => {
    if (timerRunning) {
      console.log(timerRunning);
      console.log(startTime);
      const timer = setInterval(() => {
        var secs = Math.floor((new Date().getTime() - startTime) / 1000);
        console.log(secs);
        console.log(timerRunning);
        if (!timerRunning || secs > max_secs) {
          clearInterval(timer);
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
  }, [startTime, timerRunning]);

  const handleButtonClick = () => {
    // console.log('clicked')
    if (!timerRunning) {
      setStartTime(new Date().getTime());
      setTimerRunning(true);
    } else {
      // console.log('stopping?')
      setTimerRunning(false);
    }
  };

  return (
    <div className="App" id="outer-container">
      <div id="page-wrap">
        <h1>Cool Restaurant</h1>
        <h2>Check out our offerings in the sidebar!</h2>
        <div><Timer max_secs={max_secs} secs={secs} /></div><br />
        <div><Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
        >
          Start
        </Button></div>
      </div>
    </div>
  );
}

export default App;
