import { ThemeType } from "@/contexts/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeDropDown() {
  const { setTheme, themeChoices, currentTheme } = useTheme();
  return (
    <div className="flex flex-col">
      <label className="text-center" htmlFor="theme">
        Pick theme
      </label>
      <select
        id="theme"
        className="bg-green-500 text-center rounded-lg m-2 p-2 "
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
