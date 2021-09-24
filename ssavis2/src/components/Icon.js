import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const Container = styled.View`
    align-self: center;
    margin-bottom: 15px;
`;

const StyledImage = styled.Image`
    background-color: ${({theme})=> theme.background};
    width: 100px;
    height: 100px;   
`;

const Icon = ({ url, imageStyle}) => {
    return (
        <Container>
            <StyledImage source={{ uri: url}} style={imageStyle} />
        </Container>
    );
};

Icon.propTypes = {
    uri: PropTypes.string,
    imageStyle: PropTypes.object,
}

export default Icon;