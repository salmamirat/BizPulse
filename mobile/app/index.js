import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, StyleSheet, View, Pressable } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

export default function Index() {
  const [logged, setLogged] = useState(null);
  const [videoFinished, setVideoFinished] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then((token) => setLogged(Boolean(token)));
  }, []);

  const player = useVideoPlayer(require('../assets/splash.mp4'), player => {
    player.play();
  });

  useEffect(() => {
    const timer = setTimeout(() => setVideoFinished(true), 6000);
    const subscription = player.addListener('playToEnd', () => {
      setVideoFinished(true);
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [player]);

  if (!videoFinished) {
    return (
      <Pressable style={styles.container} onPress={() => setVideoFinished(true)}>
        <View pointerEvents="none" style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls={false}
          />
        </View>
      </Pressable>
    );
  }

  if (logged === null) return <View style={styles.loadingContainer}><ActivityIndicator color="#6D1B3B" /></View>;
  return logged ? <Redirect href="/dashboard" /> : <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: "center", 
    backgroundColor: "#FAF7F5"
  }
});
