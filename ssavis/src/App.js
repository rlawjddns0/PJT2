import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import Button from './components/Button';
import SplashScreen from 'react-native-splash-screen';
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>sibal</Text>
      <Container>
        <Button title="hanbit" />
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
  },
});

export default App;
