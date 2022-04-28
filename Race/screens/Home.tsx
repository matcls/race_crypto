import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Crypto } from '../models/crypto';
import { socket } from '../App';

import { LIGHTGREY, LIGHTBLACK } from '../consts/app-consts';

const myIcon = <Icon name="rocket" size={30} color="#900" />;

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  //const [cryptoList, setCryptoList] = useState();

  const cryptoList: Crypto[] = [
    {
      id: '1',
      name: 'BTC',
      price: 38001.64,
    },
    {
      id: '2',
      name: 'ETH',
      price: 4025.0,
    },
    {
      id: '3',
      name: 'SOL',
      price: 250.21,
    },
  ];


  useEffect(() => {
    socket.on('crypto', data => {
      setCryptoList(data);
    });
  }, []);
  const openCryptoDetail = (id: string) => {
    navigation.navigate('Detail', { id: id });
  };

  const renderItem = ({ item }: { item: Crypto }) => {
    return (
      <Pressable
        style={styles.crypto}
        onPress={() => openCryptoDetail(item.id)}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{Math.round(item.price * 1000) / 1000}</Text>
      </Pressable>
    );
  };

  return (
    <View style={{ height: "100%", backgroundColor: '#F5F8FF' }}>          
      <View style={styles.headerbar}>
        <TouchableOpacity>
          <View>
            <View style={{ width: 20, height: 3, marginVertical: 5, backgroundColor: LIGHTGREY }}></View>
            <View style={{ width: 15, height: 3, backgroundColor: LIGHTGREY }}></View>
            <View style={{ width: 10, height: 3, marginVertical: 5, backgroundColor: LIGHTGREY }}></View>
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 25, fontWeight: "500", color: LIGHTBLACK }}>Wallet</Text>
        <TouchableOpacity><Icon name="wallet" size={24} color={LIGHTGREY} /></TouchableOpacity>
      </View>
      <View style={styles.container}>
        <FlatList
          data={cryptoList}
          style={{ height: (Dimensions.get('window').height / 2) - 60 }}
          ItemSeparatorComponent={() => <View style={{ marginVertical: 4 }}></View>}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.footer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingBottom: 40 }}>
          <Icon name="wallet" size={28} color={LIGHTBLACK} />
          <Icon name="compass" size={28} color={LIGHTGREY} />
          <Icon name="notifications" size={28} color={LIGHTGREY} />
          <Icon name="settings-sharp" size={28} color={LIGHTGREY} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#272d42',
    flex: 1,
  },
  headerbar: {
    paddingTop: 15,
    paddingBottom: 2,
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  crypto: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#000',
    padding: 20,
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: '#fff',
    fontSize: 24,
  },

  price: {
    color: '#ffab00',
    fontSize: 28,
  },
  footer: {
    position: 'absolute',
    left: 1,
    right: 1,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
});
