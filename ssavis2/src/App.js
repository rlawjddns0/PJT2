import React, { useState} from 'react';
import {lightTheme, darkTheme} from './theme';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import TabNavigation from './navigations/Tab';

const App = () => {
    const [isDark, setIsDark] = useState(false);
    // const _toggleSwitch = () => {
    //     setIsDark(!isDark);
    // }
    return (
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <NavigationContainer>
                <TabNavigation />
            </NavigationContainer>
        </ThemeProvider>
    )
}

export default App;