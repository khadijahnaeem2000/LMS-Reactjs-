import React, {useRef, useState, useEffect} from 'react';
import { updateLocalStorageTimeStamp, getTimeStamp} from '../../../services/auth/localStorageData';
import './styles.css';

const VideoPlayer = (props) => {
  const videoRef = useRef();
  //const hlsRef = useRef();
  const [duration, setDuration]=useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    function checkIsMobile () {
      const ismobile = window.innerWidth < 1000;
        if (ismobile !== isMobile) {
          setIsMobile(ismobile);
        }
    }
    window.addEventListener("resize",checkIsMobile);
    return () => window.removeEventListener("resize",checkIsMobile);
  }, [isMobile]);

  useEffect(() => {
    videoRef.current?.load();
  }, [props.url]);

  return (
    <div className={isMobile?'mobileVideoContainer':'div1'}>
      <div className={isMobile?'':'div2'}>
           { /*<video
            className={isMobile?'mobileContainer':'check'}
            style={{zIndex:'10000', opacity:'0.5'}}
            ref={hlsRef}
            autoPlay={true}
            />*/}
        <video className={isMobile?'mobileContainer':'check'} 
          width="750" 
          height="500" 
          controls 
          autoPlay 
          muted 
          ref={videoRef} 
          playsInline
          controlsList="nodownload" 
          onProgress={onProgress}
          onPlay={() => {
            if(videoRef.current?.videoWidth + videoRef.current?.videoHeight === 0) {
              alert('El video no es compatible con su navegador, intente usar Safari o IE.');
            }
          }}
          onLoadStart={() => {
            const timeToStart = getTimeStamp('openedVideos',props.title);
            videoRef.current.currentTime=timeToStart;
          }}
          onContextMenu={e => e.preventDefault()}>
          <source type="video/mp4" src={props.url}/>
          Your browser doesn't support video, Choose a better browser!
        </video>
      </div>
    </div> 
  )
}

export default VideoPlayer
