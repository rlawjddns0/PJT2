import React, { useContext} from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Text, Button, ScrollView } from 'react-native';
import IconButton from '../components/IconButton';
import { lightTheme } from '../theme';
import { images } from '../utils/images';
const Container = styled.ScrollView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;

const PartCleaning = () => {
    const theme = useContext(ThemeContext);
    
    const _Controll = (title) => {
        alert(title+"실행");
    };
    return (
        <Container>
            <IconButton uri={ theme == lightTheme ? images.livingRoom : images.livingRoomG} title={"거실"} onPress={() => _Controll("거실")} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}}/>
            <IconButton uri={ theme == lightTheme ? images.kitchen : images.kitchenG} title={"주방"} onPress={() => _Controll("주방")} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}}/>
            <IconButton uri={ theme == lightTheme ? images.room : images.roomG} title={"큰방"} onPress={() => _Controll("큰방")} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}}/>
            <IconButton uri={ theme == lightTheme ? images.room2 : images.room2G} title={"방1"} onPress={() => _Controll("방1")} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}}/>
            <IconButton uri={ theme == lightTheme ? images.room2 : images.room2G} title={"방2"} onPress={() => _Controll("방2")} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}}/>
            <IconButton uri={ theme == lightTheme ? images.room2 : images.room2G} title={"방3"} onPress={() => _Controll("방3")} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:20}}/>
            {/* <Button title="clean creation" onPress={() => navigation.navigate('Channel Creation')} /> */}
        </Container>
    );
};

export default PartCleaning;