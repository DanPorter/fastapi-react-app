import ndarray from 'ndarray';
import {
    GlyphType,
    // LineData,
    // LineParams,
    NDT,
    LineParams,
    LinePlotProps,
    LinePlot,
    // PlotConfig,
  } from '@diamondlightsource/davidia';


// interface myPlotProps {
//     xdata: number[],
//     xlabel: string,
//     ydata: number[],
//     ylabel: string
// }

// export function DvDPlots(props: myPlotProps) {
//     console.log(props)

//     var xdata = ndarray(new Float32Array(props.xdata))
//     var ydata = ndarray(new Float32Array(props.ydata))
//     if (xdata.size == 0) {
//         xdata = ndarray(new Float32Array([1, 2, 3, 4, 5]))
//         ydata = ndarray(new Float32Array([1, 2, 3, 4, 5]))
//     }
//     console.log(xdata, ydata)
//     return ( 
//         <>
//         <LinePlot
//             lineData={[
//                 {
//                     defaultIndices: false,
//                     key: 'squares',
//                     lineParams: {
//                         name: props.ylabel,
//                         colour: 'purple',
//                         pointSize: 4,
//                         lineOn: true,
//                         glyphType: GlyphType.Circle,
//                     },
//                     x: xdata,
//                     xDomain: [Math.min(...props.xdata), Math.max(...props.xdata)],
//                     y: ydata,
//                     yDomain: [Math.min(...props.ydata), Math.max(...props.ydata)]
//                 }
//             ]}
//             plotConfig={{
//                 title: 'Sample Line Plot',
//                 xLabel: props.xlabel,
//                 yLabel: props.ylabel
//             }}
//         />
//         </>
//     );  
// };


export function DvDPlots() {
    // console.log(props)
    const x = ndarray(new Float32Array([1, 2, 3, 4, 6, 10])) as NDT;
    const y = ndarray(new Float32Array([1, 4, 9, 16, 36, 100])) as NDT;
    const lineProps = {
      plotConfig: {
        title: 'Sample Line Plot',
        xLabel: 'x-axis',
        yLabel: 'y-axis',
      },
      lineData: [
        {
          key: 'squares',
          lineParams: {
            colour: 'purple',
            pointSize: 6,
            lineOn: true,
            glyphType: GlyphType.Square,
          } as LineParams,
          x,
          xDomain: [1, 10],
          y,
          yDomain: [1, 100],
          defaultIndices: false,
        },
      ],
      xDomain: [0, 11],
      yDomain: [0, 101],
    } as LinePlotProps;
    // const linePropsNoSelection = { ...lineProps };
    return (
      <div style={{ display: 'grid', height: '80vh' }}>
        <LinePlot {...lineProps} updateSelection={null} />
      </div>
    );
};
