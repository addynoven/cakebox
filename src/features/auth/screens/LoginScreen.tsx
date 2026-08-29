import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AuthRepository } from '../repositories/auth.repository';
import { useAuthStore } from '../store/useAuthStore';
import { colors, spacing, radius, typography, shadows } from '../../../core/theme';

const GoogleLogo = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

const BackgroundDoodles = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.doodleItem, { top: 95, left: 16 }]}>
      <Svg width={32} height={32} viewBox="0 0 36 36">
        <Circle cx="18" cy="8" r="4" fill="#FF5E89" opacity={0.6} />
        <Path d="M10 16 Q18 10 26 16 Q28 20 25 24 Q18 25 11 24 Q8 20 10 16 Z" fill="#FBCFE8" opacity={0.7} />
        <Path d="M11 23 L13 32 L23 32 L25 23 Z" fill="#FED7AA" stroke="#78350F" strokeWidth={1} opacity={0.6} />
      </Svg>
    </View>

    <View style={[styles.doodleItem, { top: 130, right: 20 }]}>
      <Svg width={36} height={30} viewBox="0 0 40 32">
        <Circle cx="30" cy="5" r="3" fill="#EF4444" opacity={0.6} />
        <Path d="M8 26 L32 12 L34 26 Z" fill="#FED7AA" stroke="#78350F" strokeWidth={1.2} opacity={0.6} />
        <Path d="M8 26 L32 12 L34 16 L10 28 Z" fill="#FBCFE8" opacity={0.6} />
      </Svg>
    </View>

    <View style={[styles.doodleItem, { top: 210, left: 14, transform: [{ rotate: '-35deg' }] }]}>
      <Svg width={30} height={14} viewBox="0 0 34 16">
        <Rect x="6" y="2" width="22" height="12" rx="3" fill="#FDBA74" stroke="#78350F" strokeWidth={1} opacity={0.55} />
        <Rect x="0" y="6" width="6" height="4" rx="1.5" fill="#FED7AA" stroke="#78350F" strokeWidth={0.8} opacity={0.55} />
        <Rect x="28" y="6" width="6" height="4" rx="1.5" fill="#FED7AA" stroke="#78350F" strokeWidth={0.8} opacity={0.55} />
      </Svg>
    </View>

    <View style={[styles.doodleItem, { top: 270, right: 20 }]}>
      <Text style={{ fontSize: 13, color: '#F59E0B', opacity: 0.45 }}>★</Text>
    </View>

    <View style={[styles.doodleItem, { bottom: 200, left: 22 }]}>
      <Text style={{ fontSize: 16, color: '#F59E0B', opacity: 0.45 }}>★</Text>
    </View>

    <View style={[styles.doodleItem, { bottom: 110, left: 18, transform: [{ rotate: '12deg' }] }]}>
      <Svg width={32} height={20} viewBox="0 0 36 22">
        <Path d="M4 6 L32 6 L28 18 L8 18 Z" fill="none" stroke="#78350F" strokeWidth={1.2} opacity={0.45} />
        <Circle cx="18" cy="2" r="2" fill="#FF5E89" opacity={0.5} />
      </Svg>
    </View>

    <View style={[styles.doodleItem, { bottom: 95, right: 22, transform: [{ rotate: '8deg' }] }]}>
      <Svg width={30} height={30} viewBox="0 0 36 36">
        <Circle cx="18" cy="8" r="3.5" fill="#FF4B72" opacity={0.55} />
        <Path d="M10 16 Q18 11 26 16 Q28 20 25 24 Q18 25 11 24 Q8 20 10 16 Z" fill="#FCE7F3" opacity={0.7} />
        <Path d="M11 23 L13 32 L23 32 L25 23 Z" fill="#FED7AA" stroke="#78350F" strokeWidth={1} opacity={0.55} />
      </Svg>
    </View>
  </View>
);

