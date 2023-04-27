import React, {useRef, useState, useEffect} from 'react'
import { updateLocalStorageTimeStamp, getTimeStamp} from '../../../services/auth/localStorageData';
import ReactPlayer from 'react-player/lazy'
import userServices from 'services/httpService/userAuth/userServices';
import './styles.css'

const ClassesPlayer = (props) => {
  const videoRef = useRef();
  const [duration, setDuration]=useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  const addToSchedule = () => {
    userServices.commonPostService('/SendSchedule',{"studentId":props.userId, "task":`Clase: ${props.title}`, "type":'class'})
    .then((response) => {
      if(response.status===200) {
        if(response.data.status==='Successfull') {
          console.log('added to schedule');
        }
        else {
          console.log('COuldnt add to schedule');
        }
      }
      else {
        console.log('Could not add to user schedule');
      }
    }).catch((err) => {
        console.log(err);
    });
  }

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
    setDuration(videoRef.current.getCurrentTime());
    updateLocalStorageTimeStamp('openedClasses',props.title,duration);
  }

  return (
    <div className={isMobile?'mobileClassesContainer':'classescontainer'}>
        <div className={isMobile?'':'classesplayer-wrapper'}> 
        { props.url==='' ? isMobile ? <></> : <div className="noSelect">Selecciona un archivo para empezar.</div>
            : <ReactPlayer
            // Disable download button
            config={{ file: { attributes: { controlsList: 'nodownload' } } }}
            // Disable right click
            onContextMenu={e => e.preventDefault()}
            className={isMobile?'':'classesreact-player'}
            width="750" height="500"
            url={props.url}
            controls={true}
            muted={true}
            playing={true}
            playsinline={true}
            ref={videoRef} 
            onProgress={onProgress}
            onStart={() => {
              const timeToStart = getTimeStamp('openedClasses',props.title);
              videoRef.current.seekTo(timeToStart,'seconds');
            }}
            onPlay={() => {
                addToSchedule();
            }}
            />  
        }
        </div>
    </div>
  )
}

export default ClassesPlayer
