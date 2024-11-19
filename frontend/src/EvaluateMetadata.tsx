
import Grid from '@mui/material/Grid2';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


interface EvalProps {
  nameOptions: string[],
  argument: string,
  setArgument: (value: React.SetStateAction<string>) => void,
  load: (inputInjector?: object) => Promise<void>,
  output: string,
}


export default function EvalAutocomplete(props: EvalProps) {
  return (
    <Grid container>
    <Grid size={6}>
      <Autocomplete
        freeSolo
        autoSelect
        options={props.nameOptions}
        inputValue={props.argument}
        onInputChange={(_event, newInputValue) => {
          props.setArgument(newInputValue);
        }}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            props.load({})
          }
        }}
        renderInput={(params: object) => (
          <TextField
            {...params}
            label=''
            margin="normal"
            variant="outlined"
          />
        )}
      />
    </Grid>
    <Grid size={6}>
        <p>{props.output}</p>
    </Grid>
    </Grid>
  );
}
