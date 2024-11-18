import { useState } from 'react';
import MarkdownPreview from './MarkdownTextBox'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


interface tabProps {
  tabValue?: number;
  format: string;
  setFormat: React.Dispatch<React.SetStateAction<string>>;
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}


function TabFormat( props: tabProps ) {
  return (
    <div style={{ display: props.tabValue == 1 ? 'block' : 'none', padding: "1em" }}>
      <TextField
          multiline
          label='Output format'
          value={props.format}
          onChange={(e) => props.setFormat(e.target.value)}
          rows={6} 
          fullWidth={true}
      />
    </div>
  )
}

function TabOutput( props: tabProps ) {
  return (
    <div style={{ display: props.tabValue == 2 ? 'block' : 'none', padding: "1em" }}>
      <MarkdownPreview markdown={props.markdown} />
    </div>
  )
}


export default function MetadataTabs(props: tabProps) {
  const [tabValue, setTabValue] = useState(2);
  return (
  <>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
          value={tabValue}
          onChange={(_e, newValue) => setTabValue(newValue)}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
      >
        <Tab value={1} label="format" />
        <Tab value={2} label="metadata" />
      </Tabs>
    </Box>
    
    <TabFormat tabValue={tabValue} {...props}/>
    <TabOutput tabValue={tabValue} {...props}/>
  </>
  );  
};