
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import type { SocialLoginProvider } from '../types';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { FacebookIcon } from '../components/icons/FacebookIcon';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  Register: undefined;
};
type LoginNavigationProp = StackNavigationProp<AuthStackParamList>;


const LoginPage: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialLoginProvider | null>(null);
  const { login, socialLogin } = useAuth();

  const handleSubmit = async () => {
    if (loading || socialLoading) return;
    setError('');
    setLoading(true);
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: SocialLoginProvider) => {
    if (loading || socialLoading) return;
    setError('');
    setSocialLoading(provider);
    await socialLogin(provider);
    setSocialLoading(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              onPress={() => handleSocialLogin('google')}
              disabled={!!socialLoading || loading}
              style={[styles.socialButton, { backgroundColor: '#FFF' }]}
            >
              <GoogleIcon width={24} height={24} />
              <Text style={[styles.socialButtonText, { color: '#374151' }]}>
                {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleSocialLogin('facebook')}
              disabled={!!socialLoading || loading}
              style={[styles.socialButton, { backgroundColor: '#1877F2' }]}
            >
              <FacebookIcon width={24} height={24} color="#FFF" />
              <Text style={styles.socialButtonText}>
                {socialLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9ca3af"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9ca3af"
          />
          
          <TouchableOpacity
            style={[styles.button, (loading || !!socialLoading) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading || !!socialLoading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Log In</Text>}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?{' '}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F06292',
    textAlign: 'center',
    marginBottom: 40,
  },
  socialContainer: {
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9ca3af',
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#F06292',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 16,
    color: '#4b5563',
  },
  linkText: {
    fontSize: 16,
    color: '#F06292',
    fontWeight: 'bold',
  },
});

export default LoginPage;
