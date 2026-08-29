import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { captureError } from './error-handler';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureError(error, {
      source: 'ErrorBoundary',
      action: 'render',
      metadata: { componentStack: errorInfo.componentStack ?? '' },
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.emoji}>🍰</Text>
            <Text style={styles.title}>Oops! Something went sweet-sour</Text>
            <Text style={styles.message}>
              {this.state.error?.message || 'An unexpected issue occurred while loading this screen.'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.resetError} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenPadding,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    borderWidth: 1.5,
    borderColor: colors.borderPink,
    ...shadows.medium,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headlineMd,
    color: colors.darkChocolate,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    ...shadows.pink,
  },
  buttonText: {
    ...typography.titleMd,
    color: colors.white,
    fontWeight: '800',
  },
});
