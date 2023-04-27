import React, {useState} from 'react';
import VideoFolders from './VideoFolders/VideoFolders';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import './styles.css';

const Video = (props) => {
  const [url,setUrl]=useState('');
  const [title,setTitle]=useState('');
  const [userId, setUserId] = useState('');
  
  const updateUrl = (val,title, id) => {
    setUrl(val);
    setTitle(title);
    setUserId(id);
  }

  return (
    <div className='stackStyle'>
        <VideoFolders folderToggle={props.folderToggle} updateUrl={updateUrl}/>
        <hr/>
        <VideoPlayer url={url} title={title} userId={userId}/>
    </div>
  )
}

export default Video
