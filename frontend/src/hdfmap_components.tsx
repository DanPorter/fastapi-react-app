import { useState } from 'react';
import FolderChooser from './FolderChoice'
import MetadataTabs from './MetadataFormatTabs';
import { Plots } from './Plots';
import { DvDPlots } from './DavidiaPlots';
import AxisChooser from './AxisChoice';
import EvalAutocomplete from './EvaluateMetadata';
import ScanChooser from './ScanChoice';
import apiSender from './Api';
import { TreeModel } from './MetadataFormatTabs'

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
  const [tree, setTree] = useState<TreeModel[]>([]);
  const [nameOptions, setNameOptions] = useState<string[]>([])
  const [argument, setArgument] = useState('metadata')
  const [evalOutput, setEvalOutput] = useState('')


  const lastScan = apiSender({
    hostname: '/api/get-last-scan/',
    inputs: { datadir: datadir, filename: '', format: '', xaxis: '', yaxis: '', evalArg: ''},
    setter: [(data) => setScanFile(data.response)]
  })

  const getPlotData = apiSender({
    hostname: '/api/get-scan-data/'  ,
    inputs: {
      datadir: datadir, 
      filename: scanFile, 
      format: format, 
      xaxis: xAxis, 
      yaxis: yAxis,
      evalArg: argument,
    }, 
    setter: [
      (data) => setResponse(data.response),
      (data) => setXdata(data.xdata),
      (data) => setYdata(data.ydata),
      (data) => setXlabel(data.xlabel),
      (data) => setYlabel(data.ylabel),
      (data) => setAxesOptions(Object.keys(data.data)),
      (data) => setTree(data.tree),
      (data) => setEvalOutput(data.evalOutput),
      (data) => setNameOptions(Object.keys(data.data))
    ]
  })

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
              load={getPlotData}
            />
          </Grid>

          <Grid size={12}>
            <EvalAutocomplete 
              nameOptions={nameOptions}
              argument={argument}
              setArgument={setArgument}
              load={getPlotData}
              output={evalOutput}
            />
          </Grid>
        </Grid>
      </Grid>
        
      <Grid size={6}>
        <h1>{scanFile}</h1>
        <DvDPlots />
        <Plots xdata={xdata} xlabel={xlabel} ydata={ydata} ylabel={ylabel} />
        <MetadataTabs format={format} setFormat={setFormat} markdown={response} tree={tree}/>
      </Grid>
    </Grid>
    </Container>
  );  
};