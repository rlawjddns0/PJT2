import React, {useState,useContext} from 'react';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemeContext } from 'styled-components/native';
const Container = styled.SafeAreaView`
    justify-content: center;
    width:300px;
    height:150px;
    border-radius: 20px;
    margin-top: 20%;
    box-shadow: 0 6px 10px lightgrey;
    background-color:${({theme}) => theme.background};
`;
const Container2 = styled.View`
    flex-direction: row;
`;
const StyledText = styled.Text`
    padding-left:10px;
    padding-bottom:10px;
    color:${({theme})=> theme.Maintext};
`;

const MainHeader = () =>{
    const mode = "외출모드";
    const theme = useContext(ThemeContext);
    const icon = "door-open";
    return(
        <Container>
            <Container2>
                <FontAwesome5 name={icon} style={{color: theme.Maintext, marginLeft:20}} size={30} />
                <StyledText style={{fontSize:24, lineHeight:35, fontWeight:'bold'}}>{mode}</StyledText>
            </Container2>
            <StyledText style={{fontSize:14, marginLeft:10,paddingBottom:0}}>현재 외출모드 실행 중입니다.</StyledText>
            <StyledText style={{fontSize:14, marginLeft:10}}>변경하시려면 모드탭으로 이동해주세요.</StyledText>
        </Container>
    )
}

export default MainHeader;