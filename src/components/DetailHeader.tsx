import { useNav } from "../nav";
import Icon from "./Icon";

export default function DetailHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  const nav = useNav();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 16px 14px",
        flexShrink: 0,
      }}
    >
      <button className="press" onClick={nav.back} aria-label="Back" style={{ display: "flex" }}>
        <Icon name="chevronLeft" size={24} color="var(--body)" />
      </button>
      <div
        className="eyebrow"
        style={{ flex: 1, textAlign: "center", color: "var(--body)", fontSize: 12 }}
      >
        {title}
      </div>
      <div style={{ minWidth: 24, display: "flex", justifyContent: "flex-end" }}>{action}</div>
    </div>
  );
}
