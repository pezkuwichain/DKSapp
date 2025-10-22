import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ku', name: 'Kurdî (Kurmancî)' },
  { code: 'ckb', name: 'کوردی (سۆرانی)' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ar', name: 'العربية' },
  { code: 'fa', name: 'فارسی' },
];

export default function WelcomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleLanguageSelect = (code: string) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
  };

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  return (
    <LinearGradient colors={['#E53E3E', '#DD6B20', '#D69E2E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
          <Text style={styles.description}>{t('welcome.description')}</Text>
        </View>

        <View style={styles.languageSection}>
          <Text style={styles.languageTitle}>{t('welcome.selectLanguage')}</Text>
          <View style={styles.languageGrid}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageCard,
                  selectedLang === lang.code && styles.languageCardSelected,
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text
                  style={[
                    styles.langName,
                    selectedLang === lang.code && styles.langNameSelected,
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>{t('welcome.getStarted')}</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  languageSection: {
    marginBottom: 32,
  },
  languageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  languageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'white',
  },
  flag: {
    fontSize: 32,
    marginBottom: 8,
  },
  langName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  langNameSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});