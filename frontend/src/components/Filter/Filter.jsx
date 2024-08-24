import { useState } from 'react'
import './Filter.scss'
import {useSearchParams} from 'react-router-dom'

const Filter = () => {
   const [searchParams,setSearchParams] = useSearchParams()
   const [query,setQuery]= useState({
      type: searchParams.get("type") || "",
      city: searchParams.get("city") || "",
      property: searchParams.get("property") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedroom: searchParams.get("bedroom") || "",
   })
   const handleChange = e =>{
      setQuery({
         ...query,
         [e.target.name]:e.target.value
      })
   }
   const handleFilter = () => {
      setSearchParams(query);
    };
  return (
    <div className="filter">
       <h1>Search results for <b>{searchParams.get("city")}</b></h1>
       <div className="top">
          <div className="item">
             <label htmlFor="city">Location</label>
             <input type="text" id='city' name='city'
             placeholder='City Location' onChange={handleChange} 
               defaultValue={query.city}
             />
          </div>
       </div>
       <div className="bottom">
       <div className="item">
             <label htmlFor="type">Type</label>
             <select name="type" id="type" onChange={handleChange} defaultValue={query.type}>
              <option value="">Any</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
             </select>
          </div>
          <div className="item">
             <label htmlFor="property">Property</label>
             <select name="property" id="property" onChange={handleChange} defaultValue={query.property}>
             <option value="">Any</option>
             <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
             </select>
            
          </div>
          <div className="item">
             <label htmlFor="minPrice">Minimum Price</label>
             <input type="number" id='minPrice' name='minPrice' 
             placeholder='any' min={0} max={10000000} onChange={handleChange} defaultValue={query.minPrice} />
          </div>
          <div className="item">
             <label htmlFor="maxPrice">Maximum Price</label>
             <input type="number" id='maxPrice' name='maxPrice' 
             placeholder='any' min={0} max={10000000} onChange={handleChange} defaultValue={query.maxPrice} />
          </div>
          <div className="item">
             <label htmlFor="bedroom">Bedrooms</label>
             <input type="number" id='bedroom' name='bedroom' placeholder='any'
              min={1} onChange={handleChange}
               defaultValue={""}
              />
          </div>
          <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
       </div>
    </div>
  )
}

export default Filter
