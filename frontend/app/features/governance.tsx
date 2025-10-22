import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { api } from '../../utils/api';
import { Proposal } from '../../types';

export default function GovernanceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useUserStore();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await api.getProposals();
      setProposals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string, voteType: 'for' | 'against') => {
    if (!user?.is_citizen) return;
    try {
      await api.vote(user.user_id, proposalId, voteType);
      loadProposals();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1F2937', '#111827']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('governance.title')}</Text>
        <Text style={styles.headerSubtitle}>Welati - Digital Democracy</Text>
      </LinearGradient>

      {!user?.is_citizen && (
        <View style={styles.warningBanner}>
          <Ionicons name="information-circle" size={24} color="#F59E0B" />
          <Text style={styles.warningText}>Only Digital Citizens can vote</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{t('governance.proposals')}</Text>
        {loading ? (
          <ActivityIndicator color="#F59E0B" style={{ marginTop: 32 }} />
        ) : proposals.length === 0 ? (
          <Text style={styles.emptyText}>No active proposals</Text>
        ) : (
          proposals.map((proposal) => (
            <View key={proposal.proposal_id} style={styles.proposalCard}>
              <View style={styles.proposalHeader}>
                <Text style={styles.proposalTitle}>{proposal.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                  <Text style={[styles.statusText, { color: '#10B981' }]}>{proposal.status}</Text>
                </View>
              </View>
              <Text style={styles.proposalDescription}>{proposal.description}</Text>
              <View style={styles.votesContainer}>
                <View style={styles.voteBar}>
                  <View style={styles.voteInfo}>
                    <Text style={styles.voteLabel}>For</Text>
                    <Text style={styles.voteCount}>{proposal.votes_for}</Text>
                  </View>
                  <View style={styles.voteInfo}>
                    <Text style={styles.voteLabel}>Against</Text>
                    <Text style={styles.voteCount}>{proposal.votes_against}</Text>
                  </View>
                </View>
              </View>
              {user?.is_citizen && (
                <View style={styles.voteButtons}>
                  <TouchableOpacity
                    style={[styles.voteButton, styles.voteButtonFor]}
                    onPress={() => handleVote(proposal.proposal_id, 'for')}
                  >
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.voteButtonText}>{t('governance.voteFor')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.voteButton, styles.voteButtonAgainst]}
                    onPress={() => handleVote(proposal.proposal_id, 'against')}
                  >
                    <Ionicons name="close" size={20} color="white" />
                    <Text style={styles.voteButtonText}>{t('governance.voteAgainst')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: { padding: 24, paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerSubtitle: { color: '#9CA3AF', fontSize: 14 },
  warningBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B20', padding: 16, margin: 16, borderRadius: 12, gap: 12 },
  warningText: { color: '#F59E0B', flex: 1, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 32 },
  proposalCard: { backgroundColor: '#1F2937', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#374151' },
  proposalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  proposalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  proposalDescription: { color: '#9CA3AF', fontSize: 14, marginBottom: 16 },
  votesContainer: { marginBottom: 16 },
  voteBar: { flexDirection: 'row', gap: 16 },
  voteInfo: { flex: 1, backgroundColor: '#374151', padding: 12, borderRadius: 8 },
  voteLabel: { color: '#9CA3AF', fontSize: 12, marginBottom: 4 },
  voteCount: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  voteButtons: { flexDirection: 'row', gap: 12 },
  voteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 8 },
  voteButtonFor: { backgroundColor: '#10B981' },
  voteButtonAgainst: { backgroundColor: '#EF4444' },
  voteButtonText: { color: 'white', fontWeight: '600' },
});