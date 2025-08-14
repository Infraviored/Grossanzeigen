export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
  const res = await fetch(`${apiUrl}/policies/terms`, { cache: 'no-store' });
  const md = await res.text();
  return (
    <main className="prose mx-auto p-6">
      <article>
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }} />
      </article>
    </main>
  );
}

function markdownToHtml(markdown: string): string {
  const escaped = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<p></p>')
    .replace(/\n/g, '<br/>');
}


