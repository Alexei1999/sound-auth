import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.props?.onError(error, errorInfo);
    console.error(error, errorInfo);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", height: "100%", ...this.props.style }}>
          {this.props.message}
        </div>
      );
    }

    return this.props.children;
  }
}
