import { View, StyleSheet, Text, Image } from "react-native";
import { Participation } from ".";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function Index() {
  const nombre = useLocalSearchParams<Participation>()
  const nb = Number(nombre.numeroMagique)
  let messageHaut
  let image
  let messageBas

  if (nb == 8) {
    messageHaut = ("Le nombre magique était 8.")
    image = require('@/assets/images/argent.jpg')
    messageBas = ("Tu as gané 100$.")
  }
  else {
    messageHaut = ("Le nombre magique n'était pas " + nb + ".")
    image = require('@/assets/images/pleurer.jpg')
    messageBas = ("Malheureusement, tu as échoué.")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texte}>{messageHaut}</Text>
      <Image style={styles.image} resizeMode="contain" source={image} />
      <Text style={styles.texte}>{messageBas}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00966C"
  },
  texte: {
    color: "#FFFFFF"
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 30,
    marginBottom: 10
  },
});

function useLocalSerachParams<T>() {
  throw new Error("Function not implemented.");
}
