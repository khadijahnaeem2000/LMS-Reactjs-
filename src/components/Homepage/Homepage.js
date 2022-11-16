import React, {useEffect, useState} from "react";
import useStyles from "./styles";
import "./styles.css";
import { getLocalUserdata , updateLocalstoragepic} from "../../services/auth/localStorageData";
import profilepic from "../../assets/img/images/layer_25.webp";
import defaultrank from "../../assets/img/images/Empleo_cabo.webp";
import SelectButton from "./SelectButton/SelectButton";
import userServices from 'services/httpService/userAuth/userServices';

const Homepage = () => {
  const classes = useStyles();
  const data = getLocalUserdata();
  const [photo,setPhoto] = useState('');
  const [time, setTime] = useState(0);

  useEffect (() => {
    userServices.commonPostService('/user',{"id":data.id})
    .then((response) => {
      if(response.status===200) {
        setPhoto(response.data.data.photo);
        updateLocalstoragepic(response.data.data.photo);
        setTime(response.data.time);
      }
      else {
        console.log('Cannot get updated info');
      }
    })
    .catch((error) => {
      console.log(error);
    })

  },[])

  return (
    <div className={classes.container}>
      <div className={`${classes.wrapper} flex justify-between`}>
        <div
          style={{ marginLeft: "0" }}
          className="mr-1 w-1/4 lg:w-2/12 h-2/5 lg:ml-24"
        >
          <img
            id="profile_pic"
            alt="Profile_picture"
            src={
              data.photo != null
                ? `https://neoestudio.net/userImage/${photo}`
                : profilepic
            }
          />
          <div className={`text-center fontSize`} style={{marginTop:'2%'}}><SelectButton/></div>
        </div>
        <div className="imgWidth3 mr-1">
          <img
            alt="Rank_image"
            src={
              data.rank_image != null
                ? `https://neoestudio.net/${data.rank_image}`
                : defaultrank
            }
          />
          <h2 className={`${classes.font} text-center fontSize`}>
            {data.rank_name != null ? data.rank_name : "-"}
          </h2>
          <p className="text-center fontSize">
            {data.userName != null ? data.userName : "-"}
          </p>
        </div>
        <div className="mr-1 imgWidth2">
          <img
            alt="Nivel"
            src={require("assets/img/images/Tiempo.webp").default}
          />
          <h2 className={`${classes.font} text-center fontSize`}>
            {time != null ? time : 0} h
          </h2>
          <p className="text-center fontSize">Tiempo</p>
        </div>
        <div className="mr-1 imgWidth">
          <img
            alt="Medellas"
            src={require("assets/img/images/Medallas.webp").default}
          />
          <h2 className={`${classes.font} text-center fontSize`}>
            {data.aptos != null ? data.aptos : 0}
          </h2>
          <p className="text-center fontSize">Aptos</p>
        </div>
        <div className="mr-1 imgWidth">
          <img
            style={{ paddingBottom: "25%" }}
            alt="Puntos"
            src={require("assets/img/images/Recurso3Pestaaprueba.webp").default}
          />
          <h2 className={`${classes.font} text-center fontSize`}>
            {data.points != null ? data.points : 0}
          </h2>
          <p className="text-center fontSize">Puntos</p>
        </div>
        <div className="mr-1 imgWidth">
          <img
            style={{ paddingBottom: "25%" }}
            alt="Percentil"
            src={require("assets/img/images/Porcentaje2.webp").default}
          />
          <h2 className={`${classes.font} text-center fontSize`}>
            {data.percentage != null ? data.percentage : 0}
          </h2>
          <p className="text-center fontSize">Percentil</p>
        </div>
      </div>
    </div>
  );
};
export default Homepage;
