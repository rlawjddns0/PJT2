import React, {useContext} from 'react';
import styled from 'styled-components/native';
import { Text, Button, StyleSheet } from 'react-native';
import { MainHeader } from '../components';
import { images } from '../utils/images';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../contexts';
import { getCurrentUser } from '../utils/firebase';
import { ThemeContext } from 'styled-components/native';
import { lightTheme } from '../theme';
import MainButton from '../components/MainButton';

const Header = styled.SafeAreaView`
    position:absolute;
    left:5px;
    top:5px;
`;
const HeaderText = styled.Text`
    font-size: 32px;
    font-family: ${({theme}) => theme.font};
    color : white;
    box-shadow: 0 2px 4px grey;
    margin-left:15%;
    
`;
const Container = styled.View`
    flex:1;
    justify-content: center;
    
`;
const MainContainer = styled.View`
    flex:2;
    align-items:center;
    padding:20px;
    background-color:${({theme}) => theme.background};
`;
const SubContainer = styled.View`
    flex:1;
    align-items:center;
    justify-content:center;
`;
const ButtonContainer = styled.View`
    flex:2;
    justify-content:center;
    flex-direction: row;
`;
const StyledText = styled.Text`
    font-size: 24px;
    color : ${({theme}) => theme.Maintext};
    font-weight:bold;
    margin:5px;
`;

const SubText = styled.Text`
    font-size: 16px;
    font-family: ${({theme}) => theme.font};
`;

const Main = ({navigation}) => {    
    const user = getCurrentUser();
    const theme = useContext(ThemeContext);
    return (
        <Container>
            <LinearGradient colors={ theme == lightTheme ? ['#A7F3CF','#92C5FC'] : ['#91CEAB','#77A0CB']} style={styles.background}>
                <Header>
                    <HeaderText>SSAVIS</HeaderText>
                </Header>
                <MainHeader/>
            </LinearGradient>
        <MainContainer>
            <SubContainer>
            <StyledText>안녕하세요, {user.name}님</StyledText>
            <Text style={{fontSize:16, color:'grey'}}>무엇을 도와드릴까요?</Text>
            </SubContainer>
            <ButtonContainer>
                <MainButton uri={ theme==lightTheme ? images.cleaning : images.cleaningG} title="청소" onPress={() => navigation.navigate('Cleaning')} imgStyle={{height:50, width:50}}/>
                <MainButton uri={ theme==lightTheme ? images.appliance : images.applianceG} title="가전" onPress={() => navigation.navigate('Appliance')} imgStyle={{height:40, width:50,marginTop:10}}/>
            </ButtonContainer>
            <ButtonContainer>
                <MainButton uri={ theme==lightTheme ? images.lostItem : images.lostItemG} title="분실물" onPress={() => navigation.navigate('LostItem')} imgStyle={{height:50, width:50}}/>
                <MainButton uri={ theme==lightTheme ? images.invasion : images.invasionG} title="침입 관리" onPress={() => navigation.navigate('Invasion')} imgStyle={{height:50, width:50}}/>
            </ButtonContainer>
        </MainContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    background: {
        flex:1.5,
        alignItems:'center',
        justifyContent:'center',
    },
});
export default Main;