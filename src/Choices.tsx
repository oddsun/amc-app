import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spreadOut: {
      justifyContent: 'space-between',
    },
  }),
);


export default function Choices(props: { selectedValue: number, choices: string[], handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {

  const classes = useStyles();
  const { selectedValue, choices, handleChange } = props;


  return (
    <Box m={2} mt={5}>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup aria-label="choices" name="choices" value={selectedValue === undefined ? -1 : selectedValue} onChange={handleChange} row className={classes.spreadOut}>
          {choices.map((text, index) => (
            <FormControlLabel value={index} key={index} control={<Radio />} label={text} />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
