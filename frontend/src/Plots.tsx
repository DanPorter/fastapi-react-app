
import { LineChart } from '@mui/x-charts';


// interface apiGetPlot {
//   response: string,
//   xdata: [],
//   ydata: [],
//   xlabel: string,
//   ylabel: string,
//   data: {}
// }

// interface apiSenderProps {
//   hostname: string;
//   inputs: any;
//   setter: Array<(event: apiGetPlot) => void>;
// };

// function apiSender(props: apiSenderProps) {
//   return async () => {
//     console.log('Plots apiSender')
//     console.log(props.inputs)
//     const res = await fetch(props.hostname, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(props.inputs),
//     });
//     console.log(res)
//     const data = await res.json();
//     console.log(data)
//     for (let i = 0; i < props.setter.length; i++) {
//       props.setter[i](data);
//     }
//   };
// };

// interface getPlotDataProps {
//   datadir: string,
//   filename: string,
//   xaxis: string,
//   yaxis: string,
//   format: string,
//   setters: Array<(event: apiGetPlot) => void>,
// };

// export function PlotDataGetter(props: getPlotDataProps) {
//   console.log('Creating plot apiSender')
//   return apiSender({
//     hostname: '/api/get-scan-data/' ,
//     inputs: {
//       datadir: props.datadir,
//       filename: props.filename,
//       format: props.format,
//       xaxis: props.xaxis,
//       yaxis: props.yaxis
//     }, 
//     setter: props.setters
//   })
// };

interface PlotProps {
  xdata: number[],
  xlabel: string,
  ydata: number[],
  ylabel: string
}

export function Plots(props: PlotProps) {
  return ( 
    <>
      <LineChart
        xAxis={[{ data: props.xdata, label: props.xlabel }]}
        series={[{ data: props.ydata, label: props.ylabel }]}
        yAxis={[{valueFormatter: (value: number, _context) => (Math.abs(value) > 1e4) ? value.toExponential() : value.toString()}]}
        width={700}
        height={300}
        margin={{ left: 60, top: 10, right: 20 }}
        slotProps={{ legend: { position: { vertical: 'top', horizontal: 'right' } } }}
      />
    </>
  );  
};