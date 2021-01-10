import React from "react";
import { Box, Typography } from "@material-ui/core";
import Choices from "./Choices";

// export default function Problem(props: { currentSelection: number, problemDict: { problem: string, choices: string[] }, selections: number[], handleChoiceSelection: (i: number) => ((event: React.ChangeEvent<HTMLInputElement>) => void) }) {
//   const { currentSelection, problemDict, selections, handleChoiceSelection } = props;
//   if (currentSelection > 0) {
//     return (
//       // <Box>
//       //   <Typography variant='h5' align='center' className="header">Problem {currentSelection}</Typography>
//       //   <Typography dangerouslySetInnerHTML={{ __html: problemDict.problem }} ></Typography>
//       //   <Choices handleChange={handleChoiceSelection(currentSelection - 1)} selectedValue={selections[currentSelection - 1]} choices={problemDict.choices} />
//       // </Box >
//     );
//   } else {
//     return null;
//   }
// }
