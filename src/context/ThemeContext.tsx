import { useState, useEffect, createContext, useContext, FC } from 'react';
import { mapDark, mapLight } from '../utils/mapStyles';

interface ThemeContextInterface {
  isDarkTheme: boolean;
  handleTheme: () => void;
  mapStyles: typeof mapDark | typeof mapLight;
}

type Theme = 'dark' | 'light';

export const ThemeContext = createContext({} as ThemeContextInterface);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeContextProvider');
  return context;
};

const ThemeContextProvider: FC = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<Theme>('dark');
  const [mapStyles, setMapStyles] = useState<typeof mapDark | typeof mapLight>(mapDark);

  const updateTheme = (theme: Theme) => {
    document.body.setAttribute('color-theme', theme);
    setMapStyles(theme === 'dark' ? mapDark : mapLight);
    setColorTheme(theme);
  };

  // THEME INITIALIZATION
  useEffect(() => {
    const theme = localStorage.getItem('color-theme');
    if (theme === 'dark') {
      updateTheme(theme);
    } else if (theme === 'light') {
      updateTheme(theme);
    }
  }, []);

  const handleTheme = () => {
    setColorTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      updateTheme(newTheme);
      localStorage.setItem('color-theme', newTheme);
      return newTheme;
    });
  };

  const isDarkTheme = colorTheme === 'dark';

  const themeContextValues = {
    isDarkTheme,
    handleTheme,
    mapStyles,
  };

  return <ThemeContext.Provider value={themeContextValues}>{children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
