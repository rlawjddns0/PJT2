import React from 'react';
import styled from 'styled-components/native';
import MainHeader from '../components/MainHeader';
import HomeMain from '../components/HomeMain';
import { Text, Button } from 'react-native';

const Container = styled.View`
    flex:1;
    justify-content: center;
    
`;
const StyledText = styled.Text`
    font-size: 30px;
`;

const Main = ({navigation}) => {
    return (
        <Container>
            <Text style={{ fontSize: 24}}>Channel List</Text>
            <Button title="Channel Creation" onPress={() => navigation.navigate('Channel Creation')}/>
            {/* <MainHeader />
            <HomeMain /> */}
        </Container>
    )
}

export default Main;