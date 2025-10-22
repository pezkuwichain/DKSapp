import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EducationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Education (Perwerde) - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  text: { color: 'white', fontSize: 18 },
});