import {Route,Routes} from 'react-router-dom'
import axios from 'axios'
import Signin from './pages/Signin'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './compoents/Header'
import Signup from './pages/Signup'
import PrivateRoute from './compoents/PrivateRoute'
import ListingPage from './pages/ListingPage'
import UpdateListingPage from './pages/UpdateListingPage'
import Listing from './pages/Listing'
import Searchandfilterpage from './pages/Searchandfilterpage'

axios.defaults.baseURL="http://localhost:4000/api"
// axios.defaults.baseURL="https://realestate-phpz.onrender.com/api"
// axios.defaults.baseURL="https://real-estate-nine-silk.vercel.app/api"
axios.defaults.withCredentials=true

function App() {
  
  return (
    <Routes>
      <Route path='/' element={<Header/>}>

      <Route path='/signin' element={<Signin/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/listing/:id' element={<Listing/>}/>
      <Route path='/search?' element={<Searchandfilterpage/>}/>
      
      <Route  element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/listing' element={<ListingPage/>}/>
      <Route path='/updatelisting/:id' element={<UpdateListingPage/>}/>
      </Route>
      </Route>
    </Routes>
  )
}

export default App
