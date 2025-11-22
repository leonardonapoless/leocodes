import { useRef, useState, useEffect } from 'react';
// import reloadIcon from '../../assets/refresh.svg';
import homeIcon from '../../assets/home.svg';
import openURLIcon from '../../assets/pixelarrow.svg';

const Browser = ({ url }) => {
    const iframeRef = useRef(null);
    const [scale, setScale] = useState(0.75); // scale down to simulate higher resolution
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);

        // set a timeout to check if iframe loaded
        const timer = setTimeout(() => {
            try {
                // try to access iframe content to detect blocking
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.location.href;
                }
            } catch (e) {
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [url]);

    const handleOpenExternal = () => {
        window.open(url, '_blank');
    };

    const handleHome = () => {
        if (iframeRef.current) {
            setHasError(false);
            iframeRef.current.src = url;
        }
    };

    const handleReload = () => {
        setHasError(false);
        try {
            iframeRef.current.contentWindow.location.reload();
        } catch (e) {
            // fallback if cross-origin blocks reload
            if (iframeRef.current) {
                iframeRef.current.src = iframeRef.current.src;
            }
        }
    };

    const handleIframeError = () => {
        setHasError(true);
    };

    const iconStyle = {
        width: '16px',
        height: '16px',
        imageRendering: 'pixelated',
        display: 'block'
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{
                padding: '5px',
                borderBottom: '1px solid #000',
                backgroundColor: '#c0c0c0',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}>

                {/* reload button disabled because i just found out that it you refresh a page in a "virtual" browser
                but i might use this in the future idk*/}
                {/* <button onClick={handleReload} title="Reload" style={{ minWidth: '24px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', backgroundColor: '#fff', boxShadow: '1px 1px 0 #000', cursor: 'pointer' }}>
                    <img src={reloadIcon} alt="Reload" style={iconStyle} />
                </button> */}

                {/* home button */}
                <button onClick={handleHome} title="Home" style={{ minWidth: '24px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', backgroundColor: '#fff', boxShadow: '1px 1px 0 #000', cursor: 'pointer' }}>
                    <img src={homeIcon} alt="Home" style={iconStyle} />
                </button>

                {/* open external button */}
                <button onClick={handleOpenExternal} title="Open in New Tab" style={{ minWidth: '24px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', backgroundColor: '#fff', boxShadow: '1px 1px 0 #000', cursor: 'pointer' }}>
                    <img src={openURLIcon} alt="Open External" style={iconStyle} />
                </button>

                <span style={{ fontSize: '12px' }}>Address:</span>
                <input
                    type="text"
                    value={url}
                    readOnly
                    style={{
                        flex: 1,
                        fontFamily: 'Chicago, sans-serif',
                        fontSize: '12px',
                        padding: '2px 5px'
                    }}
                />
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'white' }}>
                {hasError ? (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        fontFamily: 'Chicago, sans-serif',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            padding: '20px',
                            border: '2px solid #000',
                            backgroundColor: '#c0c0c0',
                            maxWidth: '500px'
                        }}>
                            <h2 style={{ fontSize: '16px', marginBottom: '15px' }}>Cannot Display Page</h2>
                            <p style={{ fontSize: '12px', lineHeight: '1.5', marginBottom: '20px' }}>
                                This website cannot be displayed in an embedded browser due to security restrictions.
                            </p>
                            <button
                                onClick={handleOpenExternal}
                                style={{
                                    padding: '8px 16px',
                                    border: '2px solid',
                                    borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
                                    backgroundColor: '#c0c0c0',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontFamily: 'Chicago, sans-serif',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    margin: '0 auto'
                                }}
                            >
                                <img src={openURLIcon} alt="" style={iconStyle} />
                                Open in New Tab
                            </button>
                        </div>
                    </div>
                ) : (
                    <iframe
                        ref={iframeRef}
                        src={url}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        onError={handleIframeError}
                        style={{
                            width: `${100 / scale}%`,
                            height: `${100 / scale}%`,
                            border: 'none',
                            backgroundColor: 'white',
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left'
                        }}
                        title="Browser"
                    />
                )}
            </div>
        </div>
    );
};

export default Browser;