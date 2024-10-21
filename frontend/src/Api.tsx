

interface apiGet {
  response: string,
  list: string[],
  xdata: [],
  ydata: [],
  xlabel: string,
  ylabel: string,
  data: {}
}
  
interface apiSenderProps {
  hostname: string;
  inputs: any;
  setter: Array<(event: apiGet) => void>;
};
  
export default function apiSender(props: apiSenderProps) {
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