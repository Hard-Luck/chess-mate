import { ThemeType } from "@/contexts/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeDropDown() {
  const { setTheme, themeChoices, currentTheme } = useTheme();
  return (
    <div className="bg-white flex flex-col w-40 text-center">
      <label htmlFor="theme">Pick theme</label>
      <select
        id="theme"
        defaultValue={currentTheme}
        onChange={(e) => setTheme(e.target.value as ThemeType)}>
        {themeChoices.map((choice) => (
          <option className="text-end" key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </select>
    </div>
  );
}
