import React , {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { InView } from 'react-intersection-observer';
import ShareButton from './Buttons/ShareButton';
import LikeButton from './Buttons/LikeButton';
import CommentButton from './Buttons/CommentButton';
import DownloadButton from './Buttons/DownloadButton';

const VideoCard = (props) => {
    const [play, setPlay] = useState(true);
    const [mute, setMute] = useState(false);
    const [playing, setPlaying] = useState([]);

    const handlePlayPause = () => {
        if(play) {
          setPlay(false);
          playing.pause();
        }
        else {
          setPlay(true);
          playing.play();
        }
      }
      
      const handleMuteUnmute = () => {
        if(mute) {
          setMute(false);
          playing.muted=false;
        }
        else {
          setMute(true);
          playing.muted=true;
        }
      }
    
  return (
    <InView threshold={0.60} onChange={(inView, entry) => {
        if(inView) {
          setPlay(true);
          setMute(false);
          if(!props.loading){
            props.updateID(entry.target.id);
          }
          setPlaying(entry.target);
          entry.target.muted=false;
          entry.target.play();
        }
        else {
          entry.target.pause();
          entry.target.currentTime=0;
    }
    }}>
        {({ inView, ref, entry }) => (
            <>
                <Card className="entrenamientoChild flex justify-center" style={{boxShadow:'none',paddingTop:'1%',paddingBottom:'1%', overflow:'unset', marginLeft:'2%'}}>
                    <div style={{position:'relative', height:'80vh'}}>
                        <video
                            ref={ref}
                            id={`${props.index}`}
                            style = {{ maxWidth:'100%', height:'100%'}}
                            src={`https://neoestudio.net/${props.item.file}`}
                            alt={props.item.title}
                            className={'videodiv'}
                            onLoadStart={() => {if(Number(props.index)===0){props.updateLoading()}}}
                            loop
                        />
                        <div className='buttondiv flex flex-col'>
                            <IconButton sx={{ cursor:'pointer'}} onClick={handlePlayPause}>
                                {play?<PauseIcon fontSize='small' sx={{ color: 'white'}}/>:<PlayArrowIcon fontSize='small' sx={{color: 'white'}}/>}                
                            </IconButton> 
                            <IconButton sx={{cursor:'pointer'}} onClick={handleMuteUnmute}>
                                {mute?<VolumeOffIcon fontSize='small' sx={{color: 'white'}}/>:<VolumeUpIcon fontSize='small' sx={{color: 'white'}}/>}                
                            </IconButton>  
                        </div>  
                    </div>   
                    <CardActions sx={{display: 'flex', flexDirection: 'column', justifyContent:'end'}} disableSpacing>
                        <LikeButton videoId={props.item.id} likeCount={props.item.likeCount}/>
                        <CommentButton videoId={props.item.id} commentCount={props.item.commentCount}/>
                        <DownloadButton item={props.item} downloadCount={props.item.downloadCount}/>
                        <ShareButton videoId={props.item.id} title={props.item.title} url={`https://neoestudio.net/${props.item.file}`} shareCount={props.item.shareCount}/>
                    </CardActions>
                </Card>  
            </>
        )}
    </InView>  
  )
}

export default VideoCard
