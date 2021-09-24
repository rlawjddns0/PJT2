import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Channel, ChannelCreation, Main, AppControll,Cleaning} from '../screens';
import { LinearGradient } from 'expo-linear-gradient';
import { lightTheme } from '../theme';
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
                headerTintColor:theme.Maintext,
                headerTitleStyle:{
                    color:'white',
                    fontWeight:'bold',
                    fontSize:30,
                    shadowOpacity:0.5,
                    elevation:0.5,
                    shadowOffset:{
                        width:3,
                        height:3,
                    },
                    shadowColor:'black',
                    
                },
                headerStyle:{
                    height:150,
                },
                headerBackground: () => (
                    <LinearGradient colors={theme == lightTheme ? ['#A7F3CF','#92C5FC'] : ['#91CEAB','#77A0CB']} style={{ flex:1 }} start={{x: 0, y: 0}} end={{x: 0,y: 1}}/>
                )
            }}
        >
            <Stack.Screen name="Main" component={Main}  options={{headerShown:false}} />
            <Stack.Screen name="AppControll" component={AppControll} options={{headerTitle:"가전"}}/>
            <Stack.Screen name="Cleaning" component={Cleaning} options={{headerTitle:"청소"}}/>
            <Stack.Screen name="Channel Creation" component={ChannelCreation} />
            <Stack.Screen name="Channel" component={Channel}/>
        </Stack.Navigator>
    )
}

export default MainStack;