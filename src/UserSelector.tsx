import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

const filter = createFilterOptions<UserOptionType>();

interface UserOptionType {
  inputValue?: string;
  name: string;
  id?: number;
}

export default function UserSelector(props: {
  disabled: boolean;
  userList: UserOptionType[];
  setUserName: (userName: string) => void;
}) {
  return (
    <Autocomplete
      freeSolo
      className="auto-margin"
      id="username-selector"
      options={props.userList}
      onChange={(event, userName) => {
        if (typeof userName === "string") {
          props.setUserName(userName);
        } else if (userName && userName.inputValue) {
          props.setUserName(userName.inputValue);
        } else if (userName && userName.name) {
          props.setUserName(userName.name);
        }
      }}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose User"
          variant="outlined"
          required
        />
      )}
      disabled={props.disabled}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (
          params.inputValue !== "" &&
          !(filtered.length == 1 && filtered[0].name == params.inputValue)
        ) {
          filtered.push({
            inputValue: params.inputValue,
            name: `Add "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(option) => option.name}
    />
  );
}
