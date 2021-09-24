import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { Spinner } from '../components';
import { ProgressContext, UserContext } from '../contexts';
import MainStack from './MainStack';
import MainTab from './MainTab';
import PropTypes from 'prop-types';

const Navigation = ({darkModeValue ,onDarkModeChange}) => {
    const { inProgress } = useContext(ProgressContext);
    const { user } = useContext(UserContext);
    return (
        <NavigationContainer>
            {user?.uid && user?.email ? <MainTab darkMode={darkModeValue} onDarkModeChange={onDarkModeChange}/> : <AuthStack />}
            {inProgress && <Spinner />}
        </NavigationContainer>

    )
}

// Navigation.propTypes={
//     darkModeValue : PropTypes.boolean,
//     onDarkModeChange : PropTypes.func,
// }
export default Navigation;