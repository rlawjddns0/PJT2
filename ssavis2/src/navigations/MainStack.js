import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Channel, ChannelCreation, Main} from '../screens';
// import MainTab from './MainTab';

const Stack = createStackNavigator();

const MainStack = () => {
    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator
        
            screenOptions={{
                headerTitleAlign: 'center',
                cardStyle: { backgroundColor: theme.backgroundColor},
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Channel Creation" component={ChannelCreation} />
            <Stack.Screen name="Channel" component={Channel}/>
        </Stack.Navigator>
    )
}

export default MainStack;