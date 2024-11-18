
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';


interface ScanProps {
  filename: string,
  setFilename: (value: React.SetStateAction<string>) => void,
  filenames: string[],
  latest: () => Promise<void>,
  load: (inputInjector?: object) => Promise<void>,
};


export default function ScanChooser(props: ScanProps) {
  return (
    <Grid container spacing={2} columns={12}>
      <Grid size={5}>
        <Autocomplete
          freeSolo
          autoSelect
          options={props.filenames}
          inputValue={props.filename}
          onInputChange={(_event, newInputValue) => {
            props.setFilename(newInputValue);
          }}
          onChange={(_e, value) => {
            console.log('ScanChooser onChange', value)
            props.setFilename(String(value))
            props.load({filename: String(value)})
          }}
          renderInput={(params: object) => (
            <TextField
              {...params}
              label='Scan File'
              defaultValue='*.nxs'
              margin="normal"
              variant="outlined"
            />
          )}
        />
      </Grid>

      <Grid size={2} display="flex" justifyContent="center" alignItems="center">
        <Button variant="outlined" onClick={props.latest} size="small">
          Latest
        </Button>
      </Grid>

      <Grid size="grow" display="flex" justifyContent="center" alignItems="center">
        <Button variant='contained' onClick={() => props.load({})} size="medium"  endIcon={<SendIcon />}>
          Load Scan
        </Button>
      </Grid>
    </Grid>
  );  
};