import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import colors from "../constants/colors";

export default function Index() {
  const [logged, setLogged] = useState(null);
  const [videoFinished, setVideoFinished] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then((token) => setLogged(Boolean(token)));
  }, []);

  const player = useVideoPlayer(require('../assets/splash-video.mp4'), (p) => {
    p.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playToEnd", () => {
      setVideoFinished(true);
    });

    const timer = setTimeout(() => {
      setVideoFinished(true);
    }, 4000);

    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, [player]);

  if (logged === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (logged) return <Redirect href="/dashboard" />;

  if (!videoFinished) {
    return (
      <View style={styles.container}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
        />
      </View>
    );
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center"
  },
  video: {
    width: "100%",
    height: "100%"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background
  }
});
