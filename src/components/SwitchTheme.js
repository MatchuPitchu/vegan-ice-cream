import { useThemeContext } from '../context/ThemeContext';
import classes from './SwitchTheme.module.css';

const SwitchTheme = () => {
  const { isDarkTheme, handleTheme } = useThemeContext();

  return (
    <button
      onClick={handleTheme}
      className={`${classes.switch} ${isDarkTheme ? classes.night : ''}`}
      aria-label='toggle dark light mode'
    >
      <div className={classes.moon}>
        <div className={classes.crater} />
        <div className={classes.crater} />
      </div>
      <div>
        <div className={`${classes.shape} ${classes.sm}`} />
        <div className={`${classes.shape} ${classes.sm}`} />
        <div className={`${classes.shape} ${classes.md}`} />
        <div className={`${classes.shape} ${classes.lg}`} />
      </div>
    </button>
  );
};

export default SwitchTheme;
