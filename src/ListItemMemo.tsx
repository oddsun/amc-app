import React from "react";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from "@material-ui/core/ListItemText";
import RadioButtons from "./RadioButtons";
import TextField from "@material-ui/core/TextField";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    borderHighlight: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.secondary.main,
      width: "100%",
    },

    borderNoHighlight: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
      width: "100%",
    },
  })
);

function ListItemMemo(props: {
  index: number;
  selected: boolean;
  selection: number | string;
  handleListItemClick: () => void;
  aime: boolean;
}) {
  const classes = useStyles();
  const item = React.useRef<HTMLDivElement>(null);

  // scroll into view
  React.useEffect(() => {
    // console.log('clicked')
    var rect = item?.current?.getBoundingClientRect();
    var viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    if (
      (rect as DOMRect).top < 64 ||
      (rect as DOMRect).bottom - viewHeight >= 0
    ) {
      item?.current?.scrollIntoView();
    }
  }, [props.selected]);

  // const handleChange = React.useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setName(event.target.value);
  //   },
  //   []
  // );

  return (
    <ListItem
      ref={item}
      divider
      button
      onClick={props.handleListItemClick}
      className={
        props.selected ? classes.borderHighlight : classes.borderNoHighlight
      }
    >
      <ListItemText primary={props.index + 1} />
      {props.aime ? (
        <TextField
          value={props.selection === undefined ? "" : props.selection}
          InputProps={{
            readOnly: true,
          }}
        />
      ) : (
        <RadioButtons selectedValue={props.selection as number} />
      )}
    </ListItem>
  );
}

export default React.memo(ListItemMemo);
