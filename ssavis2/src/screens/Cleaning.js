import React, { useContext} from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Text, Button } from 'react-native';
import IconButton from '../components/IconButton';
import { lightTheme } from '../theme';
import { images } from '../utils/images';
const Container = styled.View`
    flex: 1;

    background-color: ${({ theme }) => theme.background};
`;

const Cleaning = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    return (
        <Container>
            <IconButton uri={ theme == lightTheme ? images.all : images.allG} title={"모든 방 청소"} onPress={() => navigation.navigate('Channel Creation')} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}}/>
            <IconButton uri={ theme == lightTheme ? images.selection : images.selectionG} title={"부분 청소"} onPress={() => navigation.navigate('PartCleaning')} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}}/>
            {/* <Button title="clean creation" onPress={() => navigation.navigate('Channel Creation')} /> */}
        </Container>
    );
};

export default Cleaning;