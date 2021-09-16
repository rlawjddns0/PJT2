import React from 'react';
import styled from 'styled-components/native';
import MainHeader from '../components/MainHeader';
import HomeMain from '../components/HomeMain';
const Container = styled.View`
    flex:1;
    justify-content: center;
    
`;
const StyledText = styled.Text`
    font-size: 30px;
`;

const Home = () => {
    return (
        <Container>
            <MainHeader />
            <HomeMain />
        </Container>
    )
}

export default Home;