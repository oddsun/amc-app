import React from 'react';
import { CircularProgress, makeStyles, CircularProgressProps } from "@material-ui/core";
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(() => ({
  circle: {
    stroke: "url(#linearColors)",
  },
}));

export default function GradientCircularProgress(props: CircularProgressProps) {
  const classes = useStyles({});

  return (

    <Box position="relative" display="inline-flex">
      <svg width={props.size} height={props.size}>
        <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
          <stop offset="20%" stopColor="#39F" />
          <stop offset="90%" stopColor="#F3F" />
        </linearGradient>
      </svg>

      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress
          classes={{ circle: classes.circle }}
          {...props}
        />
      </Box>
    </Box>
  );
}
