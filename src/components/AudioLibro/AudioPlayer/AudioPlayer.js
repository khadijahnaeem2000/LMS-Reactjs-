import React, {useRef, useState, useEffect} from 'react'
import { updateLocalStorageTimeStamp, getTimeStamp} from '../../../services/auth/localStorageData';
import ReactPlayer from 'react-player/lazy'
import './styles.css'

const AudioPlayer = (props) => {
    const audioRef = useRef();
    const [duration, setDuration]=useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {

    function checkIsMobile () {
      const ismobile = window.innerWidth < 1000;
        if (ismobile !== isMobile) {
          setIsMobile(ismobile);
          console.log('it is a mobile');
        }
    }
    window.addEventListener("resize",checkIsMobile);
    return () => window.removeEventListener("resize",checkIsMobile);
  }, [isMobile]);
  
    const onProgress = (data) => {
      setDuration(audioRef.current.getCurrentTime());
      updateLocalStorageTimeStamp('openedAudios',props.title,duration);
    }
  
    return (
      <div className={isMobile?'':'audiocontainer'}>
          <div className={isMobile?'mobileaudio-wrapper':'audioplayer-wrapper'}>
              <ReactPlayer
              // Disable download button
              config={{ file: { attributes: { controlsList: 'nodownload' }, forceAudio: true } }}
              // Disable right click
              onContextMenu={e => e.preventDefault()}
              className={isMobile?'mobileaudio-player':'audioreact-player'}
              width="50" height="50"
              url={props.url}
              controls={true}
              muted={true}
              playing={true}
              ref={audioRef} 
              onProgress={onProgress}
              onStart={() => {
                const timeToStart = getTimeStamp('openedAudios',props.title);
                audioRef.current.seekTo(timeToStart,'seconds');
              }}
              />  
          
          </div>
      </div>
    )
}

export default AudioPlayer
