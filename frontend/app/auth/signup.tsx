import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';
import { useUserStore } from '../../store/userStore';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Sign Up fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  
  // Sign In fields
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await api.signup(email);
      if (result.success) {
        const userResult = await api.getUser(result.user_id);
        setUser(userResult);
        router.replace('/(tabs)');
      } else {
        setError('Signup failed');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    if (!signinEmail || !signinPassword) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // For demo, just create a new account
      const result = await api.signup(signinEmail);
      if (result.success) {
        const userResult = await api.getUser(result.user_id);
        setUser(userResult);
        router.replace('/(tabs)');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    // Direct wallet creation
    setLoading(true);
    try {
      const result = await api.signup();
      if (result.success) {
        const userResult = await api.getUser(result.user_id);
        setUser(userResult);
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <Text style={styles.logo}>PezkuwiChain</Text>
          <Text style={styles.subtitle}>Access your governance account</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'signin' && styles.tabActive]}
              onPress={() => {
                setActiveTab('signin');
                setError('');
              }}
            >
              <Text style={[styles.tabText, activeTab === 'signin' && styles.tabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'signup' && styles.tabActive]}
              onPress={() => {
                setActiveTab('signup');
                setError('');
              }}
            >
              <Text style={[styles.tabText, activeTab === 'signup' && styles.tabTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor="#6B7280"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Referral Code <Text style={styles.optional}>(Optional)</Text></Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="people-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter referral code"
                    placeholderTextColor="#6B7280"
                    value={referralCode}
                    onChangeText={setReferralCode}
                  />
                </View>
                <Text style={styles.helper}>If someone referred you, enter their code here</Text>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
                {loading ? <ActivityIndicator color="#1F2937" /> : <Text style={styles.primaryButtonText}>Create Account</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="#6B7280"
                    value={signinEmail}
                    onChangeText={setSigninEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    value={signinPassword}
                    onChangeText={setSigninPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rememberRow}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkboxBox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity style={styles.primaryButton} onPress={handleSignin} disabled={loading}>
                {loading ? <ActivityIndicator color="#1F2937" /> : <Text style={styles.primaryButtonText}>Sign In</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Connect Wallet */}
          <TouchableOpacity style={styles.walletButton} onPress={handleConnectWallet} disabled={loading}>
            <Ionicons name="wallet-outline" size={20} color="#9CA3AF" />
            <Text style={styles.walletButtonText}>Connect Wallet</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A3E635',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1F2937',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F4F6',
  },
  optional: {
    color: '#6B7280',
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#F3F4F6',
    fontSize: 16,
    paddingVertical: 12,
  },
  helper: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  error: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#7F1D1D20',
    padding: 12,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkboxLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  forgotPassword: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#6B7280',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  walletButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  terms: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  termsLink: {
    color: '#10B981',
    fontWeight: '600',
  },
});