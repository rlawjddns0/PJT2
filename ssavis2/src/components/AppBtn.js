import React from "react";
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Icon } from '../components';
import { Switch } from 'react-native';

const Container = styled.View`
    background-color: ${({ theme }) => theme.mainButtonBack};
    border-radius: 20px;
    align-items:center;
    padding: 10px;
    flex-direction:row;
    margin-top:30px;
    margin-left:30px;
    margin-right:30px;
    box-shadow: 0px 6px 6px grey; 
`;

const Title = styled.Text`
    
    font-size: 28px;
    color: ${({ theme }) => theme.mainButton};
    padding-left:5%;
    padding-bottom:5px;
    font-family: ${({ theme }) => theme.font};
    font-weight: bold;
`;

const AppBtn = ({uri, title, imgStyle, cStyle, appStatus, appStatusChange}) => {
    return (
        <Container style={cStyle}>
            <Icon url={uri} imageStyle={imgStyle}/>
            <Title>{title}</Title>
            <Switch style={{ position:'absolute', right:20}} value={appStatus} onValueChange={appStatusChange}/>
        </Container>
    );
};

AppBtn.propTypes = {
    title: PropTypes.string,
    imgStyle: PropTypes.object,
    cStyle: PropTypes.object,
};

export default AppBtn;