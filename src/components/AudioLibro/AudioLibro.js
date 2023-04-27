import React, {useState} from 'react';
import AudioPlayer from './AudioPlayer/AudioPlayer.js';
import AudioFolder from './AudioFolder/AudioFolder.js';

const AudioLibro = () => {
  const [url,setUrl]=useState('');
  const [title,setTitle]=useState('');
  const [userId, setUserId] = useState('');

  const updateUrl = (val,title,id) => {
    setUrl(val);
    setTitle(title);
    setUserId(id);
  }

  return (
    <div className='stackStyle'>
      <AudioFolder updateUrl={updateUrl}/>
      <AudioPlayer url={url} title={title} userId={userId}/>
    </div>
  )
}
export default AudioLibro
