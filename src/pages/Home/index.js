import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from 'components/Navbars/HomeNavbar.js';
import SideMenu from 'components/SideMenu/SideMenu.js';
import Homepage from 'components/Homepage/Homepage.js';
import Temario from 'components/Temario/Temario.js';
import Video from 'components/Video/Video.js'
import Classes from 'components/Classes/Classes.js'
import RankingGlobal from 'components/RankingGlobal/RankingGlobal.js';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ActivitiesApi from './../../api/index';

function Home() {
  const history = useNavigate();
  const [wid, setWid] = useState('0%');
  const [toggleMenu, setToggleMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState('Mi escritorio');
  const [folderToggle, setFolderToggle]=useState('0%');

  const toggleSideMenu = () => {
    if(toggleMenu===true){
      setWid('0%');
      setFolderToggle('0%');
      setToggleMenu(false);
    }
    else if(toggleMenu===false){
      setWid('20%')
      setFolderToggle('100%');
      setToggleMenu(true);
    }
  }

  const updatePage = (option) => {
    setCurrentPage(option);
  }

  const renderOption = () => {
    if(currentPage==='Mi escritorio')
      return <Homepage/>
    else if(currentPage === 'Temario')
      return <Temario folderToggle={folderToggle}/>
    else if(currentPage === 'Video')
      return <Video />
    else if(currentPage === 'Classes')
      return <Classes />
    else if(currentPage === 'Ranking global')
      return <RankingGlobal />
  }

  useEffect(() => {
      ActivitiesApi.getActivities()
        .then((response) => {
          console.log("res in home:", response);
        })
        .catch((error) => {
          console.log("error in home:",error);
        })

  }, []);

  return (
    <>
      <HomeNavbar toggleSideMenu={toggleSideMenu}/>
      <div>
        <SideMenu width={wid} updatePage={updatePage}/>
        {renderOption()}
      </div>
    </>
  );
}
export default Home;
