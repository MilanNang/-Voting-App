import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,Route,RouterProvider,createRoutesFromElements} from 'react-router-dom'
import Signup from './componets/Signup.jsx'
import Login from './componets/Login.jsx'
import  Home  from './componets/Admin/HomeAdmin.jsx'
import AddCandidate from './componets/Admin/AddCandidate.jsx'
import HomeUser from './HomeUser.jsx'
import VoteCount from './componets/VoteCount.jsx'
import Profil from './componets/Profile.jsx'


const router=createBrowserRouter(
  createRoutesFromElements(
     
    <Route path='/' element={<App />}>
        <Route path='/' element={<Login />} /> 
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/addCandidate' element={<AddCandidate />} />
        <Route path='/homeuser' element={< HomeUser/>} />
        <Route path='/vote' element={< VoteCount/>} />
        <Route path="/profile" element={< Profil/>} />
       
       
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
      
    
  
  </StrictMode>
)
