import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeType } from "@/contexts/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";
import { Label } from "./ui/label";

export default function ThemeDropDown() {
  const { currentTheme, setTheme, themeChoices } = useTheme();
  return (
    <Select onValueChange={(value) => setTheme(value as ThemeType)}>
      <Label htmlFor="theme-choice">Select Theme</Label>
      <SelectTrigger
        id="theme-choice"
        defaultValue={currentTheme}
        className="w-[180px] text-black">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {themeChoices.map((theme) => {
          return (
            <SelectItem value={theme} key={theme}>
              {theme}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
