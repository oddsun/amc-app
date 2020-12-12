import React from 'react';
import GradientCircularProgress from './GradientCircularProgress';
import { CircularProgressProps } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function normalize(secs: number, max_secs: number) {
  return 100 - secs / max_secs * 100;
}

function sec2hm(secs: number) {
  var sec = secs % 60;
  var min = Math.floor(secs / 60);
  var hr = Math.floor(min / 60);
  min = min % 60;
  var hr_str = String(hr).padStart(2, '0')
  var min_str = String(min).padStart(2, '0')
  var sec_str = String(sec).padStart(2, '0')
  return `${hr_str}:${min_str}:${sec_str}`
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number, secs: number }) {
  const { secs, ...otherProps } = props;
  return (
    <Box position="relative" display="inline-flex">
      <GradientCircularProgress variant="determinate" {...otherProps} size='30em' />
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
        <Typography variant="h1" component="div" color="textSecondary">{`${sec2hm(
          secs,
        )}`}</Typography>
      </Box>
    </Box>
  );
}

export default function Timer(props: { secs: number, max_secs: number }) {
  // const [secs, setSecs] = React.useState(0);
  //
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setSecs((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return <CircularProgressWithLabel value={normalize(props.secs, props.max_secs)} secs={props.max_secs - props.secs} />;
}
