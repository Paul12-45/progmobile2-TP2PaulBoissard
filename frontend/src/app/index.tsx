import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Pressable, Image } from "react-native";

export type Participation = {
  numeroMagique: string
}

export default function Index() {
  const [numero, setNumero] = useState(0)
  const routeur = useRouter()

  function compteur() {
    setNumero(numero + 1)  
  }

  function navigate() {
    const objParticipation: Participation = {
      numeroMagique: numero.toString()
    }

    routeur.push({ pathname: "/richesse", params: objParticipation })
  }

  console.log(numero)
  return (
    <View style={styles.container}>
      <Text style={styles.texte}>Devine le nombre magique</Text>
      <Pressable style={styles.Pressable} onPress={compteur}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require('@/assets/images/cegep.png')} />
      </Pressable>
      <TouchableOpacity
        style={styles.bouton}
        onPress={navigate}>
        <Text style={styles.texte}>Participer</Text>
      </TouchableOpacity>
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
  bouton: {
    backgroundColor: "#474C55",
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 30,
    marginBottom: 10
  },
  Pressable: {
    width: "100%",
    marginTop: 20,
  }
});
