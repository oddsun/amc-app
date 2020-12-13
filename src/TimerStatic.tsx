import React from 'react';
import Typography from '@material-ui/core/Typography';


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

export default function TimerStatic(props: { secs: number, max_secs: number }) {
  return (<Typography variant="h3" component="div">{`${sec2hm(props.max_secs - props.secs)}`}</Typography>);
}
