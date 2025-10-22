import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const MINISTRIES = [
  { 
    id: 'prime_ministry', 
    name: 'Prime Ministry', 
    nameKu: 'Serokwezîrî',
    nameCkb: 'سەرۆک وەزیران',
    icon: 'briefcase', 
    color: '#DC2626',
    url: 'https://serokweziri.pezkuwichain.io'
  },
  { 
    id: 'foreign_affairs', 
    name: 'Foreign Affairs', 
    nameKu: 'Derve',
    nameCkb: 'دەرەوە',
    icon: 'globe', 
    color: '#2563EB',
    url: 'https://derve.pezkuwichain.io'
  },
  { 
    id: 'education', 
    name: 'Education', 
    nameKu: 'Perwerde',
    nameCkb: 'پەروەردە',
    icon: 'school', 
    color: '#7C3AED',
    url: 'https://perwerde.pezkuwichain.io'
  },
  { 
    id: 'health', 
    name: 'Health', 
    nameKu: 'Tenduristî',
    nameCkb: 'تەندروستی',
    icon: 'medical', 
    color: '#059669',
    url: 'https://tenduristi.pezkuwichain.io'
  },
  { 
    id: 'interior', 
    name: 'Interior', 
    nameKu: 'Navxwe',
    nameCkb: 'ناوخۆ',
    icon: 'shield', 
    color: '#0891B2',
    url: 'https://navxwe.pezkuwichain.io'
  },
  { 
    id: 'justice', 
    name: 'Justice', 
    nameKu: 'Dadwerî',
    nameCkb: 'دادوەری',
    icon: 'scale', 
    color: '#7C2D12',
    url: 'https://dadweri.pezkuwichain.io'
  },
  { 
    id: 'finance', 
    name: 'Finance', 
    nameKu: 'Darayî',
    nameCkb: 'دارایی',
    icon: 'cash', 
    color: '#065F46',
    url: 'https://darayi.pezkuwichain.io'
  },
  { 
    id: 'defense', 
    name: 'Defense', 
    nameKu: 'Bergiranî',
    nameCkb: 'بەرگری',
    icon: 'shield-checkmark', 
    color: '#991B1B',
    url: 'https://bergirani.pezkuwichain.io'
  },
  { 
    id: 'agriculture', 
    name: 'Agriculture', 
    nameKu: 'Çandinî',
    nameCkb: 'کشتوکاڵ',
    icon: 'leaf', 
    color: '#65A30D',
    url: 'https://candini.pezkuwichain.io'
  },
  { 
    id: 'energy', 
    name: 'Energy', 
    nameKu: 'Werzî',
    nameCkb: 'وزە',
    icon: 'flash', 
    color: '#CA8A04',
    url: 'https://werzi.pezkuwichain.io'
  },
  { 
    id: 'transport', 
    name: 'Transport', 
    nameKu: 'Veguhestin',
    nameCkb: 'گواستنەوە',
    icon: 'car', 
    color: '#0369A1',
    url: 'https://veguhestin.pezkuwichain.io'
  },
  { 
    id: 'culture', 
    name: 'Culture & Tourism', 
    nameKu: 'Çand û Gerî',
    nameCkb: 'کولتور و گەشتیاری',
    icon: 'images', 
    color: '#DB2777',
    url: 'https://cand.pezkuwichain.io'
  },
];

export default function MinistriesScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const openMinistryWebsite = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const getMinistryName = (ministry: any) => {
    if (i18n.language === 'ku') return ministry.nameKu;
    if (i18n.language === 'ckb') return ministry.nameCkb;
    return ministry.name;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1F2937', '#111827']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kurdistan Digital Ministries</Text>
        <Text style={styles.headerSubtitle}>Government Services</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {MINISTRIES.map((ministry) => (
            <TouchableOpacity
              key={ministry.id}
              style={styles.ministryCard}
              onPress={() => openMinistryWebsite(ministry.url)}
            >
              <LinearGradient
                colors={[ministry.color, ministry.color + 'DD']}
                style={styles.ministryGradient}
              >
                <View style={styles.ministryIcon}>
                  <Ionicons name={ministry.icon as any} size={32} color="white" />
                </View>
                <Text style={styles.ministryName}>{getMinistryName(ministry)}</Text>
                <View style={styles.externalLink}>
                  <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.8)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#F59E0B" />
          <Text style={styles.infoText}>
            Click any ministry to visit their official website and access government services.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ministryCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  ministryGradient: {
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  ministryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  ministryName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  externalLink: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F59E0B20',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  infoText: {
    flex: 1,
    color: '#F59E0B',
    fontSize: 14,
    lineHeight: 20,
  },
});
