import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', backgroundColor: '#fff', border: '2px solid red', color: 'black', fontFamily: 'monospace', fontSize: '12px' }}>
                    <h3 style={{ color: 'red' }}>⚠️ Something went wrong</h3>
                    <details open style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details</summary>
                        <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5' }}>
                            <strong>Error Message:</strong>
                            <div style={{ color: 'red', marginTop: '5px' }}>
                                {this.state.error && this.state.error.toString()}
                            </div>
                        </div>
                        {this.state.error && this.state.error.stack && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5' }}>
                                <strong>Stack Trace:</strong>
                                <div style={{ marginTop: '5px' }}>
                                    {this.state.error.stack}
                                </div>
                            </div>
                        )}
                        {this.state.errorInfo && this.state.errorInfo.componentStack && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5' }}>
                                <strong>Component Stack:</strong>
                                <div style={{ marginTop: '5px' }}>
                                    {this.state.errorInfo.componentStack}
                                </div>
                            </div>
                        )}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
