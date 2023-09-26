import React, { useState } from 'react';
import axios from 'axios'; 
import { useUser } from '../users/UserContext';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const user = useUser();
    const [name, setName] = useState(user.name);
    const [imgUrl,setImgUrl] = useState("")

    const navigate = useNavigate();
    const updateProfile = async () => {
        try {
            await axios.put(`http://localhost:3001/users/update/${user._id}`, {
                name: name, imgUrl:imgUrl
            },{headers:{
                "x-api-key": localStorage.getItem('token')
            }});
            console.log('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile', error);
        }
        navigate(0)
    };

    return (
        <div className='d-flex align-items-center'>
          <input
            style={{ fontSize: "18px" }}
            className='form-control rounded-pill me-2'
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={{ fontSize: "18px" }}
            className='form-control rounded-pill me-2'
            type='text'
            placeholder='Image URL'
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
          <button className='btn btn-light rounded' onClick={updateProfile}>
            Update
          </button>
        </div>
      );
      
};

export default EditProfile;
