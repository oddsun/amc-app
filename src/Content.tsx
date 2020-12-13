import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


function Content(props: { problemContent: string, handleButtonClick: () => void }) {
  if (!props.problemContent) {
    return (<Typography dangerouslySetInnerHTML={{ __html: props.problemContent }}></Typography>);
  } else {
    return (<Button
      variant="contained"
      color="primary"
      onClick={props.handleButtonClick}
    > Start </Button>);
  }
}


export default Content;
