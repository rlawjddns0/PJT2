import React from 'react';
import styled from 'styled-components/native';
import { Text, Button, FlatList} from 'react-native';

const Container = styled.View`
    flex: 1;
    align-items:center;
    justify-content:center;
    background-color: ${({ theme }) => theme.background};
`;

const Container2 = styled.View`
    flex:4;
`;

const StyledText = styled.Text`
    font-weight: bold;
    font-size: 24px;
    font-family: ${({theme}) => theme.font};
    color: ${({theme}) => theme.Maintext};
`;
const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-color: gray;
    padding: 15px 20px;
`;

const items = [
    {
        id:1,
        type:1,
        user_no:2,
        url: 'https://firebasestorage.googleapis.com/v0/b/ssavis-d2333.appspot.com/o/icons%2FALL.png?alt=media',
        datetime: '2021-09-30'
    },
    {
        id:2,
        type:2,
        user_no:3,
        url: 'https://firebasestorage.googleapis.com/v0/b/ssavis-d2333.appspot.com/o/icons%2FALL.png?alt=media',
        datetime: '2021-09-30'
    }
]
const Item = React.memo(
    ({item:{id, type, user_no, url, position, datetime},onPress}) =>{
        return (
            <ItemContainer onPress={() => onPress({ id, url })}>
                <Text>{id}</Text>
                <Text>{url}</Text>
                <Text>{position}</Text>
                <Text>{datetime}</Text>
            </ItemContainer>
        )
    }
)

const LostItem = ({ navigation }) => {
    const _handleItemPress = params => {
        navigation.navigate('ItemDetail',params);  
    };
    return (
        <Container>
            <Container>
                <StyledText>분실물 목록</StyledText>
            </Container>
            <Container2>
                <FlatList
                    keyExtractor={item => item['id'].toString()}
                    data={items}
                    renderItem={({item}) => (
                        <Item item={item} onPress={_handleItemPress} />
                    )}
                />
            </Container2>
        </Container>
        
    );
};


export default LostItem;