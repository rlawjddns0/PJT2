import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Meet, Settings } from '../screens/TabScreens';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator initialRouteName="Settings">
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Meet" component={Meet} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default TabNavigation;