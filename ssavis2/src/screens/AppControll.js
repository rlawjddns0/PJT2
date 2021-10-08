import React from 'react';
import styled from 'styled-components/native';
import { Text, Button } from 'react-native';

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;

const AppControll = ({ navigation }) => {
    return (
        <Container>
            <Text style={{fontSize:24}}>가전 공간입니다</Text>
            <Button title="Appliance" onPress={() => navigation.navigate('Appliance')} />
        </Container>
    );
};

export default AppControll;