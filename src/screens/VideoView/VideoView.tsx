import { FC, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import axios from 'axios';

import { PEXELS_API_KEY } from '@env';
import { PEXELS_API_URL } from '@/services';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

export const VideoView: FC = () => {
  const [videos, setVideos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${PEXELS_API_URL}?query=oceans&orientation=portrait&size=small&per_page=10&page=${currentPage}`,
        {
          headers: {
            Authorization: `${PEXELS_API_KEY}`,
          },
        },
      );

      const data = response.data;

      setTotalPages(Math.ceil(data.total_results / 10));

      if (currentPage > 1) {
        setVideos(prevVideos => [...prevVideos, ...data.videos]);
      } else {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onScroll = ({ nativeEvent }) => {
    const index = nativeEvent.contentOffset.y.toFixed(0) / height;

    setSelectedIndex(index.toFixed(0));
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        data={videos}
        keyExtractor={item => item.id.toString()}
        style={{ flex: 1 }}
        pagingEnabled={true}
        onScroll={onScroll}
        onEndReached={nextPage}
        onEndReachedThreshold={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: width,
              height: height,
              backgroundColor: '#000',
            }}>
            <Video
              source={{ uri: item.video_files[0].link }}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              repeat={true}
              paused={selectedIndex == index ? false : true}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                bottom: 60,
                left: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Image
                source={{ uri: item.image }}
                width={36}
                height={36}
                style={{
                  borderRadius: 20,
                }}
              />
              <Text style={{ fontSize: 15, color: 'white', fontWeight: '600' }}>
                {item?.user?.name}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};
