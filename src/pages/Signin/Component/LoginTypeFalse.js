import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from "@mui/material/Box";
import { compareAsc} from 'date-fns';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router';
import React, { useState, useRef } from 'react';
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import Typography from "@mui/material/Typography";
import Input from 'react-phone-number-input/input';
import { useMutation, useQuery } from 'react-query';

import iosEmail from '../../../assets/img/email.png';
import iosEntrar from '../../../assets/img/images/Botón probar gratis.png';
import useStyles from "../../../components/Examenes/styles";
import ErrorService from 'services/formatError/ErrorService';
import iosTelephone from '../../../assets/img/telephone.png';
import siBtnImg from "../../../assets/img/images/SiBtn.webp";
import iosSiBtnImg from "../../../assets/img/images/SiBtn.png";
import { saveLocalData } from 'services/auth/localStorageData';
import userServices from 'services/httpService/userAuth/userServices';

function LoginTypeFalse(props) {
  var messagePrint =
    'Hola, debes introducir tu teléfono y email reales para poder disfrutar de los 1 día de acceso gratuito porque tu IP quedará registrada y solo puedes tener una cuenta. Escríbelo con este formato: 622112233 (9 dígitos) email@email.com';

  const [setError] = useState('');
  const [toNext, setToNext] = useState(false);
  const [expired, setExpired] = useState(false);
  const [checked, setChecked] = useState(false);
  const tick=useRef();
  const box=useRef();
  const Styles = useStyles();


  const handleModalClose = () => setExpired(false);

  const handleCheckBox = () => {
    if(!checked) {
      setChecked(true);
      formik.setFieldValue('check', true);
      tick.current.style.visibility='visible';
    } else {
      setChecked(false);
      formik.setFieldValue('check', false);
      tick.current.style.visibility='hidden';
    }
  }

  const sendOtp = (data) => {
    const {id, telephone} = data;
    userServices.commonPostService('/MobileOTP',{"user_id":id,"mobile":telephone})
    .then(response => {
      props.updateData(data);
      props.updateVerified(false);
      toast.success('Código enviado a su teléfono.');
    })
    .catch(error => {
      toast.error('Error al enviar el código.');
    })

  }

  const LoginApiTrue = useMutation(
    (LoginApi) => userServices.commonPostService('/loginStudent', LoginApi),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (data) => {
        if (data.data.status === 'Sucessfull') {
          if(data.data.data.type==='Prueba') {
            setExpired(true);
          } 
          else if(data.data.data.type === 'Alumno') {
            if(data.data.data.verified==='Verified') {
              let {expiry_date} = data.data.data;
              expiry_date = new Date(expiry_date);
              const trial_ended=compareAsc(new Date(), expiry_date);
              if(trial_ended===1) {
                setExpired(true);
              }
              else {
                saveLocalData(data.data.data,data.data.time);
                setToNext(true);
              }
            } else {
              sendOtp(data.data.data);
            }
          }
        } else {
          toast.error(
            <div dangerouslySetInnerHTML={{ __html: data.data.message }} />
          );
        }
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      type: 'false',
      email: '',
      telephone: '',
      ipAddress: '',
      check: false,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email(messagePrint).required(messagePrint),
      telephone: Yup.string().required(messagePrint).min(12, messagePrint),
      check: Yup.bool().oneOf([true], "Debes aceptar los términos y condiciones."),
    }),
    onSubmit: async (values) => {
      LoginApiTrue.mutate(values);
    },
  });
  // eslint-disable-next-line
  const FetchIp = useQuery(
    'FetchIp',
    () => userServices.commonGetService(`https://geolocation-db.com/json/`),
    {
      onError: (error) => {},
      onSuccess: (data) => {
        formik.setFieldValue('ipAddress', data.data.IPv4);
      },
    }
  );
  // FetchIp();
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className='relative w-full mb-1'>
          <div className='relative flex w-full flex-wrap items-stretch'>
            <span className='z-10 h-full leading-snug font-normal absolute text-center text-black absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-5 ml-2'>
              <img alt='email_icon' src={require('assets/img/email.webp').default} srcSet={iosEmail} className='w-full h-full py-1'/>
            </span>
            <input
              type='text'
              placeholder='Email'
              className='px-3 py-7 placeholder-blueGray-800 text-blueGray-1600 relative bg-input rounded text-sm outline-none focus:outline-none focus:shadow-outline w-full pl-10'
              name='email'
              id='email'
              style={{lineHeight:'10%'}}
              style={{lineHeight:'10%'}}
              value={formik.values.studentCode}
              onChange={(e) => formik.setFieldValue('email', e.target.value)}
            />
          </div>
        </div>

        <div className='relative w-full mb-3'>
          {/* <label
                      className='block uppercase text-blueGray-600 text-xs font-bold mb-2'
                      htmlFor='grid-password'
                    >
                      Password
                    </label> */}
          <div className='relative flex w-full flex-wrap items-stretch'>
            <span className='z-10 h-full leading-snug font-normal absolute text-center text-black absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-5 ml-2'>
              <img alt='telephone_icon' src={require('assets/img/telephone.webp').default} srcSet={iosTelephone} className='w-full h-full py-1'/>
            </span>
            <Input
              country="ES"
              international
              withCountryCallingCode
              placeholder='+34 Teléfono Movil'
              className='px-3 py-7 placeholder-blueGray-900 text-blueGray-600 relative bg-input rounded text-sm outline-none focus:outline-none focus:shadow-outline w-full pl-10'
              name='telephone'
              id='telephone'
              value={formik.values.password}
              style={{lineHeight:'10%'}}
              style={{lineHeight:'10%'}}
              onChange={(e) =>
                formik.setFieldValue('telephone', e)
              }
            />
          </div>
          <div className='relative flex justify-center text-white text-xs bg-transparent rounded py-1 pl-1'>
            <button type="button" ref={box} style={{position:'absolute' ,width:'5%', left: 1}}><img src={require('assets/img/images/Caja de check.png').default} alt="check" onClick={handleCheckBox}/></button>
            <button type="button" ref={tick} style={{position:'absolute' ,width:'5%', left: 1, visibility:'hidden'}}><img src={require('assets/img/images/Check.png').default} alt="check" onClick={handleCheckBox}/></button>
            <span style={{fontFamily: 'RoundedElegance-regular',left:'6%'}} className="relative">Acepto los términos de uso y solicito recibir información.</span>
          </div>
            {formik.touched.telephone && formik.errors.telephone ? (
              <div className='text-red-600 text-xs py-1'>
                {formik.errors.telephone}
              </div>
            ) : formik.touched.email && formik.errors.email ? (
              <div className='text-red-600 text-xs py-1'>{formik.errors.email}</div>
            ) : formik.touched.check && formik.errors.check ? (
              <div className='text-red-600 text-xs py-1'>{formik.errors.check}</div>
            ) : null}
        </div>

        <div className='text-center'>
          <button
            className='text-white text-sm font-bold uppercase py-1 outline-none focus:outline-none  '
            type='submit'
          >
            <img
              alt='...'
              className='w-full h-full mr-1'
              src={require('assets/img/images/Botón-probar-gratis.webp').default}
              srcSet={iosEntrar}
            />
          </button>
        </div>
      </form>
      {toNext ? <Navigate to="/home" /> : null}
      <Modal
          open={expired}
          onClose={handleModalClose}
          aria-labelledby="preuba-expiry-modal"
          aria-describedby="preuba-expiry-modal-description"
      >
        <Box className={Styles.modalStyle}>
          <Typography
            id="preuba-expiry-modal"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            Su prueba de un día ha expirado, compre un plan para continuar.
          </Typography>
            <Button
              size="medium"
              onClick={() => {
                setExpired(false);
              }}
            >
              <img src={siBtnImg} srcSet={iosSiBtnImg} alt="" style={{height:'50%'}} />
            </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default LoginTypeFalse;
