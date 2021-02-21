import React from "react";
import { Box, Typography, Container, Divider } from "@material-ui/core";
import Choices from "./Choices";
import Problem from "./Problem";
import TextField from "@material-ui/core/TextField";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const validAIME = (x: string) => /^(\d{3}|\d{0})$/.test(x);
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      padding: theme.spacing(1),
    },
    borderHighlight: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.secondary.main,
      width: "100%",
    },

    borderNoHighlight: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "transparent",
      width: "100%",
      borderBottomColor: theme.palette.divider,
    },
  })
);

function ProblemAndChoices(props: {
  visible: boolean;
  i: number;
  problem: string;
  handleChoiceSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  choices: string[];
  selection: number | string;
  selected: boolean;
  aime: boolean;
}) {
  const classes = useStyles();
  // can't add ref to box yet, fixed in material ui v5
  const problem = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // console.log('clicked')
    var rect = problem?.current?.getBoundingClientRect();
    var viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    if (
      (rect as DOMRect).top < 64 ||
      (rect as DOMRect).bottom - viewHeight >= 0
    ) {
      problem?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [props.selected]);

  // console.log(props);
  return (
    <Box
      className={
        !props.visible
          ? "hidden"
          : props.selected
          ? classes.borderHighlight
          : classes.borderNoHighlight
      }
      p={2}
      pt={4}
    >
      <Container ref={problem}>
        <Typography variant="h5" align="center" className={classes.header}>
          Problem {props.i + 1}
        </Typography>

        <Problem problem={props.problem} />
        {props.aime ? (
          <TextField
            value={props.selection === undefined ? "" : props.selection}
            onChange={props.handleChoiceSelection}
            error={!validAIME(props.selection as string)}
          />
        ) : (
          <Choices
            handleChange={props.handleChoiceSelection}
            selectedValue={props.selection as number}
            choices={props.choices}
            selected={props.selected}
          />
        )}
      </Container>
    </Box>
  );
}

export default React.memo(ProblemAndChoices);
