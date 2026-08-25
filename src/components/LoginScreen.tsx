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
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { UserProfile } from '../types';
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  resetPassword
} from '../services/firebase';
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react-native';

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

// Background cute dessert doodles matching the design
const BackgroundDoodles = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Top-left Cupcake */}
    <View style={[styles.doodleItem, { top: 95, left: 16 }]}>
      <Svg width={32} height={32} viewBox="0 0 36 36">
        <Circle cx="18" cy="8" r="4" fill="#FF5E89" opacity={0.6} />
        <Path d="M10 16 Q18 10 26 16 Q28 20 25 24 Q18 25 11 24 Q8 20 10 16 Z" fill="#FBCFE8" opacity={0.7} />
        <Path d="M11 23 L13 32 L23 32 L25 23 Z" fill="#FED7AA" stroke="#78350F" strokeWidth={1} opacity={0.6} />
      </Svg>
    </View>

    {/* Top-right Cake slice */}
    <View style={[styles.doodleItem, { top: 130, right: 20 }]}>
      <Svg width={36} height={30} viewBox="0 0 40 32">
        <Circle cx="30" cy="5" r="3" fill="#EF4444" opacity={0.6} />
        <Path d="M8 26 L32 12 L34 26 Z" fill="#FED7AA" stroke="#78350F" strokeWidth={1.2} opacity={0.6} />
        <Path d="M8 26 L32 12 L34 16 L10 28 Z" fill="#FBCFE8" opacity={0.6} />
      </Svg>
    </View>

    {/* Mid-left Rolling Pin */}
    <View style={[styles.doodleItem, { top: 210, left: 14, transform: [{ rotate: '-35deg' }] }]}>
      <Svg width={30} height={14} viewBox="0 0 34 16">
        <Rect x="6" y="2" width="22" height="12" rx="3" fill="#FDBA74" stroke="#78350F" strokeWidth={1} opacity={0.55} />
        <Rect x="0" y="6" width="6" height="4" rx="1.5" fill="#FED7AA" stroke="#78350F" strokeWidth={0.8} opacity={0.55} />
        <Rect x="28" y="6" width="6" height="4" rx="1.5" fill="#FED7AA" stroke="#78350F" strokeWidth={0.8} opacity={0.55} />
      </Svg>
    </View>

    {/* Star 1 */}
    <View style={[styles.doodleItem, { top: 270, right: 20 }]}>
      <Text style={{ fontSize: 13, color: '#F59E0B', opacity: 0.45 }}>★</Text>
    </View>

    {/* Star 2 */}
    <View style={[styles.doodleItem, { bottom: 200, left: 22 }]}>
      <Text style={{ fontSize: 16, color: '#F59E0B', opacity: 0.45 }}>★</Text>
    </View>

    {/* Lower-left Baking Tray */}
    <View style={[styles.doodleItem, { bottom: 110, left: 18, transform: [{ rotate: '12deg' }] }]}>
      <Svg width={32} height={20} viewBox="0 0 36 22">
        <Path d="M4 6 L32 6 L28 18 L8 18 Z" fill="none" stroke="#78350F" strokeWidth={1.2} opacity={0.45} />
        <Circle cx="18" cy="2" r="2" fill="#FF5E89" opacity={0.5} />
      </Svg>
    </View>

    {/* Lower-right Cupcake */}
    <View style={[styles.doodleItem, { bottom: 95, right: 22, transform: [{ rotate: '8deg' }] }]}>
      <Svg width={30} height={30} viewBox="0 0 36 36">
        <Circle cx="18" cy="8" r="3.5" fill="#FF4B72" opacity={0.55} />
        <Path d="M10 16 Q18 11 26 16 Q28 20 25 24 Q18 25 11 24 Q8 20 10 16 Z" fill="#FCE7F3" opacity={0.7} />
        <Path d="M11 23 L13 32 L23 32 L25 23 Z" fill="#FED7AA" stroke="#78350F" strokeWidth={1} opacity={0.55} />
      </Svg>
    </View>
  </View>
);

