import { useState } from 'react';
import FolderChooser from './FolderChoice'
import MetadataTabs from './MetadataFormatTabs';
import { Plots } from './Plots';
import AxisChooser from './AxisChoice';
import ScanChooser from './ScanChoice';
import apiSender from './Api';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';


export function GetHdfMap() {
  const [datadir, setDatadir] = useState('');
  const [scanFile, setScanFile] = useState('');
  const [scanFiles, setScanFiles] = useState<string[]>([]);
  const [format, setFormat] = useState('### {filename}\n\n{start_time}\n\ncmd = *{scan_command}*');
  const [response, setResponse] = useState('### file.nxs\n\ntime\n\ncmd = *none*');
  const [xAxis, setXAxis] = useState('axes0');
  const [yAxis, setYAxis] = useState('signal');
  const [axesOptions, setAxesOptions] = useState(['axes0', 'signal']);
  const [xdata, setXdata] = useState([]);
  const [ydata, setYdata] = useState([]);
  const [xlabel, setXlabel] = useState('');
  const [ylabel, setYlabel] = useState('');

  const lastScan = apiSender({
    hostname: '/api/get-last-scan/',
    inputs: { datadir: datadir, filename: '', format: '', xaxis: '', yaxis: '' },
    setter: [(data) => setScanFile(data.response)]
  })
  // const allScans = apiSender({
  //   hostname: '/api/get-all-scans/',
  //   inputs: { datadir: datadir, filename: '', format: '', xaxis: '', yaxis: '' },
  //   setter: [(data) => setScanFiles(data.list)]
  // })
  // const getMetadata = apiSender({
  //   hostname: '/api/get-scan-format/' ,
  //   inputs: {datadir: datadir, filename: scanFile, format: format, xaxis: '', yaxis: ''}, 
  //   setter: [(data) => setResponse(data.response)]
  // })
  
  const getPlotData = apiSender({
    hostname: '/api/get-scan-data/'  ,
    inputs: {
      datadir: datadir, 
      filename: scanFile, 
      format: format, 
      xaxis: xAxis, 
      yaxis: yAxis
    }, 
    setter: [
      (data) => setResponse(data.response),
      (data) => setXdata(data.xdata),
      (data) => setYdata(data.ydata),
      (data) => setXlabel(data.xlabel),
      (data) => setYlabel(data.ylabel),
      (data) => setAxesOptions(Object.keys(data.data))
    ]
  })
 
  // function loadData() {
  //   // getMetadata();
  //   getPlotData();
  // }

  return (
    <Container maxWidth="xl">
    <Grid container spacing={2}>
      <Grid size={6}> 
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <FolderChooser datadir={datadir} setDatadir={setDatadir} setScans={setScanFiles}/>
          </Grid>

          <Grid size={12}>
            <ScanChooser
              filename={scanFile}
              setFilename={setScanFile}
              filenames={scanFiles}
              latest={lastScan}
              load={getPlotData}
            />
          </Grid>
          
          <Grid size={12}>
            <AxisChooser 
              axesOptions={axesOptions}
              xAxis={xAxis}
              yAxis={yAxis}
              setXAxis={setXAxis}
              setYAxis={setYAxis}
            />
          </Grid>
        </Grid>
      </Grid>
        
      <Grid size={6}>
        <MetadataTabs format={format} setFormat={setFormat} markdown={response} setMarkdown={setResponse}/>
        <Plots xdata={xdata} xlabel={xlabel} ydata={ydata} ylabel={ylabel} />
      </Grid>
    </Grid>
    </Container>
  );  
};