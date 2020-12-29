import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Choices from './Choices';
import Problem from './Problem';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      padding: theme.spacing(1),
    },
  }),
);

function ProblemAndChoices(props: { visible: boolean, i: number, problem: string, handleChoiceSelection: (event: React.ChangeEvent<HTMLInputElement>) => void, choices: string[], selection: number }) {
  const classes = useStyles();
  // console.log(props)
  return (
    <Box className={props.visible ? '' : 'hidden'}>
      <Typography variant='h5' align='center' className={classes.header}>Problem {props.i + 1}</Typography>

      <Problem problem={props.problem} />
      <Choices handleChange={props.handleChoiceSelection} selectedValue={props.selection} choices={props.choices} />
    </Box>
  );
}


export default React.memo(ProblemAndChoices);
