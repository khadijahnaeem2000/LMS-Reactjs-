import React, {useState} from 'react';
import VideoFolders from './VideoFolders/VideoFolders';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import './styles.css';

const Video = (props) => {
  const [url,setUrl]=useState('');
  const [title,setTitle]=useState('');
  
  const updateUrl = (val,title) => {
  const [title,setTitle]=useState('');
  
  const updateUrl = (val,title) => {
    setUrl(val);
    setTitle(title);
    setTitle(title);
  }

  return (
    <div className='stackStyle'>
        <VideoFolders folderToggle={props.folderToggle} updateUrl={updateUrl}/>
        <hr/>
        <VideoPlayer url={url} title={title}/>
    </div>
  )
}

export default Video
