import React from 'react';
import Typography from '@material-ui/core/Typography';

function Problem(props: { problem: string }) {
  return (<Typography dangerouslySetInnerHTML={{ __html: props.problem }} ></Typography>);
}

export default React.memo(Problem);
