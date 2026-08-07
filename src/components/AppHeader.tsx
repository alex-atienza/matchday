export default function AppHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="app-header">
      <div>
        <div className="kicker">{kicker}</div>
        <h1>{title}</h1>
      </div>
      <div className="avatar">M</div>
    </div>
  );
}
