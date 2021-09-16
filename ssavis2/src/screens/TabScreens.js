import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
const StyledText = styled.Text`
    font-size: 30px;
`;

export const Home = () => {
    return (
        <Container>
            <StyledText>Home</StyledText>
        </Container>
    )
}

export const Meet = () => {
    return (
        <Container>
            <StyledText>Meet</StyledText>
        </Container>
    )
}
export const Settings = () => {
    return (
        <Container>
            <StyledText>Settings</StyledText>
        </Container>
    )
}