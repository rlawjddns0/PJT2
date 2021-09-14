import React from 'react';
import styled from 'styled-components/native';

const Container = styled.SafeAreaView`
    flex:1;
    justify-content: center;
    align-items: center;
    background-color: yellow;
`;
const StyledText = styled.Text`
    
    font-size: 50px;
`;

const MainHeader = () =>{
    return(
        <Container>
            <StyledText>홈화면입니다.</StyledText>
        </Container>
    )
}

export default MainHeader;