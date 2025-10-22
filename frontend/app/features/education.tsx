import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EducationScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1F2937', '#111827']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Education (Perwerde)</Text>
        <Text style={styles.headerSubtitle}>Coming Soon</Text>
      </LinearGradient>
      <View style={styles.content}>
        <Ionicons name="school" size={80} color="#9CA3AF" />
        <Text style={styles.text}>Education Platform</Text>
        <Text style={styles.subtext}>Courses and certifications will be available soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: { padding: 24, paddingTop: 60 },
  backButton: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerSubtitle: { color: '#9CA3AF', fontSize: 14 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 24 },
  subtext: { color: '#9CA3AF', fontSize: 16, marginTop: 12, textAlign: 'center' },
});