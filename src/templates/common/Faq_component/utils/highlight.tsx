export default function highlight(text: string, query: string) {
  if (!query) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");

  return text.split(regex).reduce((acc: any[], part, i, arr) => {
    acc.push(part);

    if (i < arr.length - 1) {
      acc.push(
        <mark className="bg-yellow-200 px-1 rounded" key={i}>
          {query}
        </mark>
      );
    }
    return acc;
  }, []);
}
