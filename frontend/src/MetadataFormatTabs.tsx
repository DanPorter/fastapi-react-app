import { useState } from 'react';
import MarkdownPreview from './MarkdownTextBox'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


interface tabProps {
  format: string;
  setFormat: React.Dispatch<React.SetStateAction<string>>;
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}


export default function MetadataTabs(props: tabProps) {
  const [tabValue, setTabValue] = useState(2);


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
    
    <CustomTabPanel value={tabValue} index={1}>
      <TextField
          multiline
          label='Output format'
          value={props.format}
          onChange={(e) => props.setFormat(e.target.value)}
          rows={6} 
          fullWidth={true}
      />
    </CustomTabPanel>

    <CustomTabPanel value={tabValue} index={2}>
      <MarkdownPreview markdown={props.markdown} />
    </CustomTabPanel>
  </>
  );  
};