import React from "react";
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Icon } from '../components';

const Container = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.mainButtonBack};
    align-items: center;
    justify-content:center;
    border-radius: 20px;
    flex : 1;
    padding: 10px;
    margin:10px;
    box-shadow: 0px 6px 6px grey; 
    elevation: 4;
`;

const Title = styled.Text`
    
    font-size: 28px;
    color: ${({ theme }) => theme.mainButton};
    padding-bottom:5px;
    font-family: ${({ theme }) => theme.font};
    font-weight: bold;
`;

const MainButton = ({uri, title, onPress, imgStyle}) => {
    return (
        <Container onPress={onPress}>
            <Icon url={uri} imageStyle={imgStyle}/>
            <Title>{title}</Title>
        </Container>
    );
};

MainButton.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
};

export default MainButton;