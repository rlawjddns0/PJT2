import React,{useContext} from "react";
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Icon } from '../components';
import {Ionicons} from '@expo/vector-icons';
import { ThemeContext } from 'styled-components/native';
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
    elevation:4;
`;

const Title = styled.Text`
    
    font-size: 28px;
    color: ${({ theme }) => theme.mainButton};
    padding-left:5%;
    padding-bottom:5px;
    font-family: ${({ theme }) => theme.font};
    font-weight: bold;
`;

const IconButton = ({uri, title, onPress, imgStyle, cStyle, appS, status}) => {
    const theme = useContext(ThemeContext);
    return (
        <Container onPress={onPress} style={cStyle}>
            <Icon url={uri} imageStyle={imgStyle}/>
            <Title>{title}</Title>
        {appS && !status && <Ionicons name="chevron-down-outline" style={{ position:'absolute', right:20, color:theme.Maintext}} size={30} />}
        {appS && status && <Ionicons name="chevron-up-outline" style={{ position:'absolute', right:20, color:theme.Maintext}} size={30} />}
        </Container>
    );
};

IconButton.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    imgStyle: PropTypes.object,
    cStyle: PropTypes.object,
};

export default IconButton;