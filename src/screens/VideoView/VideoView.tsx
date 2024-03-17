import { FC, useEffect, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, Text, View } from 'react-native';
import axios from 'axios';

import { PEXELS_API_KEY } from '@env';
import { PEXELS_API_URL } from '@/services';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

export const VideoView: FC = () => {
  const [videos, setVideos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${PEXELS_API_URL}?query=oceans&orientation=portrait&size=small&per_page=50&page=1&`,
        {
          headers: {
            Authorization: `${PEXELS_API_KEY}`,
          },
        },
      );

      const data = response.data;

      console.log(JSON.stringify(data, null, 2));
      setVideos(data.videos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onScroll = ({ nativeEvent }) => {
    const index = nativeEvent.contentOffset.y.toFixed(0) / height;

    setSelectedIndex(index.toFixed(0));
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={videos}
        keyExtractor={item => item.id.toString()}
        style={{ flex: 1 }}
        pagingEnabled={true}
        onScroll={onScroll}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: width,
              height: height,
              backgroundColor: '#000',
            }}>
            <Video
              source={{ uri: item.video_files[0].link }}
              style={{ width: '100%', height: '100%' }}
              repeat={true}
              paused={selectedIndex == index ? false : true}
            />
          </View>
        )}
      />
    </View>
  );
};
