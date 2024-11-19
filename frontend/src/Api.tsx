

interface apiGet {
  response: string,
  list: string[],
  xdata: [],
  ydata: [],
  xlabel: string,
  ylabel: string,
  data: object,
  tree: [],
  evalOutput: string,
}
  
interface apiSenderProps {
  hostname: string;
  inputs: object;
  setter: Array<(event: apiGet) => void>;
};
  
export default function apiSender(props: apiSenderProps) {
  // console.log('Creating apiSender to host: ', props.hostname, ' with inputs ', props.inputs)
  return async (inputInjector: object = {}) => {
    console.log('running apiSender to host: ', props.hostname, 'inputs:', props.inputs)
    const res = await fetch(props.hostname, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.assign(props.inputs, inputInjector)),
    });
    console.log(res)
    const data = await res.json();
    console.log(data)
    for (let i = 0; i < props.setter.length; i++) {
      props.setter[i](data);
    }
    console.log('Completed apiSender to host: ', props.hostname)
  };
};


interface apiGetVisitProps {
  instrument: string | null;
  year: string | null;
  set_dict: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  set_list: React.Dispatch<React.SetStateAction<string[]>>;
};

export function apiGetVisits(props: apiGetVisitProps) {
  return async () => {
    console.log('fetch:', "/api/" + props.instrument + "/" + props.year)
    const res = await fetch("/api/" + props.instrument + "/" + props.year, {
      method: 'GET'
    });
    console.log('response:', res)
    const data = await res.json();
    console.log('json data:', data)
    props.set_dict(data)
    props.set_list(Object.keys(data))
  };
};