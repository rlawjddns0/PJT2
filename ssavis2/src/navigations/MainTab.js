import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Main, Mode, Settings } from '../screens';
import {Ionicons} from '@expo/vector-icons';
import MainStack from './MainStack';
const Tab = createBottomTabNavigator(
);

const MainTab = () => {
    return (
        <Tab.Navigator 
        screenOptions={{
            tabBarShowLabel:false
        }}>
            <Tab.Screen 
                name="MainStack" 
                component={MainStack} 
                options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <Ionicons
                        name="ios-home"
                        style={{ color: focused ? "#A7F3D0" : "#404040"}}
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
                        style={{ color: focused ? "#A7F3D0" : "#404040"}}
                        size={30}
                        />
                    )
                }}
            />
            <Tab.Screen name="Settings" component={Settings} 
            options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons
                        name="ios-settings"
                        style={{ color: focused ? "#A7F3D0" : "#404040"}}
                        size={30}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTab;