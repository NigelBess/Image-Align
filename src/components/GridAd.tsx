import React, { useEffect, useRef } from 'react';

const GridAd = () => {
    const adsInitialized = useRef(false);

    useEffect(() => {
        if (!adsInitialized.current) {
            const script = document.createElement('script');
            script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.body.appendChild(script);

            script.onload = () => {
                window.adsbygoogle = window.adsbygoogle || [];
                try {
                    window.adsbygoogle.push({});
                } catch (error) {
                    console.error('Error pushing ad:', error);
                }
            };

            adsInitialized.current = true;

            // Cleanup function
            return () => {
                document.body.removeChild(script);
            };
        }
    }, []); // Empty dependency array ensures this effect only runs once

    return (
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-format="autorelaxed"
             data-ad-client="ca-pub-5782059227518644"
             data-ad-slot="9847637992"></ins>
    );
}

export default GridAd;
