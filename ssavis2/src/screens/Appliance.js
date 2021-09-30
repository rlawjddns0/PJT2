import React, { useContext, useState} from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { ScrollView,Text } from 'react-native';
import IconButton from '../components/IconButton';
import { lightTheme } from '../theme';
import { images } from '../utils/images';
import AppBtn from '../components/AppBtn';
const Container = styled.ScrollView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;
const Container2 = styled.ScrollView`
    margin-top:15px;
    margin-bottom:5px;
    background-color: lightgrey;
`;
const Appliance = () => {
    const theme = useContext(ThemeContext);
    const [btn, setBtn] = useState([]);
    const [appControll,setAppControll] = useState([]);

    for(let idx = 0; idx<=5; idx++){
        btn.push({
            id: idx,
            status: false,
        })
    }
    for(let idx = 0; idx<=16; idx++){
        appControll.push({
            id: idx,
            status: false,
        });
    }
    const _Controll = (num) => {
        setBtn(btn.map(btnn => btnn.id === num ? {...btnn,status: !btnn.status}:btnn));  
    };

    const _toggle = (num) => {
        setAppControll(appControll.map(app =>
        app.id === num ? {...app, status: !app.status} : app));
    }
    return (
        <Container>
            <IconButton uri={ theme == lightTheme ? images.livingRoom : images.livingRoomG} title={"거실"} onPress={() => _Controll(btn[0].id)} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}} appS={true} status={btn[0].status}/>
            { btn[0].status && 
            <Container2> 
                <AppBtn uri={theme == lightTheme ? images.light : images.lightG} title={"조명"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[6].status} appStatusChange={() => _toggle(appControll[6].id)}/>
                <AppBtn uri={theme == lightTheme ? images.aircon : images.airconG} title={"에어컨"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[10].status} appStatusChange={() => _toggle(appControll[10].id)}/>
                <AppBtn uri={theme == lightTheme ? images.airpuri : images.airpuriG} title={"공기 청정기"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[11].status} appStatusChange={() => _toggle(appControll[11].id)}/>
                <AppBtn uri={theme == lightTheme ? images.tv : images.tvG} title={"TV"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[12].status} appStatusChange={() => _toggle(appControll[12].id)}/>
                <AppBtn uri={theme == lightTheme ? images.curtain : images.curtainG} title={"커튼"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:30}} appStatus={appControll[16].status} appStatusChange={() => _toggle(appControll[16].id)}/>
            </Container2>
            }
            <IconButton uri={ theme == lightTheme ? images.kitchen : images.kitchenG} title={"주방"} onPress={() => _Controll(btn[1].id)} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}} appS={true} status={btn[1].status}/>
            {btn[1].status &&
            <Container2> 
                <AppBtn uri={theme == lightTheme ? images.light : images.lightG} title={"조명"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:30}} appStatus={appControll[6].status} appStatusChange={() => _toggle(appControll[6].id)}/>
            </Container2>
            }
            <IconButton uri={ theme == lightTheme ? images.room : images.roomG} title={"방1"} onPress={() => _Controll(btn[2].id)} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}} appS={true} status={btn[2].status}/>
            {btn[2].status &&
            <Container2> 
                <AppBtn uri={theme == lightTheme ? images.light : images.lightG} title={"조명"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[1].status} appStatusChange={() => _toggle(appControll[1].id)}/>
                <AppBtn uri={theme == lightTheme ? images.aircon : images.airconG} title={"에어컨"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[7].status} appStatusChange={() => _toggle(appControll[7].id)}/>
                <AppBtn uri={theme == lightTheme ? images.curtain : images.curtainG} title={"커튼"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:30}} appStatus={appControll[13].status} appStatusChange={() => _toggle(appControll[13].id)}/>
            </Container2>
            }
            <IconButton uri={ theme == lightTheme ? images.room2 : images.room2G} title={"방2"} onPress={() => _Controll(btn[3].id)} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}} appS={true} status={btn[3].status}/>
            {btn[3].status &&
            <Container2> 
                <AppBtn uri={theme == lightTheme ? images.light : images.lightG} title={"조명"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[2].status} appStatusChange={() => _toggle(appControll[2].id)}/>
                <AppBtn uri={theme == lightTheme ? images.aircon : images.airconG} title={"에어컨"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[8].status} appStatusChange={() => _toggle(appControll[8].id)}/>
                <AppBtn uri={theme == lightTheme ? images.curtain : images.curtainG} title={"커튼"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:30}} appStatus={appControll[14].status} appStatusChange={() => _toggle(appControll[14].id)}/>
            </Container2>
            }
            <IconButton uri={ theme == lightTheme ? images.room2 : images.room2G} title={"방3"} onPress={() => _Controll(btn[4].id)} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}} appS={true} status={btn[4].status}/>
            {btn[4].status &&
            <Container2> 
                <AppBtn uri={theme == lightTheme ? images.light : images.lightG} title={"조명"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[3].status} appStatusChange={() => _toggle(appControll[3].id)}/>
                <AppBtn uri={theme == lightTheme ? images.aircon : images.airconG} title={"에어컨"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:0}} appStatus={appControll[9].status} appStatusChange={() => _toggle(appControll[9].id)}/>
                <AppBtn uri={theme == lightTheme ? images.curtain : images.curtainG} title={"커튼"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:30}} appStatus={appControll[15].status} appStatusChange={() => _toggle(appControll[15].id)}/>
            </Container2>
            }
            <IconButton uri={ theme == lightTheme ? images.room2 : images.room2G} title={"방4"} onPress={() => _Controll(btn[5].id)} imgStyle={{height:45, width:45, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:20}} appS={true} status={btn[5].status}/>
            {btn[5].status &&
            <Container2> 
                <AppBtn uri={theme == lightTheme ? images.light : images.lightG} title={"조명"} imgStyle={{height:30, width:30, marginTop:'20%', marginLeft:10}} cStyle={{marginBottom:30}} appStatus={appControll[4].status} appStatusChange={() => _toggle(appControll[4].id)}/>
            </Container2>
            }
            {/* <Button title="clean creation" onPress={() => navigation.navigate('Channel Creation')} /> */}
        </Container>
    );
};

export default Appliance;