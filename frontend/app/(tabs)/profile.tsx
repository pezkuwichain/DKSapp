import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, logout, networkMode, setNetworkMode } = useUserStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  const toggleNetwork = () => {
    setNetworkMode(networkMode === 'mainnet' ? 'testnet' : 'mainnet');
  };

  const settings = [
    { icon: 'language', label: 'Language', value: i18n.language.toUpperCase(), onPress: () => {} },
    { icon: 'globe', label: 'Network', value: networkMode, onPress: toggleNetwork },
    { icon: 'shield-checkmark', label: 'KYC Status', value: user?.kyc_status, onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1F2937', '#111827']} style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="white" />
          </View>
          <Text style={styles.walletAddress}>{user?.wallet_address}</Text>
          <View style={styles.statusBadge}>
            <Ionicons
              name={user?.is_citizen ? 'checkmark-circle' : 'alert-circle'}
              size={16}
              color={user?.is_citizen ? '#10B981' : '#9CA3AF'}
            />
            <Text style={[styles.statusText, { color: user?.is_citizen ? '#10B981' : '#9CA3AF' }]}>
              {user?.is_citizen ? 'Digital Citizen' : 'Standard User'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settings.map((setting, index) => (
            <TouchableOpacity key={index} style={styles.settingItem} onPress={setting.onPress}>
              <View style={styles.settingLeft}>
                <Ionicons name={setting.icon as any} size={24} color="#F59E0B" />
                <Text style={styles.settingLabel}>{setting.label}</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{setting.value}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PezkuwiChain v1.0</Text>
          <Text style={styles.footerText}>Blockchain for Kurdish Nation</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: { padding: 24, paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  content: { flex: 1, padding: 16 },
  userCard: { backgroundColor: '#1F2937', padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#374151' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  walletAddress: { color: 'white', fontSize: 14, marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#374151', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  statusText: { fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1F2937', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#374151' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { color: 'white', fontSize: 16 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { color: '#9CA3AF', fontSize: 14 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EF444420', padding: 16, borderRadius: 12, gap: 8, borderWidth: 1, borderColor: '#EF4444' },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  footer: { marginTop: 32, alignItems: 'center', paddingBottom: 32 },
  footerText: { color: '#6B7280', fontSize: 12, marginBottom: 4 },
});