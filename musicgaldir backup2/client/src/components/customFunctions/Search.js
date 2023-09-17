import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchCriteria, setSearchCriteria] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      // Check if the search criteria is empty
      if (searchCriteria.trim() === '') {
        setSearchResults([]); // Clear the search results
        return; // Exit the function without making an API request
      }
  
      // Send a GET request to the search route with the search criteria
      const response = await axios.get(
        `http://localhost:3001/users/search?criteria=${searchCriteria}`
      );
      const users = response.data;
      setSearchResults(users);
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };
  
  const delayedSearch = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to trigger the search after a delay (e.g., 500ms)
    const newTimeout = setTimeout(() => {
      handleSearch();
    }, 500);

    setTypingTimeout(newTimeout);
  };

  useEffect(() => {
    delayedSearch();
    // Cleanup the timeout on component unmount
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [searchCriteria]);

  return (
    <div className='ms-5'>
      <input
        type="text"
        placeholder="Search For Users..."
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
        className='rounded-pill p-2 border'
      />
      <div
        className="search-results rounded mt-5"
        style={{
          position: 'absolute',
          top: '50px', // Adjust as needed for your layout
          
          right: '100px',
          width:"400px",
          maxHeight: '300px', // Set a max height for the scrollable container
          overflowY: 'auto',
          backgroundColor: 'white',
        }}
      >
        {searchResults.map((user) => (
          <div
            className="d-flex justify-content-between mt-4 p-2 rounded"
            style={{
              width: '400px',
            }}
            key={user._id}
          >
            <div className="d-flex align-items-center">
              <img
                src="https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                alt="Profile"
                className="rounded-circle"
                style={{ width: '60px', height: '60px' }}
              />
              <div className="mx-3">
                <h3
                  onClick={() => navigate(`/profiles/${user._id}`)}
                  style={{ cursor: 'pointer', margin: '0' }}
                >
                  {user.name}
                </h3>
                <span className="text-muted mb-0">
                  {user.level >= 150
                    ? 'Pro '
                    : user.level >= 50
                    ? 'Maxim '
                    : 'Noob '} 
                </span>
                <span className="text-muted">
                   &#8226; {user.friends.length} following
                </span>
                
              </div>
              
            </div>
            <button
              onClick={() => navigate('/home/post')}
              style={{ backgroundColor: '#DDC7A9' }}
              className="btn badge fw-bold fs-5 h-50 mt-2"
            >
              +
            </button>
            
          </div>
          
        ))}
        
      </div>
      
    </div>
  );
};

export default Search;
