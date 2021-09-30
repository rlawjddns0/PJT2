import React,{ useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Main, Mode, Settings,Voice } from '../screens';
import { ThemeContext } from 'styled-components/native';
import {Ionicons} from '@expo/vector-icons';
import MainStack from './MainStack';
import PropTypes from 'prop-types';
const Tab = createBottomTabNavigator(
);

const MainTab = ({onDarkModeChange, darkMode}) => {
    const theme = useContext(ThemeContext);
    return (
        <Tab.Navigator 
        screenOptions={{
            tabBarShowLabel:false,
            tabBarStyle: {
                backgroundColor: theme.tabBackground,
                
            }
        }}>
            <Tab.Screen 
                name="MainStack" 
                component={MainStack} 
                options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <Ionicons
                        name="ios-home"
                        style={{ color: focused ? theme.tabIconFocused : theme.tabIcon}}
                        size={30}
                        />
                    )
                }}
            />
            <Tab.Screen name="Mode" component={Mode} 
            options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons
                        name="ios-location"
                        style={{ color: focused ? theme.tabIconFocused : theme.tabIcon}}
                        size={30}
                        />
                    )
                }}
            />
            <Tab.Screen name="Voice" component={Voice}
            options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons
                        name="mic"
                        style={{ color: focused ? theme.tabIconFocused : theme.tabIcon}}
                        size={30}
                        />
                    )
                }}
            />
            <Tab.Screen name="Settings" 
            children={() =><Settings DarkModeChange={onDarkModeChange} darkModeValue={darkMode} />}
            
            options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons
                        name="ios-settings"
                        style={{ color: focused ? theme.tabIconFocused : theme.tabIcon}}
                        size={30}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

// MainTab.propTypes={
//     darkMode : PropTypes.boolean,
//     onDarkModeChange : PropTypes.func,
// }
export default MainTab;