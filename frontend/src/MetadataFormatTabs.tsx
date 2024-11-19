import { useState } from 'react';
import MarkdownPreview from './MarkdownTextBox'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';


export interface TreeModel {
  id: string;
  label: string;
  children?: TreeModel[]
}

interface tabProps {
  tabValue?: number;
  format: string;
  setFormat: React.Dispatch<React.SetStateAction<string>>;
  markdown: string;
  tree: TreeModel[];
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

function TabTree( props: tabProps ) {
  // const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  //   {
  //     id: 'grid',
  //     label: 'Data Grid',
  //     children: [
  //       { id: 'grid-community', label: '@mui/x-data-grid' },
  //       { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
  //       { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
  //     ],
  //   },
  //   {
  //     id: 'pickers',
  //     label: 'Date and Time Pickers',
  //     children: [
  //       { id: 'pickers-community', label: '@mui/x-date-pickers' },
  //       { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
  //     ],
  //   },
  //   {
  //     id: 'charts',
  //     label: 'Charts',
  //     children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  //   },
  //   {
  //     id: 'tree-view',
  //     label: 'Tree View',
  //     children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  //   },
  // ];
  return (
    <div style={{ display: props.tabValue == 3 ? 'block' : 'none', padding: "1em" }}>
      <RichTreeView items={props.tree} />
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
        <Tab value={3} label="tree" />
      </Tabs>
    </Box>
    
    <TabFormat tabValue={tabValue} {...props}/>
    <TabOutput tabValue={tabValue} {...props}/>
    <TabTree tabValue={tabValue} {...props}/>
  </>
  );  
};