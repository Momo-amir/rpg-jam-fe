"use client";

import React, { useEffect, useState } from "react";

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme, themes } from ".";
import { themeStorageKey } from "./shared";

type ThemeOption = (typeof themes)[number]["value"] | "auto";

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme();
  const [value, setValue] = useState<ThemeOption | "">("");

  useEffect(() => {
    const stored = localStorage.getItem(themeStorageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue((stored as ThemeOption) ?? "auto");
  }, []);

  const onChange = (next: string | null) => {
    if (!next || next === "auto") {
      setTheme(null);
      setValue("auto");
    } else {
      setTheme(next as Exclude<ThemeOption, "auto">);
      setValue(next as ThemeOption);
    }
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label='Select a theme' className='w-36'>
        <SelectValue placeholder='Theme' />
      </SelectTrigger>
      <SelectPopup className='w-36'>
        <SelectItem value='auto'>Auto</SelectItem>
        {themes.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
};
