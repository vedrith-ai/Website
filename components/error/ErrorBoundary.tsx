'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children:    ReactNode
  fallback?:   ReactNode
  onError?:    (error: Error, info: React.ErrorInfo) => void
  resetKey?:   unknown   // Change this prop to reset the boundary
}

interface State {
  hasError: boolean
  error:    Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[VedRith ErrorBoundary]', error, info)
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prevProps: Props) {
    // Reset on resetKey change
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 text-center space-y-3"
        >
          <p className="text-2xl" aria-hidden>⚠️</p>
          <div>
            <p className="font-medium text-foreground text-sm">Something went wrong</p>
            <p className="text-xs text-muted-foreground mt-1">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs text-amber-400 underline hover:text-amber-300 transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
