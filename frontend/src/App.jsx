import {createBrowserRouter,Navigate,RouterProvider} from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import Lists from './pages/Lists/Lists'
import SinglePage from './pages/SinglePage/SinglePage'
import Profile from './pages/Profile/Profile'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import NewPost from './pages/NewPost/NewPost'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import {Toaster} from 'react-hot-toast'
import { useContext, useEffect } from 'react'
import { AuthContext } from './context/AuthContext'
import { listPageLoader, profilePageLoader, singlePageLoader } from './lib/loaders'

function App() {
  
  const {currentUser,checkAuth} = useContext(AuthContext)
  

  useEffect(()=>{
    checkAuth()
  },[])

  const router = createBrowserRouter([{
    path:'/',
    element:<Layout />,
    children:[
      {
        path:'/',
        element:<Home />
      },{
        path:'/lists',
        element:<Lists />,
        loader:listPageLoader
      },{
        path:'/single/:id',
        element:<SinglePage />,
        loader:singlePageLoader
      },{
        path:'/profile',
        element:currentUser? <Profile /> : <Navigate to={'/login'}/>,
        loader:currentUser? profilePageLoader : null
      },{
        path:'/update',
        element:currentUser? <ProfileUpdate /> : <Navigate to={'/login'} />
      },{
        path:'/newpost',
        element:currentUser? <NewPost /> : <Navigate to={'/login'} />
      },{
        path:'/login',
        element:!currentUser? <Login /> : <Navigate to={'/'} />
      },{
        path:'/register',
        element:!currentUser? <Register /> : <Navigate to={'/'}/>
      }
    ]
  }])
  return (
    <>
     <RouterProvider router={router}/>
     <Toaster />
    </>
  )
}

export default App