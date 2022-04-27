import React from 'react';
import { Text, View, Pressable } from 'react-native';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const navigateToDetail = () => {
    navigation.navigate('Detail');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to RACE!</Text>
      <Pressable onPress={navigateToDetail}>
        <Text>Touch here to get more detail!</Text>
      </Pressable>
    </View >
  );
};
