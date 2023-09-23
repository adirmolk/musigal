import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal, fa4, fa5 } from '@fortawesome/free-solid-svg-icons'

const Leaderboards = () => {
  const [usersList, setUsersList] = useState([]);
  const [counter, setCounter] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/users/list");
        const sortedByLevel = data.sort((a, b) => a.level - b.level);
        setUsersList(sortedByLevel.reverse());
        console.log(usersList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="bg-light p-2 rounded mt-4 ">
        <h5>Leaderboards</h5>
        {usersList.map((user, index) => (
          <div
            key={user.id}
            className="d-flex justify-content-between mt-2 mb-1 p-2 rounded"
          >
            <div className="d-flex align-items-center">
              {index >= 3 ? (
                <FontAwesomeIcon icon={ index === 3 ? fa4 : index === 4 ? fa5 : null} size="2x" style={{marginRight: '15px', marginLeft: '3px', width: index === 4 ? '23px' : null}}/>
              ) : null}
              <FontAwesomeIcon
                icon={faMedal}
                style={{ color: index === 0 ? '#CFB53B' : index === 1 ? '#C0C0C0' : index === 2 ? ' #CD7F32' : 'transparent', marginRight: '10px' , display: index >= 3 ? 'none' : 'inline'}}
                size="2x"
              />
              <img
                src={
                  user.imgUrl ||
                  "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                }
                alt="Profile"
                className="rounded-circle"
                style={{ width: "50px", height: "50px" }}
              />
              <div className="mx-3">
                <h5
                  onClick={() => navigate(`/profiles/${user._id}`)}
                  style={{ cursor: "pointer", margin: "0" }}
                >
                  {user.name}
                </h5>
                <span style={{ fontSize: "14px" }} className="text-muted mb-0">
                  {user.level >= 150
                    ? "Pro "
                    : user.level >= 50
                    ? "Maxim "
                    : "Noob "}
                </span>
              </div>
            </div>{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboards;
