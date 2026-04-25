import { useEffect, useRef } from 'react';

const Bubble = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Get webcam stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Webcam blocked:", err));
  }, []);

  return (
    <div style={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={styles.video}
      />
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '30px',
    left: '30px',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    border: '4px solid #ffffff',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.4)',
    overflow: 'hidden',
    zIndex: '2147483647', // Highest possible z-index
    backgroundColor: '#000',
    pointerEvents: 'none' // Ensures bubble doesn't block clicks on the site
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)' // Mirrors the camera for a natural feel
  }
};

export default Bubble;