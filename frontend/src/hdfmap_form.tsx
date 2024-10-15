import { FormEvent, useState } from 'react';
import MarkdownPreview from './MarkdownTextBox';


const [response, setResponse] = useState('');


function handleSubmit(e: FormEvent<HTMLFormElement>) {
  // Prevent the browser from reloading the page
  e.preventDefault();

  // Read the form data
  const form = e.currentTarget;
  const formData = new FormData(form);
  console.log(formData);

  // You can pass formData as a fetch body directly:
  const hostname = '/api/get-scan/'
  fetch(
    hostname, 
    { method: form.method, body: formData }
  );

  // Or you can work with it as a plain object:
  const formJson = Object.fromEntries(formData.entries());
  console.log(formJson);
  setResponse(formJson.response.toString);
}


export function HdfMapForm() {
  
  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Data directory:
        <input 
          name="dataDirectory"
          defaultValue="data"
        />
      </label>
      <label>
        File specifier:
        <input 
          name="fileSpecifier"
          defaultValue="%d.nxs"
        />
      </label>
      <label>
        Scan number:
        <input 
          type="number"
          name="scanNumber"
        />
      </label>
      <label>
        Output format:
        <textarea 
          name="outputFormat"
          defaultValue="{filename}\n{scan_command}"
          rows={4} cols={40}
        />
      </label>
    </form>
  );  
};

export function HdfMapResponse() {
  return (
    <section>
        <MarkdownPreview markdown={response} />
    </section>
  )
};