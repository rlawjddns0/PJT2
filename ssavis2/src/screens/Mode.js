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

export const Mode = () => {
    return (
        <Container>
            <StyledText>Mode</StyledText>
        </Container>
    )
}

export default Mode;