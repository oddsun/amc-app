import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import { green } from '@material-ui/core/colors';
// import Radio, { RadioProps } from '@material-ui/core/Radio';
import Radio from '@material-ui/core/Radio';

// const GreenRadio = withStyles({
//   root: {
//     color: green[400],
//     '&$checked': {
//       color: green[600],
//     },
//   },
//   checked: {},
// })((props: RadioProps) => <Radio color="default" {...props} />);

export default function RadioButtons(props: { selectedValue: number }) {
  // const [selectedValue, setSelectedValue] = React.useState('a');
  //
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedValue(event.target.value);
  // };
  // const handleChange = () => { };

  const { selectedValue } = props;

  return (
    <div>
      {Array.from(Array(5)).map((text, index) => (
        <Radio
          checked={selectedValue === index}
          disabled
          value={index}
          key={index}
          name="radio-button-demo"
          inputProps={{ 'aria-label': String.fromCharCode(65 + index) }}
        />
      ))}
    </div>
  );
}
