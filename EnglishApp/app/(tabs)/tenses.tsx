import { StyleSheet, View, Text } from 'react-native';

export default function TensesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tenses</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
