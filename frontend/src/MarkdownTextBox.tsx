
// https://react.dev/reference/react-dom/components/textarea

// import { Remarkable } from 'remarkable';
import { MuiMarkdown } from 'mui-markdown'

// const md = new Remarkable();

// export default function MarkdownPreview({ markdown }: { markdown: string }) {
//   const renderedHTML = md.render(markdown);
//   return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
// }

export default function MarkdownPreview({ markdown }: { markdown: string }) {
  return <MuiMarkdown>{markdown}</MuiMarkdown>
}