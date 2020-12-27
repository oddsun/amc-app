import './App.css';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Timer from './Timer';
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
// import MathJaxScript from './MathJax';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Choices from './Choices';
import { useCookies } from 'react-cookie';
import ContestListSelector from './ContestListSelector';

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
  const [cookies, setCookies, removeCookies] = useCookies();

  interface ProblemDict {
    problem: string,
    choices: string[],
    id: number
  }

  // const [numProblems, setNumProblems] = React.useState('');
  const [contestName, setContestName] = React.useState('');
  const [buttonText, setButtonText] = React.useState('Start');
  // const [problemIDs, setProblemIDs] = React.useState<number[]>([]);
  // TODO: slow for long contest
  const [selections, setSelections] = React.useState<number[]>([]);
  const [availableContests, setAvailableContests] = React.useState([]);
  const [problemContentArray, setProblemContentArray] = React.useState<ProblemDict[]>([]);
  // const [problemContent, setProblemContent] = React.useState('');
  // const [problemChoices, setProblemChoices] = React.useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = React.useState(0);
  // const [currentTitle, setCurrentTitle] = React.useState('');
  const [timerRunning, setTimerRunning] = React.useState(false);
  // const [startTime, setStartTIme] = React.useState(0);
  // const [hidden, setHidden] = React.useState(false);
  const handleListItemClick = React.useCallback((index: number) => {
    setCurrentSelection(index);
  }, []);
  // const refs = React.useMemo<React.RefObject<HTMLDivElement>[]>(() => problemContentArray.map(
  //   (e, i) => React.createRef()
  // ), [problemContentArray]);
  const [refs, setRefs] = React.useState<React.RefObject<HTMLDivElement>[]>([]);
  // const availableContests = React.useMemo(() => {
  //   fetch(`/api/available_contests`).then(res => res.json()).then(data => data.available_contests
  //   )
  // }, []);
  React.useEffect(() => {
    fetch(`/api/available_contests`).then(res => res.json()).then(data => { setAvailableContests(data.available_contests) }
    )
  }, [])

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

  const handleChoiceSelection = React.useCallback((i: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelections(oldSelections => oldSelections.map((e, j) => (
        j !== i ? e : parseInt(event.target.value)
      )));
    }
  }, []);

  const handleButtonClick = React.useCallback((timerRunning, contestName) => {
    // console.log('clicked')
    // console.log(timerRunning)
    // console.log(contestName)
    if ((!timerRunning) && contestName !== '') {
      // setStartTime(new Date().getTime());
      setTimerRunning(true);
      setCurrentSelection(1);
      setButtonText('Submit');
    } else {
      // updating timerRunning calls useEffect and cleans up previous call
      // via the returned method (i.e. clearInterval), i.e. stopping the timer
      setTimerRunning(false);
      setButtonText('Start');
    }
  }, []);

  const clearCache = React.useCallback(() => {
    if (contestName) {
      removeCookies(contestName, { path: '/' });
      removeCookies(`${contestName}-time`, { path: '/' });
      setSelections(problemContentArray.map((e: ProblemDict, i: number) => -1));
    }
  }, [contestName, problemContentArray, removeCookies]);

  // React.useEffect(() => {
  //   setContestName('2019_AMC_12B');
  // }, []);

  React.useEffect(() => {
    if (contestName) {
      setCookies(contestName, selections, { path: '/' })
    }
  }, [contestName, selections, setCookies])

  React.useEffect(() => {
    if (contestName) {
      fetch(`/api/problem/${contestName}`).then(res => res.json()).then(data => {
        // console.log(data);
        var results = data.results;
        // setProblemIDs(results.map((e: ProblemDict, i: number) => i + 1));
        if (cookies.hasOwnProperty(contestName)) {
          setSelections(cookies[contestName]);
        } else {
          setSelections(results.map((e: ProblemDict, i: number) => -1));
        }
        setProblemContentArray(results);
        setRefs(results.map(
          () => React.createRef()
        ));
      });
    }
  }, [contestName]);

  React.useEffect(() => {
    if (currentSelection > 0 && currentSelection < refs.length) {
      var rect = refs[currentSelection - 1] ?.current ?.getBoundingClientRect();
      var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      if ((rect as DOMRect).top < 64 || (rect as DOMRect).top - viewHeight >= 0) {
        refs[currentSelection - 1] ?.current ?.scrollIntoView();
      }
    }
  }, [currentSelection, refs])

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
        // console.log('down...')
        // setCurrentSelection(index => Math.min(index + 1, Math.max(...problemIDs)));
        setCurrentSelection(index => Math.min(index + 1, problemContentArray.length));
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
  }, [problemContentArray]);

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

          <Timer max_secs={4500} timerRunning={timerRunning} contestName={contestName} />
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
            {problemContentArray.map((content, index) => (
              <ListItem ref={refs[index]} key={index + 1} divider button onClick={() => handleListItemClick(index + 1)}
                className={index + 1 === currentSelection ? classes.borderHighlight : ''}
              // selected={text === currentSelection} classes={{
              //   selected: classes.borderHighlight,
              // }}
              >
                <ListItemText primary={index + 1} />
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
        <Box className={currentSelection === 0 ? 'App' : 'App hidden'}>
          <Box m={2}>
            <ContestListSelector contestList={availableContests} setContestName={setContestName} disabled={timerRunning} />
          </Box>
          <Box m={2}>
            <Button variant="contained" color="primary" onClick={() => handleButtonClick(timerRunning, contestName)} > {buttonText} </Button>
          </Box>
          <Box m={2}>
            <Button variant="contained" color="primary" onClick={clearCache} > Clear </Button>
          </Box>
        </Box>
      </main>
    </div>
  );
}
