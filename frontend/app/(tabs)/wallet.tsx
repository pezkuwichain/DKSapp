import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { api } from '../../utils/api';
import QRCode from 'react-native-qrcode-svg';

export default function WalletScreen() {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [showQR, setShowQR] = useState(false);
  const [sendData, setSendData] = useState({ address: '', amount: '', token: 'HEZ' });
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const txs = await api.getTransactions(user!.user_id);
      setTransactions(txs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async () => {
    try {
      await api.createTransaction(user!.user_id, {
        to_address: sendData.address,
        amount: parseFloat(sendData.amount),
        token_type: sendData.token,
      });
      const updatedUser = await api.getUser(user!.user_id);
      setUser(updatedUser);
      setSendData({ address: '', amount: '', token: 'HEZ' });
      loadTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1F2937', '#111827']} style={styles.header}>
        <Text style={styles.headerTitle}>{t('wallet.balance')}</Text>
        <View style={styles.balanceContainer}>
          <View style={styles.tokenBalance}>
            <Text style={styles.tokenLabel}>HEZ</Text>
            <Text style={styles.tokenAmount}>{user.hez_balance.toFixed(2)}</Text>
          </View>
          <View style={styles.tokenBalance}>
            <Text style={styles.tokenLabel}>PEZ</Text>
            <Text style={styles.tokenAmount}>{user.pez_balance.toFixed(2)}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'send' && styles.tabActive]}
          onPress={() => setActiveTab('send')}
        >
          <Text style={[styles.tabText, activeTab === 'send' && styles.tabTextActive]}>
            {t('wallet.send')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'receive' && styles.tabActive]}
          onPress={() => setActiveTab('receive')}
        >
          <Text style={[styles.tabText, activeTab === 'receive' && styles.tabTextActive]}>
            {t('wallet.receive')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'send' ? (
          <View style={styles.sendForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recipient Address</Text>
              <TextInput
                style={styles.input}
                value={sendData.address}
                onChangeText={(text) => setSendData({ ...sendData, address: text })}
                placeholder="0x..."
                placeholderTextColor="#6B7280"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                value={sendData.amount}
                onChangeText={(text) => setSendData({ ...sendData, amount: text })}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#6B7280"
              />
            </View>
            <View style={styles.tokenSelector}>
              <TouchableOpacity
                style={[styles.tokenOption, sendData.token === 'HEZ' && styles.tokenOptionActive]}
                onPress={() => setSendData({ ...sendData, token: 'HEZ' })}
              >
                <Text style={styles.tokenOptionText}>HEZ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tokenOption, sendData.token === 'PEZ' && styles.tokenOptionActive]}
                onPress={() => setSendData({ ...sendData, token: 'PEZ' })}
              >
                <Text style={styles.tokenOptionText}>PEZ</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.receiveContainer}>
            <Text style={styles.receiveLabel}>Your Wallet Address</Text>
            <TouchableOpacity style={styles.addressContainer} onPress={() => setShowQR(true)}>
              <Text style={styles.address}>{user.wallet_address}</Text>
              <Ionicons name="qr-code" size={24} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>{t('wallet.transactions')}</Text>
          {transactions.map((tx) => (
            <View key={tx.transaction_id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name={tx.from_address === user.wallet_address ? 'arrow-up' : 'arrow-down'}
                  size={20}
                  color={tx.from_address === user.wallet_address ? '#EF4444' : '#10B981'}
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAddress}>
                  {tx.from_address === user.wallet_address ? 'Sent to' : 'Received from'}
                  {' '}
                  {tx.from_address === user.wallet_address
                    ? tx.to_address.slice(0, 10)
                    : tx.from_address.slice(0, 10)}...
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(tx.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>
                {tx.from_address === user.wallet_address ? '-' : '+'}{tx.amount} {tx.token_type}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showQR} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.qrModal}>
            <Text style={styles.qrTitle}>Scan to Send</Text>
            <QRCode value={user.wallet_address} size={200} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowQR(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  balanceContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  tokenBalance: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
  },
  tokenLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  tokenAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1F2937',
  },
  tabActive: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sendForm: {
    gap: 16,
  },
  inputGroup: {},
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
  },
  tokenSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  tokenOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tokenOptionActive: {
    borderColor: '#F59E0B',
  },
  tokenOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#F59E0B',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  receiveContainer: {
    gap: 16,
  },
  receiveLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addressContainer: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  address: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  transactionsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAddress: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  transactionDate: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  transactionAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModal: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 20,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});