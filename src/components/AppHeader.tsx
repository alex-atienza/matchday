import { useTheme } from "../theme";

export default function AppHeader({ kicker, title }: { kicker: string; title: string }) {
  const { setPickerOpen } = useTheme();

  return (
    <div className="app-header">
      <div>
        <div className="kicker">{kicker}</div>
        <h1>{title}</h1>
      </div>
      {/* doubles as the prototype's direction picker */}
      <button className="avatar press" aria-label="Design direction" onClick={() => setPickerOpen(true)}>
        M
      </button>
    </div>
  );
}
