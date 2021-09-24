import React, { useState,useEffect, useContext, useMemo } from 'react';
import { StatusBar, Image } from 'react-native';
import {lightTheme, darkTheme} from './theme';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import Navigation from './navigations';
import { images } from './utils/images';
// import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
//import TabNavigation from './navigations/Tab';
import { ProgressProvider, UserProvider, ThemeControllContext,ThemeControllProvider } from './contexts';
import { setCustomText } from 'react-native-global-props';
import { useFonts, NotoSansKR_400Regular,NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr';

const cacheImages = images => {
    return images.map(image => {
        if(typeof image === 'string'){
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
};
const cacheFont = fonts => {
    return fonts.map(font => Font.loadAsync(font));
};

const App = () => {
    const [isDark , setIsDark ] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const fontsLoaded = useFonts({
        NotoSansKR_400Regular,
        NotoSansKR_700Bold,
    })
    
    const _loadAssets = async () => {
        const imageAssets = cacheImages([require('../assets/backimg.png'),
        ...Object.values(images),
        ]);
        const fontAssets = cacheFont([]);

        await Promise.all([...imageAssets, ...fontAssets]);
    }
    return isReady && fontsLoaded ? (
        <ThemeControllProvider>
        <ThemeProvider theme = { isDark ? darkTheme : lightTheme}>
            <UserProvider>
                <ProgressProvider>
                    <StatusBar barStyle="dark-content" />
                    <Navigation darkModeValue={isDark} onDarkModeChange={() => setIsDark(!isDark) }/>
                </ProgressProvider>
            </UserProvider>
        </ThemeProvider>
        </ThemeControllProvider>
    ) : (
        <AppLoading 
            startAsync={_loadAssets}
            onFinish={()=> setIsReady(true)}
            onError={console.warn}
        />
    );
};

export default App;