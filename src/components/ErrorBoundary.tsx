import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleRestart = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#808080',
                    zIndex: 99999
                }}>
                    <div style={{
                        width: '350px',
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        boxShadow: '2px 2px 0px #000',
                        backgroundColor: '#fff',
                        border: '2px solid #000',
                        fontFamily: 'Chicago, sans-serif'
                    }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            {/* Bomb Icon */}
                            <div style={{ minWidth: '32px', height: '32px' }}>
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10 4H18V6H20V8H22V10H24V14H26V24H24V28H20V30H12V28H10V24H8V14H10V10H12V8H14V6H10V4ZM12 14H22V24H20V26H12V24H10V14H12ZM16 10H18V12H16V10ZM6 4H4V8H6V4ZM28 4H26V8H28V4ZM4 26H8V28H4V26ZM28 26H26V28H28V26Z" fill="black" />
                                    <path d="M8 2H12V4H8V2Z" fill="black" />
                                </svg>
                            </div>

                            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                <p style={{ margin: 0, marginBottom: '10px', fontWeight: 'bold' }}>Sorry, a system error occurred.</p>
                                <p style={{ margin: 0, fontSize: '12px' }}>
                                    {this.state.error ? `${this.state.error.name}: ${this.state.error.message}` : 'Unknown Error'}
                                </p>
                                <p style={{ margin: 0, marginTop: '5px', fontSize: '12px' }}>ID: 02</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="btn"
                                onClick={this.handleRestart}
                                style={{ minWidth: '80px' }}
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
