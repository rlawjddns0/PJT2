import React from 'react';
import styled from 'styled-components/native';

const Container = styled.SafeAreaView`
    flex:2;
    justify-content: center;
    align-items: center;
    background-color: red;
`;
const StyledText = styled.Text`
    
    font-size: 50px;
`;

const HomeMain = () =>{
    return(
        <Container>
            <StyledText>메인입니다.</StyledText>
        </Container>
    )
}

export default HomeMain;