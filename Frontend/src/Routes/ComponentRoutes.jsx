import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../component/input/Home'
import Login from '../component/authentication/Login'
import Register from '../component/authentication/Register'
import InterviewReport from '../component/Interview Report/InterviewReport'
import Profile from '../component/profile/Profile'


const ComponentRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/report/:InterviewId' element={<InterviewReport />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    )
}

export default ComponentRoutes