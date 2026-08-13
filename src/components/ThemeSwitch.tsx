import { THEMES, THEME_LABEL, THEME_SHORT, useTheme } from "../theme";

/**
 * Direction switch. Deliberately styled as page chrome rather than app UI, and
 * positioned outside the phone frame, so nobody in a review mistakes it for part
 * of the product. Hidden once the phone goes full-bleed — on a real handset use
 * the ?theme= link instead.
 */
export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switch" role="group" aria-label="Design direction">
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          aria-pressed={theme === t}
          title={THEME_LABEL[t]}
        >
          {THEME_SHORT[t]}
        </button>
      ))}
    </div>
  );
}
