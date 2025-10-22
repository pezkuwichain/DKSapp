import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { api } from '../../utils/api';
import { TrustScoreBreakdown } from '../../types';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TrustHubScreen() {
  const { t } = useTranslation();
  const { user, trustBreakdown, setTrustBreakdown } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrustScore();
    }
  }, [user]);

  const loadTrustScore = async () => {
    try {
      const data = await api.getTrustScore(user!.user_id);
      setTrustBreakdown(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const scoreItems = [
    { key: 'base_score', label: t('trustHub.baseScore'), icon: 'star', color: '#3B82F6' },
    { key: 'citizen_bonus', label: t('trustHub.citizenBonus'), icon: 'shield-checkmark', color: '#F59E0B' },
    { key: 'education_bonus', label: t('trustHub.educationBonus'), icon: 'school', color: '#10B981' },
    { key: 'governance_bonus', label: t('trustHub.governanceBonus'), icon: 'people', color: '#8B5CF6' },
    { key: 'validator_bonus', label: t('trustHub.validatorBonus'), icon: 'cube', color: '#EC4899' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1F2937', '#111827']} style={styles.header}>
        <Text style={styles.headerTitle}>{t('trustHub.title')}</Text>
        <Text style={styles.headerSubtitle}>Your Reputation Score</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Animated.View entering={FadeInDown} style={styles.totalScoreCard}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.totalScoreGradient}
          >
            <Text style={styles.totalScoreLabel}>{t('trustHub.totalScore')}</Text>
            <Text style={styles.totalScoreValue}>{trustBreakdown?.total_score || user?.trust_score || 0}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((trustBreakdown?.total_score || 0) / 1000) * 100}%` },
                ]}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.sectionTitle}>{t('trustHub.breakdown')}</Text>

        {scoreItems.map((item, index) => (
          <Animated.View
            key={item.key}
            entering={FadeInDown.delay(100 + index * 50)}
            style={styles.scoreItem}
          >
            <View style={[styles.scoreIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>{item.label}</Text>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${((trustBreakdown?.[item.key as keyof TrustScoreBreakdown] || 0) / 500) * 100}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.scoreValue}>
              +{trustBreakdown?.[item.key as keyof TrustScoreBreakdown] || 0}
            </Text>
          </Animated.View>
        ))}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#F59E0B" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>How to Increase Your Score</Text>
            <Text style={styles.infoText}>
              • Become a Digital Citizen (+400 points){'
'}
              • Complete Education Courses (+50 per course){'
'}
              • Participate in Governance (+10 per vote){'
'}
              • Become a Validator (variable points)
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: { padding: 24, paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerSubtitle: { color: '#9CA3AF', fontSize: 14 },
  content: { flex: 1, padding: 16 },
  totalScoreCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 24, elevation: 8, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  totalScoreGradient: { padding: 32, alignItems: 'center' },
  totalScoreLabel: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 16, marginBottom: 8 },
  totalScoreValue: { color: 'white', fontSize: 64, fontWeight: 'bold' },
  progressBar: { width: '100%', height: 8, backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 4, marginTop: 16, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: 'white', borderRadius: 4 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  scoreItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#374151', gap: 16 },
  scoreIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  scoreInfo: { flex: 1 },
  scoreLabel: { color: 'white', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  scoreBar: { height: 6, backgroundColor: '#374151', borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreValue: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  infoCard: { flexDirection: 'row', backgroundColor: '#F59E0B20', padding: 20, borderRadius: 16, marginTop: 16, gap: 12, borderWidth: 1, borderColor: '#F59E0B' },
  infoTitle: { color: '#F59E0B', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  infoText: { color: '#F59E0B', fontSize: 14, lineHeight: 20 },
});