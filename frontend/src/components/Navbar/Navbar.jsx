import { useContext, useState } from 'react';
import './Navbar.scss'
import {Link, useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { useNotificationStore } from '../../lib/notificationStore';
const Navbar = () => {
    const [open,setOpen] = useState(false)
    const {currentUser} = useContext(AuthContext)

    const fetch = useNotificationStore((state) => state.fetch);
    const number = useNotificationStore((state) => state.number);
  
    if(currentUser) fetch();

    const navigate=useNavigate()
    return ( 
    <nav>
        <div className="left">
            <Link to={'/'} className='logo'>
                <img src="/logo.png" alt=""/>
                <span>OnyEstate</span>
            </Link>
            <Link to={'/'}>Home</Link>
            <Link to={"mailto:onyeukwuagbafo@gmail.com"}>Contact</Link>
            <Link to={'/lists'}>Residencies</Link>
        </div>
        <div className="right">
        {
            currentUser? (  
            <div className="user">
            <img
              src={currentUser.avatar || '/noavatar.jpg'}
              alt=""
              onClick={()=>navigate('/profile')}
            />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
            {number>0 &&  <div className="notification">{number}</div> }
              <span>Profile</span>
            </Link>
          </div>
          ) : (
            <>
            <Link to={'/login'}>Sign in</Link>
            <Link to={'/register'} className='register'>Sign Up</Link>
            </>
            )
        }
            <div className="menuIcon">
                <img src="/menu.png" alt="" onClick={()=>setOpen(!open)} />
            </div>
            <div className={open? 'menu active': 'menu'}>
            <Link to={'/'}>Home</Link>
            <Link to={"mailto:onyeukwuagbafo@gmail.com"}>Contact</Link>
            <Link to={'/lists'}>Residencies</Link>
            <Link to={'/profile'}>Profile</Link>
          {!currentUser &&  <Link to={'/login'}>Sign in</Link> }
          {!currentUser &&  <Link to={'/register'}>Sign Up</Link> }
            </div>
        </div>
    </nav>
    );
}
 
export default Navbar;