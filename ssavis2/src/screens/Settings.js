import React, { useState,useContext } from 'react';
import styled from 'styled-components/native';
import { ThemeContext } from 'styled-components/native';
import { Switch } from 'react-native';
import { lightTheme, darkTheme} from '../theme';
import { ThemeControllContext } from '../contexts'
import PropTypes from 'prop-types';
const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const StyledText = styled.Text`
    font-size: 30px;
`;

export const Settings = ({DarkModeChange, darkModeValue}) => {
    
    

    return (
        <Container>
            <Switch value={darkModeValue} onValueChange={DarkModeChange}/>
            <StyledText>Settings</StyledText>
        </Container>
    )
}

// Settings.propTypes={
//     DarkModeChange : PropTypes.func,
//     darkModeValue : PropTypes.boolean,
// }

export default Settings;