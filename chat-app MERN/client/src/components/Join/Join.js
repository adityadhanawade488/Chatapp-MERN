import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';



import './Join.css';

export default function Join() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [room, setRoom] = useState('');
  const [loggedIn, setLoggedIn]= useState(false);
//Login Function
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!name || !password || !room){
    alert("Please fill in all fields");
    return;
    }

    try {
      const res = await axios.post("http://localhost:5000", {name,password});
      if (res.data.message === "Login Successful"){
        setLoggedIn(true);
      } else{
        alert("Login Failed");
      }
    } catch(err){
      alert(err.response?.data?.error || "Login Failed");
    }
  };

  if(loggedIn){
    return <Redirect to={`/chat?name=${name}&room=${room}`}/>;
  }
//Login Form
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Username" required="true" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Password" required="true" className="joinInput mt-10" type="password" onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div>
          <input placeholder="Room Name" required="true" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
        </div>
        <Link onClick={handleSubmit}  >
          <button className="button mt-20" type="submit">Login</button>
        </Link>
        <div className="signup">
          <a href='/signup'>Don't have an account? Signup</a>
        </div>
      </div>
      
    </div>
  );
}

