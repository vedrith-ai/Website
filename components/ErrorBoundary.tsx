'use client';

import { Component, type ReactNode } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

interface Props   { children: ReactNode; lang?: Lang }
interface State   { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }

  componentDidCatch(err: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', err, info);
  }

  render() {
    const lang = this.props.lang ?? 'en';
    if (this.state.hasError) {
      return (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center space-y-3">
          <h2 className="font-semibold text-destructive">{t('error.boundary.title', lang)}</h2>
          <p className="text-sm text-muted-foreground">{t('error.boundary', lang)}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="rounded border px-4 py-2 text-sm hover:bg-muted"
          >
            {t('common.retry', lang)}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
