interface JsonSyntaxHighlighterProps {
  json: any;
}

export default function JsonSyntaxHighlighter({ json }: JsonSyntaxHighlighterProps) {
  const syntaxHighlight = (obj: any) => {
    if (!obj) return "";
    
    const jsonStr = JSON.stringify(obj, null, 2);
    
    return jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
        (match) => {
          let cls = 'text-red-600'; // number
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'text-green-600'; // key
            } else {
              cls = 'text-blue-600'; // string
            }
          } else if (/true|false/.test(match)) {
            cls = 'text-amber-600'; // boolean
          } else if (/null/.test(match)) {
            cls = 'text-gray-600'; // null
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );
  };

  return (
    <pre className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: syntaxHighlight(json) }} />
  );
}
