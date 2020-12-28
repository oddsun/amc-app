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
import Grid from '@material-ui/core/Grid';
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
import UserSelector from './UserSelector';
// import Problem from './Problem';

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
    paddie: {
      margin: theme.spacing(1),
    },
    borderHighlight: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.main,
      width: '100%',
    }
  }),
);


const correctAnswer: number = 6;
const emptyAnswer: number = 1.5;
const wrongAnswer: number = 0;

interface UserOptionType {
  name: string;
  id: number;
}

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
  // const [selections, setSelections] = React.useState<number[]>([]);
  const [selections, setSelections] = React.useState<{ [key: string]: number }>({});
  const [answers, setAnswers] = React.useState<string[]>([]);
  const [totalScore, setTotalScore] = React.useState(0);
  const [availableContests, setAvailableContests] = React.useState([]);
  const [problemContentArray, setProblemContentArray] = React.useState<ProblemDict[]>([]);
  // const [problemContent, setProblemContent] = React.useState('');
  // const [problemChoices, setProblemChoices] = React.useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = React.useState(0);
  // const [currentTitle, setCurrentTitle] = React.useState('');
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [timerWasRunning, setTimerWasRunning] = React.useState(false);
  const [graded, setGraded] = React.useState(false);
  const [userList, setUserList] = React.useState<UserOptionType[]>([]);
  const [currentUser, setCurrentUser] = React.useState('');
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
  const getUserList = React.useCallback(() => {
    fetch('/api/users').then(res => res.json()).then(data => { setUserList(data.results) }
    );
  }, []);

  const addUser = React.useCallback((user_name) => {
    fetch(`/api/adduser/${user_name}`).then(res => res.json()).then(data => { if (data.results) { setUserList(data.results) } }
    );
  }, []);

  const addSetCurrentUser = React.useCallback((user_name) => {
    const found = userList.some(el => el.name === user_name)
    if (!found) {
      addUser(user_name);
    }
    setCurrentUser(user_name);
  }, [userList, addUser]);

  const recordTime = React.useCallback((contestName, currentSelection, entry_type, currentUser) => {
    const postData = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: currentUser,
        problem_id: currentSelection,
        entry_type: entry_type,
        contest_name: contestName
      })
    };
    fetch('/api/response_time', postData);
  }, [])

  const recordResponse = React.useCallback((contestName, selections, currentUser) => {
    const postData = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: currentUser,
        contest_name: contestName,
        response: convertSelections(selections)
      })
    };
    fetch('/api/response', postData);
  }, [])

  React.useEffect(() => {
    if (currentSelection > 0 && timerRunning) {
      recordTime(contestName, currentSelection, 'enter', currentUser);
      return () => recordTime(contestName, currentSelection, 'exit', currentUser);
    }
  }, [currentSelection, recordTime, timerRunning, contestName, currentUser])

  React.useEffect(() => {
    fetch(`/api/available_contests`).then(res => res.json()).then(data => { setAvailableContests(data.available_contests) }
    );
    getUserList();
  }, [getUserList])


  const convertSelections = React.useCallback((selections: { [key: string]: number }) => {
    return Object.keys(selections).sort().map(key => selections[key] === -1 ? '' : String.fromCharCode(65 + selections[key]))
  }, []);

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
      // setSelections(oldSelections => oldSelections.map((e, j) => (
      //   j !== i ? e : parseInt(event.target.value)
      // )));
      // console.log(selections)
      // selections[i] = parseInt(event.target.value)
      // setSelections(oldSelections => {
      //   let newSelections = [...oldSelections];
      //   newSelections[i] = parseInt(event.target.value);
      //   return newSelections;
      // })
      // var i_str = i.toString()
      // console.log(selections)
      setSelections(oldSelections => ({ ...oldSelections, [i]: parseInt(event.target.value) }));
    }
  }, []);


  const turnOffTimer = React.useCallback(() => {
    setTimerRunning(false);
    setButtonText('Start');
  }, [contestName, currentUser])



  const handleButtonClick = React.useCallback((timerRunning, contestName, selections) => {
    // console.log('clicked')
    // console.log(timerRunning)
    // console.log(contestName)
    if ((!timerRunning) && contestName !== '') {
      // setStartTime(new Date().getTime());
      setTimerRunning(true);
      setTimerWasRunning(true);
      setCurrentSelection(1);
      setButtonText('Submit');
      setGraded(false);
    } else {
      // updating timerRunning calls useEffect and cleans up previous call
      // via the returned method (i.e. clearInterval), i.e. stopping the timer
      // setTimerRunning(false);
      // setButtonText('Start');
      turnOffTimer();
      // console.log(handleSubmit(selections))
    }
  }, [turnOffTimer]);


  const clearCache = React.useCallback(() => {
    if (contestName) {
      removeCookies(contestName, { path: '/' });
      removeCookies(`${contestName}-time`, { path: '/' });
      // setSelections(problemContentArray.map((e: ProblemDict, i: number) => -1));
      setSelections(problemContentArray.reduce((acc: { [key: string]: number }, element, index) => {
        acc[index.toString()] = -1;
        return acc
      }, ({} as { [key: string]: number })));
    }
  }, [contestName, problemContentArray, removeCookies]);

  // React.useEffect(() => {
  //   setContestName('2019_AMC_12B');
  // }, []);

  const grade = React.useCallback((selections) => {
    if (contestName) {
      fetch(`/api/answer/${contestName}`).then(res => res.json()).then(data => {
        var answer = data.results;
        setAnswers(answer);
        var scores = convertSelections(selections).map((e, i) => e === '' ? emptyAnswer : e === answer[i] ? correctAnswer : wrongAnswer);
        var total = scores.reduce((a, b) => a + b, 0)
        setTotalScore(total);
        setGraded(true);
      }
      )
    }
  }, [contestName, convertSelections]);

  React.useEffect(() => {
    if (!timerRunning && timerWasRunning) {
      recordTime(contestName, 0, 'end', currentUser);
      recordResponse(contestName, selections, currentUser);
      setTimerWasRunning(false);
    }
  }, [timerRunning, timerWasRunning])

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
          // setSelections(results.map((e: ProblemDict, i: number) => -1));
          setSelections(results.reduce((acc: { [key: string]: number }, element: any, index: number) => {
            acc[index.toString()] = -1;
            return acc
          }, ({} as { [key: string]: number })));
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

          <Timer max_secs={4500} timerRunning={timerRunning} contestName={contestName} turnOffTimer={turnOffTimer} />
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
          // needs to prerender due to latex rerendering
          // looks messy if renders and latex rerenders after changing problem
          problemContentArray.map((problemDict, i) => (
            <Box className={i === currentSelection - 1 && timerRunning ? '' : 'hidden'} key={i}>
              <Typography variant='h5' align='center' className={classes.header}>Problem {i + 1}</Typography>
              <Typography dangerouslySetInnerHTML={{ __html: problemDict.problem }} ></Typography>
              <Choices handleChange={handleChoiceSelection(currentSelection - 1)} selectedValue={selections[currentSelection - 1]} choices={problemDict.choices} />
            </Box>
          ))
          // <Problem currentSelection={currentSelection} problemDict={problemContentArray[currentSelection - 1]} selections={selections} handleChoiceSelection={handleChoiceSelection} />
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
            <UserSelector userList={userList} setUserName={addSetCurrentUser} disabled={timerRunning} />
          </Box>
          <Box m={2}>
            <Button variant="contained" color="primary" onClick={() => handleButtonClick(timerRunning, contestName, selections)}
              className={classes.paddie}> {buttonText} </Button>
            {// </Box>
              // <Box m={2}>
            }
            <Button variant="contained" color="primary" onClick={clearCache} className={classes.paddie}> Clear </Button>
            {
              // </Box>
              // <Box m={2}>
            }
            <Button variant="contained" color="primary" onClick={grade} className={classes.paddie}> Grade </Button>
          </Box>
        </Box>
        <Box className={currentSelection === 0 && graded ? 'App' : 'App hidden'}>
          <Box m={2}>
            <Typography variant='h5' align='center' className={classes.header}> Score: {totalScore} </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container justify='center' spacing={2}>
                <Grid item xs={2}>
                  <Typography></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography >Response</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography >Answer</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>

              <Grid container spacing={2}>
                {
                  convertSelections(selections).map((selection, i) => (
                    <Grid item xs={12} key={i}>
                      <Grid container justify='center' spacing={2}>
                        <Grid item xs={2}>
                          <Typography color={selection === "" ? "primary" : selection === answers[i] ? 'initial' : 'secondary'}> {i + 1} </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography color={selection === "" ? "primary" : selection === answers[i] ? 'initial' : 'secondary'}> {selection || "_"} </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography color={selection === "" ? "primary" : selection === answers[i] ? 'initial' : 'secondary'}> {answers[i]} </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </main>
    </div >
  );
}
