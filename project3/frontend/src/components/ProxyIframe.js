import React, { useRef } from 'react';

const ProxyIframe = () => {
  const iframeRef = useRef(null);

  return (
    <iframe
      ref={iframeRef}
      src="http://localhost:5000/iframe/Graphics_ShadowCascades.html" // 다른 포트의 URL로 변경
      title="Proxy Iframe"
      width="100%"
      height="500px" // 원하는 크기로 설정
      frameBorder="0"
    ></iframe>
  );
};

export default ProxyIframe;
