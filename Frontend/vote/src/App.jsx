
import Header from './componets/Header'
import Fouter from './componets/Fouter'
import { Outlet } from 'react-router-dom'


function App() {
  

  return (
    <>
    
      <Header />
        <Outlet />
      <Fouter />
    </>
  )
}

export default App
