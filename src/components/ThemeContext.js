import { createContext } from "react";

export const ThemeContext = createContext();

const ColorContext = ({ children, currentTheme, setCurrentTheme }) => {
  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ColorContext;
