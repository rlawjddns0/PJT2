import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Mode from '../screens/Mode';
import Settings from '../screens/Settings';
import {Ionicons} from '@expo/vector-icons';

const Tab = createBottomTabNavigator(
);

const TabNavigation = () => {
    return (
        <Tab.Navigator 
        screenOptions={{
            tabBarShowLabel:false
        }}>
            <Tab.Screen 
                name="Home" 
                component={Home} 
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

export default TabNavigation;