import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../users/UserContext";
import { useNavigate } from "react-router-dom";
import eventBus from "../EventBus/eventBus";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const EditProfile = () => {
  const user = useUser();
  const [name, setName] = useState(user.name);
  const [imgUrl, setImgUrl] = useState(null);

  const updateProfile = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/users/${user.id}`,
        {
          ...user,
          name: name,
          imgUrl: imgUrl != null ? imgUrl : user.imgUrl,
        },
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );
      eventBus.emit("profileUpdated", { name, imgUrl });
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Error updating profile!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="d-flex align-items-center">
      <input
        style={{ fontSize: "18px" }}
        className="form-control rounded-pill me-2"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={{ fontSize: "18px" }}
        className="form-control rounded-pill me-2"
        type="text"
        placeholder="Image URL"
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />
      <button className="btn btn-light rounded" onClick={updateProfile}>
        Update
      </button>
    </div>
  );
};

export default EditProfile;
