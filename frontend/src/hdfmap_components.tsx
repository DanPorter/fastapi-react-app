import { useState } from 'react';
import MarkdownPreview from './MarkdownTextBox'
// import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LineChart } from '@mui/x-charts';


interface LabelProps {
  mylabel: string;
  myplaceholder?: string;
  value: string;
  onchange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function TextLabel(props: LabelProps) {
  return (
    <TextField
      required
      fullWidth
      label={props.mylabel}
      defaultValue={props.myplaceholder}
      value={props.value}
      onChange={props.onchange}
    />
  );
};

function NumberLabel(props: LabelProps) {
  return (
    <TextField
      required
      fullWidth
      type='number'
      label={props.mylabel}
      defaultValue={props.myplaceholder}
      value={props.value}
      onChange={props.onchange}
    />
  );
};

interface apiGet {
  response: string,
}

interface apiSenderProps {
  hostname: string;
  inputs: any;
  // setter: Array<(event: React.SetStateAction<string>) => void>;
  setter: Array<(event: apiGet) => void>;
};

function apiSender(props: apiSenderProps) {
  return async () => {
    const res = await fetch(props.hostname, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.inputs),
    });
    console.log(res)
    const data = await res.json();
    console.log(data)
    for (let i = 0; i < props.setter.length; i++) {
      props.setter[i](data);
    }
  };
};


interface apiGetPlot extends apiGet {
  xdata: [],
  ydata: [],
  xlabel: string,
  ylabel: string,
  data: {}
}

interface apiSenderPropsPlot {
  hostname: string;
  inputs: any;
  // setter: Array<(event: React.SetStateAction<string>) => void>;
  setter: Array<(event: apiGetPlot) => void>;
};

function apiSenderPlot(props: apiSenderPropsPlot) {
  return async () => {
    console.log(props.inputs)
    const res = await fetch(props.hostname, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.inputs),
    });
    console.log(res)
    const data = await res.json();
    console.log(data)
    for (let i = 0; i < props.setter.length; i++) {
      props.setter[i](data);
    }
  };
};


export function GetHdfMap() {
  const [datadir, setDatadir] = useState('');
  const [fileFormat, setFileFormat] = useState('%d.nxs');
  const [scanno, setScanno] = useState('');
  const [format, setFormat] = useState('### {filename}\n\n{start_time}\n\ncmd = *{scan_command}*');
  const [response, setResponse] = useState('### file.nxs\n\ntime\n\ncmd = *none*');
  const [xAxis, setXAxis] = useState('axes0');
  const [yAxis, setYAxis] = useState('signal');
  const [axesOptions, setAxesOptions] = useState(['axes0', 'signal']);
  const [xdata, setXdata] = useState([]);
  const [ydata, setYdata] = useState([]);
  const [xlabel, setXlabel] = useState('');
  const [ylabel, setYlabel] = useState('');
  const [tabValue, setTabValue] = useState(2);

  const lastScan = apiSender({
    hostname: '/api/get-last-scan/',
    inputs: { datadir: datadir, filespec: fileFormat, scanno: 0, format: '', xaxis: '', yaxis: '' },
    setter: [(data) => setScanno(data.response)]
  })
  const getMetadata = apiSender({
    hostname: '/api/get-scan-format/' ,
    inputs: {datadir: datadir,filespec: fileFormat,scanno: scanno,format: format, xaxis: '', yaxis: ''}, 
    setter: [(data) => setResponse(data.response)]
  })
  const getPlotData = apiSenderPlot({
    hostname: '/api/get-scan-data/' ,
    inputs: {
      datadir: datadir,
      filespec: fileFormat,
      scanno: scanno,
      format: format,
      xaxis: xAxis,
      yaxis: yAxis
    }, 
    setter: [
      (data) => setXdata(data.xdata),
      (data) => setYdata(data.ydata),
      (data) => setXlabel(data.xlabel),
      (data) => setYlabel(data.ylabel),
      (data) => setAxesOptions(Object.keys(data.data))
    ]
  })

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
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
    <Container maxWidth="xl">
    <Grid container spacing={2}>
    <Grid size={6}> 
    <Grid container spacing={2} columns={12}>
      <Grid size={12}>
        <TextLabel
          mylabel='Data Directory'
          myplaceholder='/data/directory'
          value={datadir}
          onchange={(e) => setDatadir(e.target.value)}
        />
      </Grid>

      <Grid size={4}>
        <TextLabel
          mylabel='File specifier'
          myplaceholder='%d.nxs'
          value={fileFormat}
          onchange={(e) => setFileFormat(e.target.value)}
        />
      </Grid>
      <Grid size={4}>
        <NumberLabel
          mylabel='Scan number'
          value={scanno}
          onchange={(e) => setScanno(e.target.value)}
        />
      </Grid>
      <Grid size={4} display="flex" alignItems="center">
        <Button variant="outlined" onClick={lastScan}>Latest</Button>
      </Grid>

      <Grid size={6}>
        <Button fullWidth variant='contained' onClick={getMetadata}>Get Scan info</Button>
      </Grid>
      <Grid size={6}>
        <Button fullWidth variant='contained' onClick={getPlotData}>Get Scan Plot</Button>
      </Grid>
      <Grid size={12}>
        <Autocomplete
          id="xaxis"
          freeSolo
          autoSelect
          options={axesOptions}
          inputValue={xAxis}
          onInputChange={(_event, newInputValue) => {
            setXAxis(newInputValue);
          }}
          renderInput={(params: object) => (
            <TextField
              {...params}
              label="x-axis"
              margin="normal"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid size={12}>
        <Autocomplete
          id="yaxis"
          freeSolo
          autoSelect
          options={axesOptions}
          inputValue={yAxis}
          onInputChange={(_event, newInputValue) => {
            setYAxis(newInputValue);
          }}
          renderInput={(params: object) => (
            <TextField
              {...params}
              label="y-axis"
              margin="normal"
              variant="outlined"
            />
          )}
        />
      </Grid>
    </Grid>
    </Grid>
      
    <Grid size={6}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_e, newValue) => setTabValue(newValue)}
          // onChange={tabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="format" />
          <Tab value={2} label="metadata" />
        </Tabs>
      </Box>
      
      <CustomTabPanel value={tabValue} index={1}>
        <TextField
          multiline
          label='Output format'
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          rows={6} 
          fullWidth={true}
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={2}>
        <MarkdownPreview markdown={response} />
      </CustomTabPanel>

      <LineChart
        xAxis={[{ data: xdata, label: xlabel }]}
        series={[{ data: ydata, label: ylabel }]}
        yAxis={[{valueFormatter: (value: number, _context) => (Math.abs(value) > 1e4) ? value.toExponential() : value.toString()}]}
        width={700}
        height={300}
        margin={{ left: 60, top: 10, right: 20 }}
        slotProps={{ legend: { position: { vertical: 'top', horizontal: 'right' } } }}
      />
    </Grid>
    </Grid>
    </Container>
  );  
};