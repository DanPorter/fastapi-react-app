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
  datadir: string;
  setDatadir: React.Dispatch<React.SetStateAction<string>>;
  setScans: React.Dispatch<React.SetStateAction<string[]>>;
}


function TabFolders(props: tabProps) {
  return (
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
            })();
            // props.getScans();
            // ev.preventDefault();
          }
        }}
      />
    </Grid>
  )
}


function TabVisit(props: tabProps) {
  const [instrument, setInstrument] = useState('');
  const [visit, setVisit] = useState('');
  const [visits, setVisits] = useState<Record<string, string>> ({});
  const [visitList, setVisitList] = useState<string[]>([]);
  const years = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));
  const [year, setYear] = useState(years[-1]);
  const instruments = ['I06-1', 'I06-2', 'I10-1', 'I10-2', 'I16', 'I21']

  function datadirUpdate(visitName: string | null, visitList: string[]) {
    console.log('datadirUpdate:', visitName, (visitName && visitList.includes(visitName)))
    if (visitName && visitList.includes(visitName)) {
      props.setDatadir(visits[visitName]);
      apiSender({
        hostname: '/api/get-all-scans/',
        // inputs: { datadir: visits[visitName] },
        inputs: { datadir: visits[visitName], filename: '', format: '', xaxis: '', yaxis: '' },
        setter: [(data) => props.setScans(data.list)]
      })();
    }
  }

  return (
    <Grid container spacing={2} columns={12}>
      <Grid size={4}>
        <Autocomplete
          id="instrument"
          freeSolo
          autoSelect
          options={instruments}
          inputValue={instrument}
          onInputChange={(_event, newInputValue) => {
            setInstrument(newInputValue);
          }}
          onChange={(_e, value) => {
            console.log('apiGetVisits')
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
          freeSolo
          autoSelect
          options={years}
          defaultValue={years[0]}
          inputValue={year}
          onInputChange={(_event, newInputValue) => {
            setYear(newInputValue);
          }}
          onChange={(_e, value) => {
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
          inputValue={visit}
          onInputChange={(_event, newInputValue) => {
            setVisit(newInputValue);
          }}
          onChange={(_event, value) => {
            console.log('visit onChange', value)
            datadirUpdate(value, visitList);
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
  )
}


export default function FolderChooser(props: tabProps) {
  const [tabValue, setTabValue] = useState(2);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function CustomTabPanel(tprops: TabPanelProps) {
    const { children, value, index, ...other } = tprops;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

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
      
      <CustomTabPanel value={tabValue} index={2}>
        <TabFolders datadir={props.datadir} setDatadir={props.setDatadir} setScans={props.setScans}/>
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <TabVisit datadir={props.datadir} setDatadir={props.setDatadir} setScans={props.setScans}/>
      </CustomTabPanel>
    </>
  );  
};