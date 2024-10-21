
import Grid from '@mui/material/Grid2';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


interface AxisProps {
  axesOptions: string[],
  axis: string,
  setAxis: (value: React.SetStateAction<string>) => void,
  label: string,
}


function AxisAutocomplete(props: AxisProps) {
  return (
    <Grid size={12}>
      <Autocomplete
        freeSolo
        autoSelect
        options={props.axesOptions}
        inputValue={props.axis}
        onInputChange={(_event, newInputValue) => {
          props.setAxis(newInputValue);
        }}
        renderInput={(params: object) => (
          <TextField
            {...params}
            label={props.label}
            margin="normal"
            variant="outlined"
          />
        )}
      />
    </Grid>
  );
}

interface AllAxisProps {
  axesOptions: string[],
  xAxis: string,
  setXAxis: (value: React.SetStateAction<string>) => void,
  yAxis: string,
  setYAxis: (value: React.SetStateAction<string>) => void,
}

export default function AxisChooser(props: AllAxisProps) {
  return (
    <>
      <AxisAutocomplete 
        axesOptions={props.axesOptions}
        axis={props.xAxis}
        setAxis={props.setXAxis}
        label='x-axis'
      />
      <AxisAutocomplete 
        axesOptions={props.axesOptions}
        axis={props.yAxis}
        setAxis={props.setYAxis}
        label='y-axis'
      />
    </>
  );  
};