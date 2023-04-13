/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ActivityIndicator,
  Button,
  Divider,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';
import {View, FlatList, RefreshControl, ImageBackground} from 'react-native';
import Twitch from '@/utils/TwitchAPI';
import {TwitchTopGameStreams} from '@/utils/types/TwitchData';
import Icon from '@/components/Icon';
import Fonts from './Styles/Fonts';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '@react-navigation/native';

export default function TrendingPage(): JSX.Element {
  const {colors} = useTheme();
  const [games, setGames] = React.useState<TwitchTopGameStreams[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const getData = React.useCallback(() => {
    Twitch.topGameStreams()
      .then(setGames)
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  }, []);

  React.useEffect(() => {
    getData();
  }, [getData]);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            getData();
          }}
        />
      }
      style={{
        paddingTop: 10,
      }}
      data={games}
      keyExtractor={game => game.id as string}
      renderItem={({item}) => (
        <ImageBackground
          source={{
            uri: item.box_art_url?.replace('{width}x{height}', '350x500'),
          }}
          style={{
            marginBottom: 10,
            marginHorizontal: 10,
            borderRadius: 10,
            overflow: 'hidden',
          }}
          resizeMode="cover">
          <View
            style={{
              backgroundColor: colors.primaryContainer,
              opacity: 0.66,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
          <View style={{flex: 1, padding: 10}}>
            <Title
              style={[
                {
                  textAlign: 'center',
                  textShadowColor: colors.primaryContainer,
                  textShadowOffset: {height: 1, width: 1},
                  textShadowRadius: 10,
                },
                Fonts.TwitchyTV,
              ]}>
              {item.name}
            </Title>
            <Divider />
            {item.streams?.map(stream => (
              <View key={stream.id} style={{marginVertical: 5}}>
                <Button
                  mode="contained"
                  onPress={() => {
                    navigation.navigate('twitchuser', {
                      username: stream.user_login as string,
                    });
                  }}>
                  @{stream.user_login}
                </Button>
                <View
                  style={{
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>
                    <Icon from="ionicons" name="eye" /> {stream.viewer_count}{' '}
                    espectadores
                  </Text>
                  <Text>{stream.is_mature ? '+18' : 'Livre'}</Text>
                </View>
              </View>
            ))}
          </View>
        </ImageBackground>
      )}
    />
  );
}