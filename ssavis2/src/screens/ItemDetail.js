import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';

const Container = styled.View`
    flex: 1;
`;
const StyledImage = styled.Image`
    background-color: ${({ theme }) => theme.imageBackground};
    width: 100px;
    height: 100px;
    border-radius: ${({ rounded }) => (rounded ? 50 : 0)}px;    
`;

const ItemDetail = ({ navigation, route: {params} }) => {
    return (
        <Container>
            <StyledImage source={{uri:params.url}}/>
            <Text>{params.id}</Text>
        </Container>
    )
}

export default ItemDetail;