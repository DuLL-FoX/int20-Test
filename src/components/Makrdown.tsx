import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      className="space-y-3"
      components={{
        ul: (props) => <ul className="list-inside list-disc" {...props}></ul>,
        a: (props) => (
          <a className="text-red-500 underline" target="_blank" {...props}></a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
