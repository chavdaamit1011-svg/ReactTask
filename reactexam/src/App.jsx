import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RoomList from './components/RoomList'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import PrivateRoute from './components/Privateroute'
import RoomDetails from './components/RoomDetails'
import ReservationForm from './components/ReservationForm'
import ReservationList from './components/ReservationList'

function App() {

  return (
    <>
      <Navbar />

      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Navigate to="/rooms" />} />

          <Route path="/login" element={<Login />} />

         
          <Route
            path="/rooms"
            element={
              <PrivateRoute>
                <RoomList />
              </PrivateRoute>
            }
          />
          <Route
            path="/rooms/:id"
            element={
              <PrivateRoute>
                <RoomDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/reserve"
            element={
              <PrivateRoute>
                <ReservationForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <ReservationList />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<h3>404 Page Not Found</h3>} />
        </Routes>
      </div>

    </>
  )
}

export default App