const DripIcing = () => (
  <View style={styles.dripContainer} pointerEvents="none">
    <Svg viewBox="0 0 1200 160" preserveAspectRatio="none" width="100%" height={90}>
      <Path
        d="M0,0 L1200,0 L1200,50 C1140,50 1120,120 1060,120 C1000,120 980,40 920,40 C860,40 840,140 780,140 C720,140 700,55 640,55 C580,55 560,145 500,145 C440,145 420,45 360,45 C300,45 280,130 220,130 C160,130 140,35 80,35 C40,35 20,75 0,75 Z"
        fill="rgba(255, 255, 255, 0.95)"
      />
    </Svg>
  </View>
);

interface LoginScreenProps {
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { setUser, showToast } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/invalid-email') return 'Invalid email address format.';
    if (
      code === 'auth/user-not-found' ||
      code === 'auth/wrong-password' ||
      code === 'auth/invalid-credential'
    ) {
      return 'Incorrect email or password.';
    }
    if (code === 'auth/email-already-in-use') return 'An account with this email already exists.';
    if (code === 'auth/weak-password') return 'Password must be at least 6 characters.';
    return err?.message || 'Authentication failed. Please try again.';
  };

  const handleFinish = (user: any) => {
    setUser(user);
    showToast(`👋 Welcome, ${user.name || 'Sweet Baker'}!`);
    if (onSuccess) {
      onSuccess();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password || (isRegister && !name.trim())) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        const profile = await AuthRepository.signUpWithEmail(name.trim(), email.trim(), password);
        handleFinish(profile);
      } else {
        const profile = await AuthRepository.signInWithEmail(email.trim(), password);
        handleFinish(profile);
      }
    } catch (err: any) {
      console.warn('Auth Error:', err);
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await AuthRepository.signInWithGoogle();
      handleFinish(profile);
    } catch (err: any) {
      console.warn('Google Sign In warning:', err);
      if (err.code === 'SIGN_IN_CANCELLED' || err.message?.includes('cancel')) {
        setError(null);
      } else {
        setError(formatAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email above first.');
      return;
    }
    try {
      await AuthRepository.resetPassword(email.trim());
      Alert.alert('Reset Link Sent', `A password reset link was sent to ${email.trim()}`);
    } catch (err: any) {
      setError(formatAuthError(err));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFA5BA', '#FFB6C6', '#FEDECA', '#FFEFE3']}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      <DripIcing />
      <BackgroundDoodles />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBrandArea}>
            <Text style={styles.brandTitle}>CakeBox</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>
              {isRegister ? 'Create Account' : 'Welcome Back!'}
            </Text>
            <Text style={styles.cardSubheading}>
              {isRegister
                ? 'Join to order personalized treats'
                : 'Sign in to order your favorite treats'}
            </Text>

            <TouchableOpacity
              onPress={handleGoogleAuth}
              disabled={loading}
              style={styles.googleBtn}
              activeOpacity={0.85}
            >
              <GoogleLogo size={20} />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR WITH EMAIL</Text>
              <View style={styles.dividerLine} />
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {isRegister && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <View style={styles.inputWrapper}>
                  <UserIcon size={18} color="#9E8A8E" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Jane Baker"
                    placeholderTextColor="#B8A4A8"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color="#9E8A8E" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="hello@example.com"
                  placeholderTextColor="#B8A4A8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                {!isRegister && (
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#9E8A8E" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 40 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#B8A4A8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#9E8A8E" />
                  ) : (
                    <Eye size={18} color="#9E8A8E" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleEmailAuth}
              disabled={loading}
              style={styles.primaryBtn}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {isRegister ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.toggleRow}>
              <Text style={styles.togglePrompt}>
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
              >
                <Text style={styles.toggleAction}>
                  {isRegister ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
  dripContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  doodleItem: {
    position: 'absolute',
    zIndex: 5,
  },
  keyboardView: {
    flex: 1,
    zIndex: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  topBrandArea: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.darkChocolate,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderWidth: 1.5,
    borderColor: colors.borderPink,
    ...shadows.medium,
  },
  cardHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.darkChocolate,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubheading: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPink,
    borderRadius: 16,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 16,
    ...shadows.soft,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.darkChocolate,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderPink,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.darkChocolate,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F9',
    borderWidth: 1.5,
    borderColor: colors.borderPink,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.darkChocolate,
    fontWeight: '600',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    ...shadows.pink,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  togglePrompt: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleAction: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
});
