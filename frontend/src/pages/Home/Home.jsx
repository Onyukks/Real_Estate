import Searchbar from '../../components/Searchbar/Searchbar'
import CountUp from 'react-countup'
import { motion } from "framer-motion";
import './Home.scss'
const Home = () => {
  return (
    <div className="homePage">
       <div className="textContainer">
         <div className="wrapper">
            <motion.h1 
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 2,
                type: "ease-in",
            }}
            className='title'>Find Your Dream Home & Ideal Living Conditions</motion.h1>
            <p>
              Finding the perfect place to call home has never been easier. 
              Explore our extensive listings of real estate options, 
              from cozy apartments to spacious family homes. Our platform 
              provides detailed property information, including neighborhood 
              insights, pricing trends, and expert advice to help you make 
              informed decisions. Start your journey towards your dream property today with us.
           </p>
           <Searchbar />
           <div className="boxes">
           <div className="box">
              <h1><CountUp start={1} end={18} duration={5} />+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1><CountUp start={350} end={400} duration={5}/></h1>
              <h2>Awards Gained</h2>
            </div>
            <div className="box">
              <h1><CountUp start={2900} end={3000} duration={5}/>+</h1>
              <h2>Property Ready</h2>
            </div>
           </div>
         </div>
       </div>
       <div className="imgContainer">
          <img src="./bg.png" alt="" />
       </div>
    </div>
  )
}

export default Home
