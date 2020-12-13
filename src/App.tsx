import './App.css';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Timer from './Timer'
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';
import RadioButtons from './RadioButtons';
// import MathJaxScript from './MathJax'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Choices from './Choices';

const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    spreadOut: {
      justifyContent: 'space-between',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      overflow: 'auto',
      height: '100vh',
    },
    header: {
      padding: theme.spacing(1),
    },
    borderHighlight: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.main,
      width: '100%',
    }
  }),
);


export default function App() {
  const classes = useStyles();

  interface ProblemDict {
    problem: string,
    choices: string[],
    id: number
  }

  const num_problems = 25;
  const [contestName, setContestName] = React.useState('2019_AMC_12B')
  const [problemIDs, setProblemIDs] = React.useState<number[]>([]);
  const [selections, setSelections] = React.useState<number[]>([]);
  const [problemContentArray, setProblemContentArray] = React.useState<ProblemDict[]>([]);
  // const [problemContent, setProblemContent] = React.useState('');
  // const [problemChoices, setProblemChoices] = React.useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = React.useState(0);
  // const [currentTitle, setCurrentTitle] = React.useState('');
  const [timerRunning, setTimerRunning] = React.useState(false);
  // const [hidden, setHidden] = React.useState(false);
  const handleListItemClick = (index: number) => {
    setCurrentSelection(index);
  };
  const refs = React.useMemo<React.RefObject<HTMLDivElement>[]>(() => Array.from({ length: num_problems }).map(
    () => React.createRef()
  ), []);



  // const renderContent = () => {
  //   if (currentSelection) {
  //     // return (
  //     //   <>
  //     //     <Typography dangerouslySetInnerHTML={{ __html: problemContent }}></Typography>
  //     //     <Choices handleChange={handleChoiceSelection(currentSelection - 1)} selectedValue={selections[currentSelection - 1]} choices={problemChoices} />
  //     //   </>);
  //   } else {
  //     return <Box className='App'><Button variant="contained" color="primary" onClick={handleButtonClick} > Start </Button></Box>
  //   }
  // }

  const handleChoiceSelection = (i: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelections(oldSelections => oldSelections.map((e, j) => (
        j !== i ? e : parseInt(event.target.value)
      )));
    }
  }

  const handleButtonClick = () => {
    // console.log('clicked')
    if (!timerRunning) {
      // setStartTime(new Date().getTime());
      setTimerRunning(true);
      setCurrentSelection(1);
      // setButtonText('Stop');
    } else {
      // updating timerRunning calls useEffect and cleans up previous call
      // via the returned method (i.e. clearInterval), i.e. stopping the timer
      // setTimerRunning(false);
      // setButtonText('Start');
    }
  };

  React.useEffect(() => {
    setContestName('2019_AMC_12B');
  }, []);

  React.useEffect(() => {
    fetch(`/problem/${contestName}`).then(res => res.json()).then(data => {
      console.log(data);
      var results = data.results;
      setProblemIDs(results.map((e: ProblemDict, i: number) => i + 1));
      setSelections(results.map((e: ProblemDict, i: number) => -1));
      setProblemContentArray(results);
    });
  }, [contestName]);

  React.useEffect(() => {
    if (currentSelection > 0) {
      var rect = refs[currentSelection - 1] ?.current ?.getBoundingClientRect();
      var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      if ((rect as DOMRect).top < 64 || (rect as DOMRect).top - viewHeight >= 0) {
        refs[currentSelection - 1] ?.current ?.scrollIntoView();
      }
    }
  }, [currentSelection])

  // React.useEffect(() => {
  //   // if (refs != null && refs[currentSelection - 1].current) {
  //   // var current: HTMLDivElement | null = refs[currentSelection - 1].current
  //   // if (current !== null) {
  //   // const current = refs[currentSelection - 1].current
  //   // }
  //   if (currentSelection > 0) {
  //     refs[currentSelection - 1] ?.current ?.scrollIntoView();
  //
  //     // setCurrentTitle(`Problem ${currentSelection}`);
  //     // if (timerRunning) {
  //     //   setProblemContent(problemContentArray[currentSelection - 1].problem);
  //     //   setProblemChoices(problemContentArray[currentSelection - 1].choices);
  //     // }
  //     setHidden(true);
  //   } else {
  //     // setCurrentTitle('');
  //     // setProblemContent('');
  //     // setProblemChoices([]);
  //     setHidden(false);
  //   }
  // }, [currentSelection, refs, timerRunning, problemContentArray]);

  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.keyCode === 38 || e.keyCode === 37) {
        setCurrentSelection(index => Math.max(index - 1, 0));
        e.preventDefault();
      } else if (e.keyCode === 40 || e.keyCode === 39) {
        console.log('down...')
        setCurrentSelection(index => Math.min(index + 1, Math.max(...problemIDs)));
        // console.log(currentSelection);
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => { window.removeEventListener('keydown', handleKeydown) }
    // window.addEventListener('keyup', handleKeyPress);
    // window.addEventListener('keydown', e => {
    //   if (e.keyCode === 38 || e.keyCode === 37) {
    //     // setCurrentSelection(index => Math.max(index - 1, 0));
    //     e.preventDefault();
    //   } else if (e.keyCode === 40 || e.keyCode === 39) {
    //     // setCurrentSelection(index => Math.min(index + 1, Math.max(...problemIDs)));
    //     e.preventDefault();
    //   }
    // });
  }, [problemIDs]);

  React.useEffect(() => {
    // MathJaxScript();
    // console.log((window as any).MathJax);
    if ((window as any).MathJax.hasOwnProperty('typeset')) {
      (window as any).MathJax.typeset();
    }
    // (window as any).MathJax.typeset();
    // }, [problemContent, problemChoices]);
  }, [problemContentArray]);

  // <Typography variant='h5' align='center' className={classes.header}>Problems</Typography>
  // <Divider />
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.spreadOut}>
          <Typography variant="h3" noWrap onClick={() => handleListItemClick(0)}>
            {contestName.replace(/_/g, ' ')}
          </Typography>

          <Timer max_secs={4500} timerRunning={timerRunning} />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {problemIDs.map((text, index) => (
              <ListItem ref={refs[index]} key={text} divider button onClick={() => handleListItemClick(text)}
                className={text === currentSelection ? classes.borderHighlight : ''}
              // selected={text === currentSelection} classes={{
              //   selected: classes.borderHighlight,
              // }}
              >
                <ListItemText primary={text} />
                <RadioButtons selectedValue={selections[index]} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {
          problemContentArray.map((problemDict, i) => (
            <Box className={i === currentSelection - 1 && timerRunning ? '' : 'hidden'} key={i}>
              <Typography variant='h5' align='center' className={classes.header}>Problem {i + 1}</Typography>
              <Typography dangerouslySetInnerHTML={{ __html: problemDict.problem }} ></Typography>
              <Choices handleChange={handleChoiceSelection(currentSelection - 1)} selectedValue={selections[currentSelection - 1]} choices={problemDict.choices} />
            </Box>
          ))
        }
        {
          // <Typography variant='h5' align='center' className={classes.header}>{currentTitle}</Typography>
          // <Typography dangerouslySetInnerHTML={{ __html: problemContent }}></Typography>
          // <Choices handleChange={handleChoiceSelection(currentSelection - 1)} selectedValue={selections[currentSelection - 1]} choices={problemChoices} />
        }
        <Box className={currentSelection === 0 ? 'App' : 'App hidden'}><Button variant="contained" color="primary" onClick={handleButtonClick} > Start </Button></Box>
      </main>
    </div>
  );
}
