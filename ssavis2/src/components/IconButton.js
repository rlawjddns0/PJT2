import React from "react";
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Icon } from '../components';

const Container = styled.TouchableOpacity`
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

const IconButton = ({uri, title, onPress, imgStyle}) => {
    return (
        <Container onPress={onPress}>
            <Icon url={uri} imageStyle={imgStyle}/>
            <Title>{title}</Title>
        </Container>
    );
};

IconButton.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
};

export default IconButton;