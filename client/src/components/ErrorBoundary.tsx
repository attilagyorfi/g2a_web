/**
 * Root error boundary — wraps the whole app in App.tsx.
 *
 * When any React tree below throws, we render the brand-styled `ErrorPage`
 * instead of the previous generic shadcn screen. ErrorPage shows a friendly
 * Hungarian "valami félrement" message + retry/back CTAs + support email.
 * The full stack trace is dev-only behind a <details> disclosure.
 *
 * Includes a `key`-based reset: if the user clicks "Próbáld újra", we
 * increment a reset counter that re-mounts the children. If the underlying
 * cause (network blip, race condition) has passed, the page renders cleanly.
 * If it throws again, we re-catch the error and display ErrorPage again.
 *
 * The boundary intentionally does NOT log to a third-party service from here
 * — that's the job of the analytics / Sentry layer once we add it. For now
 * we just print to console so developers see it in DevTools.
 */
import { Component, ReactNode } from "react";
import ErrorPage from "@/pages/ErrorPage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  /** Bumped on every reset attempt — used as the `key` on children to force
   *  remount. */
  resetCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, resetCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      resetCount: prev.resetCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} onReset={this.handleReset} />;
    }
    // `key` forces a full re-mount of the subtree on reset — clearing any
    // bad local state that caused the crash.
    return <div key={this.state.resetCount}>{this.props.children}</div>;
  }
}

export default ErrorBoundary;
