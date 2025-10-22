import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../store/userStore';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const FEATURES = [
  // Row 1: Governance & Core
  { id: 'governance', name: 'Yönetişim', icon: 'people', color: '#DC2626', gated: true },
  { id: 'delegation', name: 'Delegasyon', icon: 'swap-horizontal', color: '#16A34A', gated: false },
  { id: 'validator', name: 'Validator', icon: 'shield-checkmark', color: '#EAB308', gated: true },
  { id: 'stake', name: 'Stake', icon: 'trending-up', color: '#DC2626', gated: false },
  
  // Row 2: DeFi Features
  { id: 'liquidity', name: 'Likidite', icon: 'water', color: '#16A34A', gated: false },
  { id: 'bridge', name: 'Köprü', icon: 'git-branch', color: '#EAB308', gated: false },
  { id: 'proposals', name: 'Teklifler', icon: 'document-text', color: '#DC2626', gated: true },
  { id: 'treasury', name: 'Hazine', icon: 'cash', color: '#16A34A', gated: true },
  
  // Row 3: Protection & Identity
  { id: 'mev', name: 'MEV Koruma', icon: 'shield', color: '#EAB308', gated: false },
  { id: 'identity', name: 'Kimlik', icon: 'finger-print', color: '#DC2626', gated: false },
  { id: 'panel', name: 'Panel', icon: 'grid', color: '#DC2626', gated: true },
  { id: 'analytics', name: 'Analitik', icon: 'stats-chart', color: '#EAB308', gated: false },
  
  // Row 4: Government Services
  { id: 'president', name: 'Başkanlık', icon: 'person', color: '#DC2626', gated: false, type: 'government' },
  { id: 'government', name: 'Bakanlıklar', icon: 'business', color: '#16A34A', gated: false, type: 'government' },
  { id: 'parliament', name: 'Meclis', icon: 'home', color: '#EAB308', gated: false, type: 'government' },
  { id: 'council', name: 'Divan', icon: 'people-circle', color: '#DC2626', gated: false, type: 'government' },
  
  // Row 5: Community
  { id: 'foundation', name: 'Vakıf', icon: 'heart', color: '#16A34A', gated: false },
  { id: 'projects', name: 'Projeler', icon: 'bulb', color: '#EAB308', gated: false },
  { id: 'business', name: 'İşletme', icon: 'briefcase', color: '#DC2626', gated: false },
  { id: 'social', name: 'Sosyal', icon: 'chatbubbles', color: '#16A34A', gated: true },
  
  // Row 6: Services
  { id: 'health', name: 'Sağlık', icon: 'fitness', color: '#EAB308', gated: true },
  { id: 'diaspora', name: 'Diaspora', icon: 'airplane', color: '#DC2626', gated: false },
  { id: 'kurdistan', name: 'Kurdistan', icon: 'flag', color: '#16A34A', gated: false },
  { id: 'language', name: 'Dil', icon: 'chatbox', color: '#EAB308', gated: false },
  
  // Row 7: Culture & Education
  { id: 'culture', name: 'Kültür', icon: 'color-palette', color: '#DC2626', gated: false },
  { id: 'history', name: 'Tarih', icon: 'book', color: '#16A34A', gated: false },
  { id: 'welati', name: 'Welati', icon: 'ribbon', color: '#EAB308', gated: true },
  { id: 'perwerde', name: 'Perwerde', icon: 'school', color: '#DC2626', gated: true },
];

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, setUser, setTrustBreakdown, networkMode } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showGatingModal, setShowGatingModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user?.user_id]);

  const loadUserData = async () => {
    if (!user) return;
    try {
      const [userData, trustData] = await Promise.all([
        api.getUser(user.user_id),
        api.getTrustScore(user.user_id),
      ]);
      setUser(userData);
      setTrustBreakdown(trustData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleFeaturePress = (feature: any) => {
    if (feature.gated && !user?.is_citizen) {
      setSelectedFeature(feature.name);
      setShowGatingModal(true);
    } else {
      // Navigate to feature based on type
      if (feature.type === 'blockchain') {
        // Blockchain features
        if (feature.id === 'welati' || feature.id === 'proposals') {
          router.push('/(tabs)/governance');
        } else if (feature.id === 'perwerde') {
          router.push('/features/education');
        }
        // Add more blockchain feature navigation here
      } else if (feature.type === 'ministry') {
        // Ministry/Government features
        if (feature.id === 'ministries') {
          router.push('/features/ministries');
        }
        // Other ministry features can navigate to their specific pages
      }
    }
  };

  const handleBecomeCitizen = () => {
    router.push('/citizenship/kyc');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient colors={['#1F2937', '#374151']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>PezkuwiChain</Text>
              <Text style={styles.walletAddress}>
                {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
              </Text>
            </View>
            <View style={styles.networkBadge}>
              <Text style={styles.networkText}>
                {networkMode === 'mainnet' ? t('network.mainnet') : t('network.testnet')}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Balance Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.balanceCard}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceLabel}>HEZ Balance</Text>
                <Text style={styles.balanceAmount}>{user.hez_balance.toFixed(2)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.balanceLabel}>PEZ Balance</Text>
                <Text style={styles.balanceAmount}>{user.pez_balance.toFixed(2)}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Trust Score */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.trustCard}>
          <View style={styles.trustHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#F59E0B" />
            <Text style={styles.trustLabel}>{t('dashboard.trustScore')}</Text>
          </View>
          <Text style={styles.trustScore}>{user.trust_score}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(user.trust_score / 1000) * 100}%` }]} />
          </View>
          <Text style={styles.trustSubtext}>
            {user.is_citizen ? 'Digital Citizen' : 'Standard User'}
          </Text>
        </Animated.View>

        {/* Become Citizen Button */}
        {!user.is_citizen && (
          <Animated.View entering={FadeInDown.delay(300)}>
            <TouchableOpacity style={styles.citizenButton} onPress={handleBecomeCitizen}>
              <LinearGradient
                colors={['#EF4444', '#F97316']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.citizenGradient}
              >
                <Ionicons name="star" size={24} color="white" />
                <Text style={styles.citizenButtonText}>{t('dashboard.becomeCitizen')}</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {user.is_citizen && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.citizenBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.citizenBadgeText}>{t('dashboard.myDigitalID')}</Text>
          </Animated.View>
        )}

        {/* Referral Widget */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.referralCard}>
          <View style={styles.referralHeader}>
            <View style={styles.referralIconContainer}>
              <Ionicons name="people" size={24} color="#8B5CF6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.referralTitle}>Invite Friends & Earn</Text>
              <Text style={styles.referralSubtitle}>Get rewards for each referral</Text>
            </View>
            <View style={styles.referralBadge}>
              <Ionicons name="gift" size={16} color="#F59E0B" />
              <Text style={styles.referralBadgeText}>50 PEZ</Text>
            </View>
          </View>
          
          <View style={styles.referralCodeContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
              <Text style={styles.referralCode}>{user.user_id.slice(0, 8).toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="#10B981" />
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.referralStats}>
            <View style={styles.referralStat}>
              <Text style={styles.referralStatValue}>0</Text>
              <Text style={styles.referralStatLabel}>Referrals</Text>
            </View>
            <View style={styles.referralDivider} />
            <View style={styles.referralStat}>
              <Text style={styles.referralStatValue}>0 PEZ</Text>
              <Text style={styles.referralStatLabel}>Earned</Text>
            </View>
            <View style={styles.referralDivider} />
            <View style={styles.referralStat}>
              <Text style={styles.referralStatValue}>+10</Text>
              <Text style={styles.referralStatLabel}>Trust Score</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social" size={18} color="white" />
            <Text style={styles.shareButtonText}>Share Referral Link</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.quickActionsContainer}>
          <TouchableOpacity style={[styles.quickActionPill, { backgroundColor: '#DC2626' }]}>
            <Ionicons name="arrow-up" size={20} color="white" />
            <Text style={styles.quickActionText}>Gönder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionPill, { backgroundColor: '#16A34A' }]}>
            <Ionicons name="arrow-down" size={20} color="white" />
            <Text style={styles.quickActionText}>Al</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionPill, { backgroundColor: '#EAB308' }]}>
            <Ionicons name="swap-horizontal" size={20} color="white" />
            <Text style={styles.quickActionText}>Takas</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Features Grid */}
        <Animated.View entering={FadeInDown.delay(450)} style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          <View style={styles.pillGrid}>
            {FEATURES.map((feature, index) => (
              <Animated.View
                key={feature.id}
                entering={FadeInDown.delay(500 + index * 30)}
                style={styles.pillWrapper}
              >
                <TouchableOpacity
                  style={[styles.featurePill, { backgroundColor: feature.color }]}
                  onPress={() => handleFeaturePress(feature)}
                >
                  <Ionicons name={feature.icon as any} size={24} color="white" />
                  <Text style={styles.pillText}>{feature.name}</Text>
                  {feature.gated && !user.is_citizen && (
                    <View style={styles.pillLock}>
                      <Ionicons name="lock-closed" size={10} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Gating Modal */}
      <Modal
        visible={showGatingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="lock-closed" size={48} color="#EF4444" />
            <Text style={styles.modalTitle}>{t('gating.title')}</Text>
            <Text style={styles.modalMessage}>{t('gating.message')}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowGatingModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>{t('gating.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={() => {
                  setShowGatingModal(false);
                  handleBecomeCitizen();
                }}
              >
                <Text style={styles.modalButtonTextPrimary}>{t('gating.becomeCitizen')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  walletAddress: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  networkBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  networkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  balanceCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  balanceGradient: {
    padding: 24,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  trustCard: {
    backgroundColor: '#1F2937',
    margin: 16,
    marginTop: 0,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  trustLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  trustScore: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  trustSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  citizenButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  citizenGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  citizenButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  citizenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B98120',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
  },
  citizenBadgeText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '31%',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureName: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  modalMessage: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonTextSecondary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  referralCard: {
    backgroundColor: '#1F2937',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  referralIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF620',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  referralSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  referralBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  referralBadgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  referralCodeLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  referralCode: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  copyButtonText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  referralStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  referralStat: {
    flex: 1,
    alignItems: 'center',
  },
  referralStatValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  referralStatLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  referralDivider: {
    width: 1,
    backgroundColor: '#374151',
    marginHorizontal: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
