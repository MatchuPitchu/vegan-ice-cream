import { useState, useEffect, createContext, useContext, FC } from 'react';
import { mapDark, mapLight } from '../utils/mapStyles';

interface ThemeContextInterface {
  isDarkTheme: boolean;
  handleTheme: () => void;
  mapStyles: typeof mapDark | typeof mapLight;
}

export const ThemeContext = createContext({} as ThemeContextInterface);

// custom hook to check whether you are inside a provider AND it returns context data object
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeContextProvider');
  return context;
};

const ThemeContextProvider: FC = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [mapStyles, setMapStyles] = useState<typeof mapDark | typeof mapLight>(mapLight);

  // THEME INITIALIZATION
  useEffect(() => {
    const darkSelected =
      localStorage.getItem('themeSwitch') !== null &&
      localStorage.getItem('themeSwitch') === 'dark';
    if (darkSelected) {
      document.body.setAttribute('color-theme', 'dark');
      setMapStyles(mapDark);
      setIsDarkTheme(true);
    } else {
      document.body.setAttribute('color-theme', 'light');
      setMapStyles(mapLight);
      setIsDarkTheme(false);
    }
  }, []);

  const handleTheme = () => {
    setIsDarkTheme((prev) => !prev);
    if (!isDarkTheme) {
      document.body.setAttribute('color-theme', 'dark');
      setMapStyles(mapDark);
      localStorage.setItem('themeSwitch', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
      setMapStyles(mapLight);
      localStorage.removeItem('themeSwitch');
    }
  };

  const themeContextValues = {
    isDarkTheme,
    handleTheme,
    mapStyles,
  };

  return <ThemeContext.Provider value={themeContextValues}>{children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
