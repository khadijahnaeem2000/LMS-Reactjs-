import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from 'pages/Landingpage';
import Signin from 'pages/Signin';
import Home from 'pages/Home';
import Menu from 'pages/Menu';
import history from '../history';
import Course from 'pages/Course';
const Directo = React.lazy(() => import("pages/Directo"));


function Root() {

  return (
    <Router history={history}>
      <Routes>
        <Route exact path='/' element={<Signin />} />
        <Route exact path="/home" element={<Home/>} />
        <Route exact path='/menu' element={<Menu />} />
        <Route exact path='/course' element={<Course />} />
        <Route exact path='/directo' element={
            <React.Suspense fallback={<>...</>}>
              <Directo />
            </React.Suspense>} />
      </Routes>
    </Router>
  );
}

export default Root;