// Top Drip Icing Header
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
  onSuccess: (user: Partial<UserProfile>) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
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

  const handleEmailAuth = async () => {
    if (!email.trim() || !password || (isRegister && !name.trim())) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        const profile = await registerWithEmail(name.trim(), email.trim(), password);
        onSuccess(profile);
      } else {
        const profile = await signInWithEmail(email.trim(), password);
        onSuccess(profile);
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
      const profile = await signInWithGoogle();
      onSuccess(profile);
    } catch (err: any) {
      console.warn('Google Sign In failed or was cancelled:', err);
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
      await resetPassword(email.trim());
      Alert.alert('Reset Link Sent', `A password reset link was sent to ${email.trim()}`);
    } catch (err: any) {
      setError(formatAuthError(err));
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FFA5BA', '#FFB6C6', '#FEDECA', '#FFEFE3']}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Drip Icing */}
      <DripIcing />

      {/* Background Doodles */}
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
          {/* Top Brand Name */}
          <View style={styles.topBrandArea}>
            <Text style={styles.brandTitle}>CakeBox</Text>
          </View>

          {/* Main Floating Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>
              {isRegister ? 'Create Account' : 'Welcome Back!'}
            </Text>
            <Text style={styles.cardSubheading}>
              {isRegister
                ? 'Join to order personalized treats'
                : 'Sign in to order your favorite treats'}
            </Text>

            {/* Google Sign-in */}
            <TouchableOpacity
              onPress={handleGoogleAuth}
              disabled={loading}
              style={styles.googleBtn}
              activeOpacity={0.85}
            >
              <GoogleLogo size={20} />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Divider OR WITH EMAIL */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerTag}>
                <Text style={styles.dividerTagText}>OR</Text>
                <Text style={styles.dividerTagText}>WITH</Text>
                <Text style={styles.dividerTagText}>EMAIL</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>

            {/* Error Banner */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.formArea}>
              {isRegister && (
                <View style={styles.inputContainer}>
                  <View style={[styles.iconBadge, { backgroundColor: '#8B5CF6' }]}>
                    <UserIcon size={16} color="#FFFFFF" />
                  </View>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Your Full Name"
                    placeholderTextColor="#A8949B"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <View style={[styles.iconBadge, { backgroundColor: '#FF6584' }]}>
                  <Mail size={16} color="#FFFFFF" />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Email Address"
                  placeholderTextColor="#A8949B"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <View style={[styles.iconBadge, { backgroundColor: '#F59E0B' }]}>
                  <Lock size={16} color="#FFFFFF" />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Password (min. 6 characters)"
                  placeholderTextColor="#A8949B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#9E8C91" />
                  ) : (
                    <Eye size={18} color="#9E8C91" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Forgot Password Link */}
              {!isRegister && (
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  style={styles.forgotBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleEmailAuth}
                disabled={loading}
                activeOpacity={0.88}
                style={styles.submitBtnWrapper}
              >
                <LinearGradient
                  colors={['#FF4B72', '#FF758C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      {isRegister ? 'Sign Up' : 'Sign In'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Toggle Sign In / Sign Up */}
              <View style={styles.toggleRow}>
                <Text style={styles.togglePrompt}>
                  {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsRegister(!isRegister);
                    setError(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toggleHighlight}>
                    {isRegister ? 'Sign In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom Footer Note */}
          <Text style={styles.footerNote}>
            CakeBox Bakery • Powered by Firebase Auth & Firestore
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 28,
    paddingBottom: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dripContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },
  doodleItem: {
    position: 'absolute',
    zIndex: 0
  },
  topBrandArea: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 2
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 105, 140, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingVertical: 26,
    shadowColor: '#83283E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 3
  },
  cardHeading: {
    fontSize: 24,
    fontWeight: '900',
    color: '#261C20',
    textAlign: 'center',
    letterSpacing: -0.3
  },
  cardSubheading: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7E6B72',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F8B4D9',
    borderRadius: 25,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#FF6584',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1
  },
  googleBtnText: {
    color: '#261C20',
    fontSize: 14,
    fontWeight: '800'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F5D0DD'
  },
  dividerTag: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dividerTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E7D82',
    textAlign: 'center',
    lineHeight: 11,
    letterSpacing: 0.6
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center'
  },
  formArea: {
    gap: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F9',
    borderWidth: 1.5,
    borderColor: '#F9D5E4',
    borderRadius: 25,
    height: 48,
    paddingHorizontal: 8
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputField: {
    flex: 1,
    fontSize: 13,
    color: '#261C20',
    fontWeight: '600',
    paddingHorizontal: 10
  },
  eyeBtn: {
    paddingHorizontal: 8
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -2,
    marginBottom: 4
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF4B72'
  },
  submitBtnWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#FF4B72',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  submitGradient: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14
  },
  togglePrompt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6E5D62'
  },
  toggleHighlight: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FF4B72'
  },
  footerNote: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E7D82',
    textAlign: 'center',
    marginTop: 20,
    zIndex: 2
  }
});
