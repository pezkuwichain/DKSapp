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
  // Row 1
  { id: 'governance', icon: 'people', color: '#3B82F6', gated: true },
  { id: 'delegation', icon: 'swap-horizontal', color: '#8B5CF6', gated: false },
  { id: 'validator', icon: 'shield-checkmark', color: '#10B981', gated: true },
  
  // Row 2
  { id: 'stake', icon: 'trending-up', color: '#F59E0B', gated: false },
  { id: 'liquidity', icon: 'water', color: '#06B6D4', gated: false },
  { id: 'bridge', icon: 'git-branch', color: '#EC4899', gated: false },
  
  // Row 3
  { id: 'proposals', icon: 'document-text', color: '#EF4444', gated: true },
  { id: 'treasury', icon: 'cash', color: '#14B8A6', gated: true },
  { id: 'mev', icon: 'shield', color: '#6366F1', gated: false },
  
  // Row 4
  { id: 'identity', icon: 'finger-print', color: '#F97316', gated: false },
  { id: 'panel', icon: 'grid', color: '#A855F7', gated: true },
  { id: 'analytics', icon: 'stats-chart', color: '#0EA5E9', gated: false },
  
  // Row 5: Government
  { id: 'president', icon: 'person', color: '#DC2626', gated: false, type: 'government' },
  { id: 'government', icon: 'business', color: '#16A34A', gated: false, type: 'government' },
  { id: 'parliament', icon: 'home', color: '#EAB308', gated: false, type: 'government' },
  
  // Row 6
  { id: 'council', icon: 'people-circle', color: '#7C3AED', gated: false, type: 'government' },
  { id: 'foundation', icon: 'heart', color: '#EC4899', gated: false },
  { id: 'projects', icon: 'bulb', color: '#F59E0B', gated: false },
  
  // Row 7
  { id: 'business', icon: 'briefcase', color: '#3B82F6', gated: false },
  { id: 'social', icon: 'chatbubbles', color: '#10B981', gated: true },
  { id: 'health', icon: 'fitness', color: '#84CC16', gated: true },
  
  // Row 8
  { id: 'diaspora', icon: 'airplane', color: '#8B5CF6', gated: false },
  { id: 'kurdistan', icon: 'flag', color: '#DC2626', gated: false },
  { id: 'language', icon: 'chatbox', color: '#06B6D4', gated: false },
  
  // Row 9
  { id: 'culture', icon: 'color-palette', color: '#EC4899', gated: false },
  { id: 'history', icon: 'book', color: '#F97316', gated: false },
  { id: 'welati', icon: 'ribbon', color: '#EF4444', gated: true },
  
  // Row 10
  { id: 'perwerde', icon: 'school', color: '#14B8A6', gated: true },
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
      // Navigate based on feature type
      if (feature.type === 'government') {
        if (feature.id === 'government') {
          router.push('/features/ministries');
        } else if (feature.id === 'president') {
          router.push('/features/president');
        } else if (feature.id === 'parliament') {
          router.push('/features/parliament');
        } else if (feature.id === 'council') {
          router.push('/features/council');
        }
      } else {
        // Blockchain & other features
        if (feature.id === 'governance' || feature.id === 'proposals') {
          router.push('/features/governance');
        } else if (feature.id === 'perwerde') {
          router.push('/features/education');
        }
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
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  quickActionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  pillWrapper: {
    width: '31.5%',
  },
  featurePill: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 8,
    position: 'relative',
    minHeight: 90,
  },
  pillText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  pillLock: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
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
