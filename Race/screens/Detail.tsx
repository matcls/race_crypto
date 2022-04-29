import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RenderHtml from 'react-native-render-html';
import axios from 'axios';
import { API_URL } from '../consts/app-consts';
import { CryptoMarketDataInit, CryptoProfileInit } from '../models/crypto';
import { useNavigation } from '@react-navigation/native';

import { LIGHTGREY, LIGHTBLACK } from '../consts/app-consts';

export const DetailScreen = ({ route }: { route: any }) => {
  const { width } = useWindowDimensions();
  const id = route.params.id;
  const [cryptoProfile, setCryptoProfile] = useState(CryptoProfileInit);
  const [cryptoMarketData, setCryptoMarketData] =
    useState(CryptoMarketDataInit);
  const [cryptoDataLoaded, setCryptoDataLoaded] = useState(false);
  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/cryptos/market-data/${id}`),
      axios.get(`${API_URL}/cryptos/profile/${id}`),
    ]).then(([resMarketData, resProfile]) => {
      setCryptoMarketData(resMarketData.data);
      setCryptoProfile(resProfile.data);
      setCryptoDataLoaded(true);
    });
  }, []);
  const nav = useNavigation();


  return (
    <View style={{ height: "100%", backgroundColor: '#F5F8FF' }}>
      <View style={styles.headerbar}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Icon name="chevron-back-outline" size={28} color={LIGHTGREY} />
        </TouchableOpacity>
        {/*        <Text style={{ fontSize: 25, fontWeight: "500", color: LIGHTBLACK }}>{cryptoProfile.name}</Text>*/}
        <TouchableOpacity><Icon name="ellipsis-vertical" size={26} color={LIGHTGREY} /></TouchableOpacity>
      </View>

      {cryptoDataLoaded && (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{cryptoProfile.name}</Text>
              <Text style={styles.symbol}>{cryptoProfile.symbol}</Text>
              <Text style={styles.price}>
                {`$ ${convert(cryptoMarketData.market_data.price_usd)}`}
              </Text>
            </View>
            <View style={styles.headerTagLine}>
              <Text style={styles.line}>
                {cryptoProfile.profile.general.overview.tagline}
              </Text>
            </View>
          </View>
          <View style={styles.priceChanges}>
            <View style={styles.priceChangeRow}>
              <Text style={styles.change}>Change 1h</Text>
              <Text style={styles.line}>
                {` % ${convert(
                  cryptoMarketData.market_data.percent_change_usd_last_1_hour,
                )}`}
              </Text>
            </View>
          </View>
          <View style={styles.priceChanges}>
            <View style={styles.priceChangeRow}>
              <Text style={styles.change}>Change 24h</Text>
              <Text style={styles.line}>
                {` % ${convert(
                  cryptoMarketData.market_data.percent_change_usd_last_24_hours,
                )}`}
              </Text>
            </View>
          </View>
          <ScrollView style={styles.cryptoInfo}>
            <View style={styles.cryptoInfoRow}>
              <Text style={styles.cryptoInfoTitle}>Overview</Text>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `<p style="color: #fff">${cryptoProfile.profile.general.overview.project_details}</p>`,
                }}
              />
            </View>
            <View style={styles.cryptoInfoRow}>
              <Text style={styles.cryptoInfoTitle}>Background</Text>

              <RenderHtml
                contentWidth={width}
                source={{
                  html: `<p style="color: #fff">${cryptoProfile.profile.general.background.background_details}</p>`,
                }}
              />
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingBottom: 40 }}>
              <Icon name="wallet" size={28} color={LIGHTBLACK} />
              <Icon name="notifications" size={28} color={LIGHTGREY} />
              <Icon name="settings-sharp" size={28} color={LIGHTGREY} />
            </View>
          </View>
        </View>
      )}

      {!cryptoDataLoaded && <ActivityIndicator size="large" color="#ffab00" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: LIGHTGREY,
    padding: 10,
    flex: 1,

  },
  headerbar: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20
  },

  header: {
    backgroundColor: LIGHTBLACK,
    height: 100,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,

  },

  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTagLine: {
    marginTop: 10,
  },

  name: {
    fontSize: 26,
    color: '#fff',
  },

  symbol: {
    fontSize: 18,
    padding: 8,
    backgroundColor: '#272d42',
    color: '#fff',
  },

  price: {
    fontSize: 28,
    color: '#ffab00',
    width: 150,
    textAlign: 'right',
  },

  line: {
    color: '#fff',
    fontSize: 16,

  },
  change: {
    color: '#fff',
    fontSize: 18,

  },
  priceChanges: {
    backgroundColor: LIGHTBLACK,
    height: 70,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,

  },
  priceChangeRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cryptoInfo: {
    backgroundColor: LIGHTBLACK,
    padding: 10,
    flex: 1,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  cryptoInfoTitle: {
    color: '#ffab00',
    fontSize: 22,
    marginBottom: 5,
    marginTop: 10,
  },
  cryptoInfoRow: {
    flex: 1,
    marginBottom: 25,
    padding: 4,
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


const convert = (price: number) => {
  return Math.round(price * 100) / 100;
};
