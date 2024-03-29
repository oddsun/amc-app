import "./App.css";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Timer from "./Timer";
import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
// import Divider from '@material-ui/core/Divider';
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from "@material-ui/core/ListItemText";
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';
import RadioButtons from "./RadioButtons";
// import MathJaxScript from './MathJax';
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Choices from "./Choices";
import { useCookies } from "react-cookie";
import ContestListSelector from "./ContestListSelector";
import UserSelector from "./UserSelector";
import ProblemAndChoices from "./ProblemAndChoices";
import ListItemMemo from "./ListItemMemo";
import Hidden from "@material-ui/core/Hidden";

const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    spreadOut: {
      justifyContent: "space-between",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      overflow: "auto",
      height: "100vh",
    },
    header: {
      padding: theme.spacing(1),
    },
    paddie: {
      margin: theme.spacing(1),
    },
    borderHighlight: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.secondary.main,
      width: "100%",
    },
  })
);

// const correctAnswer: number = 6;
// const emptyAnswer: number = 1.5;
// const wrongAnswer: number = 0;

interface UserOptionType {
  name: string;
  id: number;
}

// TODO: add column remaining time in db, and handle pause/resume in backend
// TODO: add option to load response/remaining time from server

export default function App() {
  const classes = useStyles();
  const [cookies, setCookies, removeCookies] = useCookies();

  interface ProblemDict {
    problem: string;
    choices: string[];
    id: number;
  }

  // const [numProblems, setNumProblems] = React.useState('');
  const [contestName, setContestName] = React.useState("");
  const [buttonText, setButtonText] = React.useState("Start");
  // const [problemIDs, setProblemIDs] = React.useState<number[]>([]);
  // TODO: slow for long contest
  // const [selections, setSelections] = React.useState<number[]>([]);
  const [selections, setSelections] = React.useState<{
    [key: string]: number | string;
  }>({});
  const [answers, setAnswers] = React.useState<string[]>([]);
  const [totalScore, setTotalScore] = React.useState(0);
  const [availableContests, setAvailableContests] = React.useState([]);
  const [problemContentArray, setProblemContentArray] = React.useState<
    ProblemDict[]
  >([]);
  // const [problemContent, setProblemContent] = React.useState('');
  // const [problemChoices, setProblemChoices] = React.useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = React.useState(0);
  // const [currentTitle, setCurrentTitle] = React.useState('');
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [timerWasRunning, setTimerWasRunning] = React.useState(false);
  const [cleared, setCleared] = React.useState(false);
  const [graded, setGraded] = React.useState(false);
  const [userList, setUserList] = React.useState<UserOptionType[]>([]);
  const [currentUser, setCurrentUser] = React.useState("");
  const [startTime, setStartTime] = React.useState(0);
  const [aime, setAIME] = React.useState(false);

  const [correctAnswer, setCorrectAnswer] = React.useState(6);
  const [emptyAnswer, setEmptyAnswer] = React.useState(1.5);
  const [wrongAnswer, setWrongAnswer] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(4500);
  // const [hidden, setHidden] = React.useState(false);
  const handleListItemClick = React.useCallback((index: number) => {
    return () => setCurrentSelection(index);
  }, []);
  const validAIMEpartial = React.useCallback((x) => /^\d{0,3}$/.test(x), []);

  const handleListItemClickMain = React.useMemo(
    () => handleListItemClick(0),
    []
  );

  const arrayHandleListItemClick = React.useMemo(() => {
    return problemContentArray.map((e, i) => handleListItemClick(i + 1));
  }, [problemContentArray]);
  // const refs = React.useMemo<React.RefObject<HTMLDivElement>[]>(() => problemContentArray.map(
  //   (e, i) => React.createRef()
  // ), [problemContentArray]);
  const [refs, setRefs] = React.useState<React.RefObject<HTMLDivElement>[]>([]);
  // const availableContests = React.useMemo(() => {
  //   fetch(`/api/available_contests`).then(res => res.json()).then(data => data.available_contests
  //   )
  // }, []);

  const convertSelections = React.useCallback(
    (selections: { [key: string]: number | string }) => {
      if (timerRunning) {
        // console.log(`timerRunning ${timerRunning}`)
        // console.log(`timerWasRunning ${timerWasRunning}`)
        return [];
      }
      // console.log(aime);
      // console.log(Object.keys(selections).sort((a, b) => parseInt(a) - parseInt(b)))
      if (aime) {
        return Object.keys(selections)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((key) => selections[key]);
      } else {
        return Object.keys(selections)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((key) =>
            selections[key] === -1
              ? ""
              : String.fromCharCode(65 + (selections[key] as number))
          );
      }
    },
    [timerRunning, aime]
  );

  const getUserList = React.useCallback(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUserList(data.results);
      });
  }, []);

  const addUser = React.useCallback((user_name) => {
    fetch(`/api/adduser/${user_name}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setUserList(data.results);
        }
      });
  }, []);

  const addSetCurrentUser = React.useCallback(
    (user_name) => {
      const found = userList.some((el) => el.name === user_name);
      if (!found) {
        addUser(user_name);
      }
      setCurrentUser(user_name);
    },
    [userList, addUser]
  );

  const recordTime = React.useCallback(
    (contestName, currentSelection, entry_type, currentUser) => {
      const postData = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: currentUser,
          problem_id: currentSelection,
          entry_type: entry_type,
          contest_name: contestName,
          session_id: startTime,
        }),
      };
      fetch("/api/response_time", postData);
    },
    [startTime]
  );

  const recordResponse = React.useCallback(
    (contestName, selections, currentUser) => {
      const postData = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: currentUser,
          contest_name: contestName,
          response: convertSelections(selections),
          session_id: startTime,
        }),
      };
      fetch("/api/response", postData);
    },
    [convertSelections, startTime]
  );

  React.useEffect(() => {
    if (aime) {
      setCorrectAnswer(1);
      setEmptyAnswer(0);
      setTotalTime(5400);
    } else {
      setCorrectAnswer(6);
      setEmptyAnswer(1.5);
      setTotalTime(4500);
    }
  }, [aime]);

  React.useEffect(() => {
    if (currentSelection > 0 && timerRunning) {
      recordTime(contestName, currentSelection, "enter", currentUser);
      return () =>
        recordTime(contestName, currentSelection, "exit", currentUser);
    }
  }, [currentSelection, recordTime, timerRunning, contestName, currentUser]);

  React.useEffect(() => {
    fetch(`/api/available_contests`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableContests(data.available_contests);
      });
    getUserList();
  }, [getUserList]);

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

  const handleChoiceSelection = React.useCallback(
    (i: number) => {
      if (aime) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
          if (validAIMEpartial(event.target.value)) {
            setSelections((oldSelections) => ({
              ...oldSelections,
              [i]: event.target.value,
            }));
          }
        };
      } else {
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
          setSelections((oldSelections) => ({
            ...oldSelections,
            [i]: parseInt(event.target.value),
          }));
        };
      }
    },
    [aime]
  );

  const arrayOfHandleChoiceSelection = React.useMemo(() => {
    // console.log('creating function');
    return problemContentArray.map((e, i) => handleChoiceSelection(i));
  }, [problemContentArray]);

  const turnOffTimer = React.useCallback(() => {
    setTimerRunning(false);
    setButtonText("Start");
  }, []);

  const handleButtonClick = React.useCallback(
    (timerRunning, contestName, selections) => {
      // console.log('clicked')
      // console.log(timerRunning)
      // console.log(contestName)
      if (!timerRunning && contestName !== "" && currentUser !== "") {
        var temp_time = new Date().getTime();
        if (cookies.hasOwnProperty(`${contestName}-session-id`)) {
          temp_time = cookies[`${contestName}-session-id`];
        } else {
          setCookies(`${contestName}-session-id`, temp_time, { path: "/" });
        }
        setStartTime(temp_time);
        setTimerRunning(true);
        setTimerWasRunning(true);
        setCurrentSelection(1);
        setButtonText("Submit");
        setGraded(false);
        setCleared(false);
      } else {
        // updating timerRunning calls useEffect and cleans up previous call
        // via the returned method (i.e. clearInterval), i.e. stopping the timer
        // setTimerRunning(false);
        // setButtonText('Start');
        setCookies(`${contestName}-time-stop`, new Date().getTime(), {
          path: "/",
        });
        turnOffTimer();
        // console.log(handleSubmit(selections))
      }
    },
    [turnOffTimer, currentUser, timerRunning, cleared]
  );

  const clearCache = React.useCallback(() => {
    if (contestName && !timerRunning) {
      removeCookies(contestName, { path: "/" });
      removeCookies(`${contestName}-time`, { path: "/" });
      removeCookies(`${contestName}-session-id`, { path: "/" });
      // setSelections(problemContentArray.map((e: ProblemDict, i: number) => -1));
      setSelections(
        problemContentArray.reduce(
          (acc: { [key: string]: number | string }, element, index) => {
            acc[index.toString()] = aime ? "" : -1;
            return acc;
          },
          {} as { [key: string]: number | string }
        )
      );
      setGraded(false);
      setCleared(true);
    }
  }, [contestName, problemContentArray, removeCookies, timerRunning, aime]);

  const clearTime = React.useCallback(() => {
    if (contestName && !timerRunning) {
      // removeCookies(contestName, { path: "/" });
      removeCookies(`${contestName}-time`, { path: "/" });
      // removeCookies(`${contestName}-session-id`, { path: "/" });
      // setSelections(problemContentArray.map((e: ProblemDict, i: number) => -1));
      // setSelections(
      //   problemContentArray.reduce(
      //     (acc: { [key: string]: number | string }, element, index) => {
      //       acc[index.toString()] = aime ? "" : -1;
      //       return acc;
      //     },
      //     {} as { [key: string]: number | string }
      //   )
      // );
      setGraded(false);
      setCleared(true);
    }
  }, [contestName, problemContentArray, removeCookies, timerRunning, aime]);

  // React.useEffect(() => {
  //   setContestName('2019_AMC_12B');
  // }, []);

  const grade = React.useCallback(
    (selections) => {
      if (contestName) {
        fetch(`/api/answer/${contestName}`)
          .then((res) => res.json())
          .then((data) => {
            var answer = data.results;
            setAnswers((oldAnswers) => answer);
            // console.log(answers)
            // console.log(convertSelections(selections));
            var scores = convertSelections(selections).map((e, i) =>
              e === ""
                ? emptyAnswer
                : e === answer[i]
                ? correctAnswer
                : wrongAnswer
            );
            var total = scores.reduce((a, b) => a + b, 0);
            setTotalScore(total);
            setGraded(true);
          });
      }
    },
    [contestName, convertSelections, correctAnswer, emptyAnswer, wrongAnswer]
  );

  // submit response
  React.useEffect(() => {
    if (!timerRunning && timerWasRunning) {
      recordTime(contestName, 0, "end", currentUser);
      recordResponse(contestName, selections, currentUser);
      setTimerWasRunning(false);
    }
  }, [timerRunning, timerWasRunning]);

  // save selection -> cookies
  React.useEffect(() => {
    if (contestName) {
      setCookies(contestName, selections, { path: "/" });
    }
  }, [selections, setCookies]);

  // fetch contest
  React.useEffect(() => {
    if (contestName) {
      setGraded(false);
      setAIME(contestName.includes("AIME"));
      fetch(`/api/problem/${contestName}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          var results = data.results;
          // setProblemIDs(results.map((e: ProblemDict, i: number) => i + 1));
          if (cookies.hasOwnProperty(contestName)) {
            setSelections(cookies[contestName]);
          } else {
            // console.log("setting selections");
            // setSelections(results.map((e: ProblemDict, i: number) => -1));
            setSelections(
              results.reduce(
                (
                  acc: { [key: string]: number | string },
                  element: any,
                  index: number
                ) => {
                  // console.log(contestName.includes("AIME"));
                  acc[index.toString()] = aime ? "" : -1;
                  return acc;
                },
                {} as { [key: string]: number | string }
              )
            );
          }
          setProblemContentArray(results);
          setRefs(results.map(() => React.createRef()));
        });
    }
  }, [contestName, aime]);

  // React.useEffect(() => {
  //   if (currentSelection > 0 && currentSelection < refs.length) {
  //     var rect = refs[currentSelection - 1] ?.current ?.getBoundingClientRect();
  //     console.log(refs[currentSelection - 1] ?.current)
  //     var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  //     if ((rect as DOMRect).top < 64 || (rect as DOMRect).top - viewHeight >= 0) {
  //       refs[currentSelection - 1] ?.current ?.scrollIntoView();
  //     }
  //   }
  // }, [currentSelection, refs])

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

  // handle arrow keys
  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.keyCode === 38 || e.keyCode === 37) {
        setCurrentSelection((index) => Math.max(index - 1, 0));
        e.preventDefault();
      } else if (e.keyCode === 40 || e.keyCode === 39) {
        // console.log('down...')
        // setCurrentSelection(index => Math.min(index + 1, Math.max(...problemIDs)));
        setCurrentSelection((index) =>
          Math.min(index + 1, problemContentArray.length)
        );
        // console.log(currentSelection);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
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

  // typeset latex
  React.useEffect(() => {
    // MathJaxScript();
    // console.log((window as any).MathJax);
    if ((window as any).MathJax.hasOwnProperty("typeset")) {
      (window as any).MathJax.typeset();
    }
    // (window as any).MathJax.typeset();
    // }, [problemContent, problemChoices]);
  }, [problemContentArray]);

  // <Typography variant='h5' align='center' className={classes.header}>Problems</Typography>
  // <Divider />
  // TODO: incorrect answer is displayed after changing to contest with more answers
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.spreadOut}>
          <Typography variant="h3" noWrap onClick={handleListItemClickMain}>
            {contestName.replace(/_/g, " ")}
          </Typography>

          <Timer
            max_secs={totalTime}
            timerRunning={timerRunning}
            contestName={contestName}
            turnOffTimer={turnOffTimer}
            cleared={cleared}
          />
        </Toolbar>
      </AppBar>
      <Hidden xsDown>
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
                <ListItemMemo
                  index={index}
                  key={index}
                  selected={index + 1 === currentSelection}
                  selection={selections[index]}
                  handleListItemClick={arrayHandleListItemClick[index]}
                  aime={aime}
                />
                // <ListItem ref={refs[index]} key={index + 1} divider button onClick={() => handleListItemClick(index + 1)}
                //   className={index + 1 === currentSelection ? classes.borderHighlight : ''}
                // // selected={text === currentSelection} classes={{
                // //   selected: classes.borderHighlight,
                // // }}
                // >
                //   <ListItemText primary={index + 1} />
                //   <RadioButtons selectedValue={selections[index]} />
                // </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        <Toolbar />
        {
          // needs to prerender due to latex rerendering
          // looks messy if renders and latex rerenders after changing problem
          problemContentArray.map((problemDict, i) => (
            <ProblemAndChoices
              visible={currentSelection !== 0 && (timerRunning || graded)}
              i={i}
              problem={problemDict.problem}
              handleChoiceSelection={arrayOfHandleChoiceSelection[i]}
              selection={selections[i]}
              choices={problemDict.choices}
              selected={i + 1 === currentSelection}
              key={i}
              aime={aime}
            />
          ))
          // visible={i === currentSelection - 1 && (timerRunning || graded)}
          // <Box className={i === currentSelection - 1 && timerRunning ? '' : 'hidden'} key={i}>
          //   <Typography variant='h5' align='center' className={classes.header}>Problem {i + 1}</Typography>
          //
          //   <Problem problem={problemDict.problem} />
          //   <Choices handleChange={handleChoiceSelection(i)} selectedValue={selections[currentSelection - 1]} choices={problemDict.choices} />
          // </Box>
          // <Typography dangerouslySetInnerHTML={{ __html: problemDict.problem }} ></Typography>
          // <Problem currentSelection={currentSelection} problemDict={problemContentArray[currentSelection - 1]} selections={selections} handleChoiceSelection={handleChoiceSelection} />
        }
        {
          // <Typography variant='h5' align='center' className={classes.header}>{currentTitle}</Typography>
          // <Typography dangerouslySetInnerHTML={{ __html: problemContent }}></Typography>
          // <Choices handleChange={handleChoiceSelection(currentSelection - 1)} selectedValue={selections[currentSelection - 1]} choices={problemChoices} />
        }
        <Box className={currentSelection === 0 ? "App" : "App hidden"}>
          <Box m={2}>
            <UserSelector
              userList={userList}
              setUserName={addSetCurrentUser}
              disabled={timerRunning}
            />
          </Box>
          <Box m={2}>
            <ContestListSelector
              contestList={availableContests}
              setContestName={setContestName}
              disabled={timerRunning}
            />
          </Box>
          <Box m={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleButtonClick(timerRunning, contestName, selections)
              }
              className={classes.paddie}
            >
              {" "}
              {buttonText}{" "}
            </Button>
            {
              // </Box>
              // <Box m={2}>
            }
            <Button
              variant="contained"
              color="primary"
              onClick={clearCache}
              className={classes.paddie}
            >
              {" "}
              Clear{" "}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={clearTime}
              className={classes.paddie}
            >
              {" "}
              Reset Time{" "}
            </Button>
            {
              // </Box>
              // <Box m={2}>
            }
            <Button
              variant="contained"
              color="primary"
              onClick={() => grade(selections)}
              className={classes.paddie}
            >
              {" "}
              Grade{" "}
            </Button>
          </Box>
        </Box>
        <Box
          className={currentSelection === 0 && graded ? "App" : "App hidden"}
        >
          <Box m={2}>
            <Typography variant="h5" align="center" className={classes.header}>
              {" "}
              Score: {totalScore}{" "}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={2}>
                <Grid item xs={2}>
                  <Typography></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>Response</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>Answer</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                {convertSelections(selections).map((selection, i) => (
                  <Grid item xs={12} key={i}>
                    <Grid container justify="center" spacing={2}>
                      <Grid item xs={2}>
                        <Typography
                          color={
                            selection === ""
                              ? "primary"
                              : selection === answers[i]
                              ? "initial"
                              : "secondary"
                          }
                        >
                          {" "}
                          {i + 1}{" "}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography
                          color={
                            selection === ""
                              ? "primary"
                              : selection === answers[i]
                              ? "initial"
                              : "secondary"
                          }
                        >
                          {" "}
                          {selection || "_"}{" "}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography
                          color={
                            selection === ""
                              ? "primary"
                              : selection === answers[i]
                              ? "initial"
                              : "secondary"
                          }
                        >
                          {" "}
                          {answers[i]}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </main>
    </div>
  );
}
