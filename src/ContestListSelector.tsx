import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ContestListSelector(props: { contestList: string[], setContestName: (contestName: string) => void }) {
  return (
    <Autocomplete
      className="auto-margin"
      id="contest-list-selector"
      options={props.contestList}
      onChange={(event, newContest) => { if (newContest) { props.setContestName(newContest.replace(/ /g, '_')) } }}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Choose Contest" variant="outlined" />}
    />
  );
}
