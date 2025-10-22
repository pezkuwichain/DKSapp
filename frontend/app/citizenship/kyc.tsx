import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { api } from '../../utils/api';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function KYCScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, updateUserStatus } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    nationality: 'Kurdish',
    document_type: 'National ID',
  });
  
  const [idImage, setIdImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  const pickImage = async (type: 'id' | 'selfie') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: type === 'id' ? [4, 3] : [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      if (type === 'id') {
        setIdImage(result.assets[0].uri);
      } else {
        setSelfieImage(result.assets[0].uri);
      }
    }
  };

  const takeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelfieImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.date_of_birth) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const result = await api.submitKYC(user!.user_id, formData);
      
      if (result.success) {
        setTimeout(() => {
          setStep('success');
          updateUserStatus(true, result.new_trust_score);
          
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 2000);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit KYC');
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
          <Animated.View entering={ZoomIn} style={styles.processingContent}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.processingText}>{t('citizenship.processing')}</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  if (step === 'success') {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient colors={['#10B981', '#059669']} style={styles.gradient}>
          <Animated.View entering={ZoomIn} style={styles.successContent}>
            <Ionicons name="checkmark-circle" size={100} color="white" />
            <Text style={styles.successTitle}>{t('citizenship.approved')}</Text>
            <Text style={styles.successSubtitle}>{t('citizenship.trustScoreIncreased')}</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeIn}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.title}>{t('citizenship.title')}</Text>
            <Text style={styles.subtitle}>{t('citizenship.subtitle')}</Text>

            <View style={styles.form}>
              <Animated.View entering={FadeInDown.delay(100)} style={styles.inputGroup}>
                <Text style={styles.label}>{t('citizenship.fullName')} *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.full_name}
                  onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                  placeholder="John Doe"
                  placeholderTextColor="#6B7280"
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200)} style={styles.inputGroup}>
                <Text style={styles.label}>{t('citizenship.dateOfBirth')} *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.date_of_birth}
                  onChangeText={(text) => setFormData({ ...formData, date_of_birth: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#6B7280"
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300)} style={styles.inputGroup}>
                <Text style={styles.label}>{t('citizenship.nationality')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nationality}
                  onChangeText={(text) => setFormData({ ...formData, nationality: text })}
                  placeholder="Kurdish"
                  placeholderTextColor="#6B7280"
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(400)} style={styles.inputGroup}>
                <Text style={styles.label}>{t('citizenship.documentType')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.document_type}
                  onChangeText={(text) => setFormData({ ...formData, document_type: text })}
                  placeholder="National ID / Passport"
                  placeholderTextColor="#6B7280"
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(500)} style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>{t('citizenship.uploadID')}</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => pickImage('id')}
                >
                  <Ionicons
                    name={idImage ? 'checkmark-circle' : 'cloud-upload'}
                    size={32}
                    color={idImage ? '#10B981' : '#9CA3AF'}
                  />
                  <Text style={styles.uploadText}>
                    {idImage ? 'ID Uploaded' : 'Upload ID Document'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(600)} style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>{t('citizenship.takeSelfie')}</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={takeSelfie}
                >
                  <Ionicons
                    name={selfieImage ? 'checkmark-circle' : 'camera'}
                    size={32}
                    color={selfieImage ? '#10B981' : '#9CA3AF'}
                  />
                  <Text style={styles.uploadText}>
                    {selfieImage ? 'Selfie Captured' : 'Take Selfie'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(700)}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.submitGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text style={styles.submitText}>{t('citizenship.submit')}</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputGroup: {},
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  uploadSection: {},
  uploadLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#374151',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  uploadText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  processingText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center',
  },
  successSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
  },
});