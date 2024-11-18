import { useState } from 'react';

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { apiGetVisits } from './Api';
import apiSender from './Api';


interface tabProps {
  tabValue?: number;
  datadir: string;
  setDatadir: React.Dispatch<React.SetStateAction<string>>;
  setScans: React.Dispatch<React.SetStateAction<string[]>>;
}


function TabFolders(props: tabProps) {
  return (
    <div style={{ display: props.tabValue == 2 ? 'block' : 'none', padding: "1em" }}>
    <Grid size={12}>
      <TextField
        required
        fullWidth
        label='Data Directory'
        value={props.datadir}
        onChange={(e) => props.setDatadir(e.target.value)}
        onKeyDown={(ev) => {
          console.log(`Pressed keyCode ${ev.key}`);
          if (ev.key === 'Enter') {
            apiSender({
              hostname: '/api/get-all-scans/',
              // inputs: { datadir: props.datadir},
              inputs: { datadir: props.datadir, filename: '', format: '', xaxis: '', yaxis: '' },
              setter: [(data) => props.setScans(data.list)]
            })({});
            // props.getScans();
            // ev.preventDefault();
          }
        }
      }
      />
    </Grid>
    </div>
  )
}


function TabVisit(props: tabProps) {
  const [instrument, setInstrument] = useState('');
  // const [visit, setVisit] = useState('');
  const [visits, setVisits] = useState<Record<string, string>> ({});
  const [visitList, setVisitList] = useState<string[]>([]);
  const years = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));
  const [year, setYear] = useState(years[0]);
  const instruments = ['I06-1', 'I06-2', 'I10-1', 'I10-2', 'I16', 'I21']

  function datadirUpdate(visitName: string | null, visitList: string[], year: string, instrument: string) {
    console.log('datadirUpdate:', visitName, (visitName && visitList.includes(visitName)))
    if (visitName && visitList.includes(visitName)) {
      console.log('visitName is good', props.datadir, visits)
      props.setDatadir(visits[visitName]);
      apiSender({
        hostname: '/api/get-all-scans/',
        // inputs: { datadir: visits[visitName] },
        inputs: { datadir: visits[visitName], filename: '', format: '', xaxis: '', yaxis: '' },
        setter: [(data) => props.setScans(data.list)]
      })({});
      setInstrument(instrument)
      setYear(year)
    }
  }

  return (
    <div style={{ display: props.tabValue == 1 ? 'block' : 'none'}}>
    <Grid container spacing={2} columns={12}>
      <Grid size={4}>
        <Autocomplete
          id="instrument"
          autoSelect
          options={instruments}
          // inputValue={instrument}
          // onInputChange={(_event, newInputValue) => {
          //   console.log('instrument onInputChange', newInputValue)
          //   setInstrument(newInputValue);
          // }}
          onChange={(_e, value) => {
            console.log('instrument onChange apiGetVisits', value, instrument, year)
            setInstrument(String(value));
            apiGetVisits({
              instrument: value,
              year: year,
              set_dict: setVisits,
              set_list: setVisitList,
            })() // why do I need this?
          }}
          renderInput={(params: object) => (
            <TextField
              {...params}
              label="Instrument"
              margin="normal"
              variant="outlined"
            />
          )}
        />
      </Grid>

      <Grid size={4}>
        <Autocomplete
          id="year"
          autoSelect
          options={years}
          defaultValue={years[0]}
          // inputValue={year}
          // onInputChange={(_event, newInputValue) => {
          //   console.log('year onInputChange', newInputValue)
          //   setYear(newInputValue);
          // }}
          onChange={(_e, value) => {
            console.log('year onChange', value, instrument, year)
            setYear(String(value))
            apiGetVisits({
              instrument: instrument,
              year: value,
              set_dict: setVisits,
              set_list: setVisitList,
            })()
          }}
          renderInput={(params: object) => (
            <TextField
              {...params}
              label="Year"
              margin="normal"
              variant="outlined"
            />
          )}
        />
      </Grid>

      <Grid size={4}>
        <Autocomplete
          id="visit"
          autoSelect
          options={visitList}
          // inputValue={visit}
          // onInputChange={(_event, newInputValue) => {
          //   console.log('visit onInputChange', newInputValue)
          //   setVisit(newInputValue);
          // }}
          onChange={(_event, value) => {
            console.log('visit onChange', value, instrument)
            // setVisit(String(value))
            datadirUpdate(value, visitList, year, instrument);
            console.log('visit onChange', value, instrument)
          }}
          renderInput={(params: object) => (
            <TextField
              {...params}
              label="Visit"
              margin="normal"
              variant="outlined"
            />
          )}
        />
      </Grid>
  </Grid>
  </div>
  )
}


export default function FolderChooser(props: tabProps) {
  const [tabValue, setTabValue] = useState(2);
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_e, newValue) => setTabValue(newValue)}
          // onChange={tabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="Instrument Visit" />
          <Tab value={2} label="Folder" />
        </Tabs>
      </Box>
      
      <TabFolders tabValue={tabValue} {...props}/>
      <TabVisit tabValue={tabValue} {...props}/>
    </>
  );  
};