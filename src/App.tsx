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
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';
import RadioButtons from './RadioButtons';
// import MathJaxScript from './MathJax'

const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
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
  }),
);

export default function App() {
  const classes = useStyles();
  const [problemIDs, setProblemIDs] = React.useState(Array.from(Array(25), (e, i) => i + 1));
  const [selections, setSelections] = React.useState(Array.from(Array(25), (e, i) => -1));
  const [problemContent, setProblemContent] = React.useState('');
  const [problemChoices, setProblemChoices] = React.useState([]);
  const handleListItemClick = (index: number) => {
    fetch(`/problem/2019_AMC_12B/${index}`).then(res => res.json()).then(data => {
      setProblemContent(data.problem);
      setProblemChoices(data.choices);
    });
  }

  React.useEffect(() => {
    // MathJaxScript();
    // console.log((window as any).MathJax);
    (window as any).MathJax.typeset();
    // (window as any).MathJax.typeset();
  }, [problemContent, problemChoices]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Test
          </Typography>
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
          <Typography variant='h4' align='center' className={classes.header}>Problems</Typography>
          <Divider />
          <List>
            {problemIDs.map((text, index) => (
              <ListItem key={text} divider onClick={() => handleListItemClick(text)}>
                <ListItemText primary={text} />
                <RadioButtons selectedValue={selections[index]} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <h1>Cool Timer</h1>
        <Timer max_secs={4500} />
        <Typography dangerouslySetInnerHTML={{ __html: problemContent }}></Typography>

      </main>
    </div>
  );
}
