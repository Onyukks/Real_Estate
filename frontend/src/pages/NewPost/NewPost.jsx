import { useState } from "react";
import "./NewPost.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/UploadWidget/UploadWidjet";

const NewPost =()=> {
  const [value, setValue] = useState("");
  const [images,setImages] = useState([])
  const [loading,Setloading] = useState(false)
  const navigate = useNavigate()

  const fetchGeocode = async (address) => {
    const query = encodeURIComponent(address);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: lat, longitude: lon };
      } else {
        throw new Error("Address not found");
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Setloading(true);
  
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
  
    if (images.length === 0) {
      toast.error("You need to select images");
      Setloading(false);
      return;
    }
  
    // Limit images to 4
    const limitedImages = images.slice(0, 4);
  
    try {
      const { latitude, longitude } = await fetchGeocode(`${inputs.address}, ${inputs.city}, ${inputs.country}`);
      inputs.latitude = latitude;
      inputs.longitude = longitude;
  
      const { data } = await axios.post('/api/residency/add', {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          country: inputs.country,
          images: limitedImages,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        }
      });
  
      toast.success('Residency Added Successfully');
      navigate(`/single/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data || "An error occurred");
      console.log(err);
    } finally {
      Setloading(false);
    }
  };
  
  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="country">Country</label>
              <input id="country" name="country" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button type="submit" className="sendButton" disabled={loading}>{loading? "Adding...":"Add"}</button>
          </form>
          <p style={{marginTop:"10px"}}>Note : <span>The school,restaurant,bus fields refer to the distance in metres between the residency and the nearest school,bus or restaurant</span></p>
        </div>
       
      </div>
      <div className="sideContainer">
      <div className="imageWrapper">
      {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
      </div>
         <UploadWidget uwConfig={{
          cloudName:`${process.env.VITE_CLOUD_NAME}`,
          uploadPreset:`${process.env.VITE_CLOUD_PRESET}`,
          multiple:true,
          folder:"residencyImages"
        }}
          setState={setImages}
          condition={"Upload Images (Max of 4 images)"}
        />
      </div>
    </div>
  );
}

export default NewPost;