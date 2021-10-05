import React, { useState, createContext } from 'react';
import {lightTheme,darkTheme} from '../theme';

const ThemeControllContext = createContext({
    isDark: false,
    dispatch: () => {},
});

const ThemeControllProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    
    const value = { isDark , dispatch: setIsDark };
    return <ThemeControllContext.Provider value={value}>{children}</ThemeControllContext.Provider>
};

//const ThemeControllConsumer = ThemeControllContext.Consumer;

// const ThemeControllContext = createContext({
//     theme: darkTheme,
//     dispatch: () => {},
// });

// const ThemeControllProvider = ({ children }) => {
//     const [theme, setTheme] = useState({});
//     const dispatch = (themes) => {
//         setTheme(themes);
//     };
//     const value = { theme, dispatch};
//     return <ThemeControllContext.Provider value={value}>{children}</ThemeControllContext.Provider>
// };

export { ThemeControllContext, ThemeControllProvider};
//export default ThemeControllContext;