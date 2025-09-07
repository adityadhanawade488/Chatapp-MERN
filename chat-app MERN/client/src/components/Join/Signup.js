import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Signup.css';


export default function Signup() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
//Signup Function
  const handleSubmit = async () => {

    if(!name || !password){
    alert("Please fill in all fields");
    return;
    }

    try {
      const securePassword = btoa(password);
      const res = await axios.post("http://localhost:5000/signup", {name,password: securePassword});
      alert("Saved User : "+res.data.name);
    } catch(err) {
      console.error(err);
      alert("error");
    }
  };


//Signup Form
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Signup</h1>
        <div>
          <input placeholder="Username"  required="true" className="joinInput" type="text" value= {name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Password" required="true" className="joinInput mt-20" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <Link onClick={(e) => {e.preventDefault(); handleSubmit(); }}>
          <button className="button mt-20" type="submit">Signup</button>
        </Link>
        <div className="login">
          <a href='/'>Already have an account - Login</a>
        </div>
      </div>
    </div>
  );
}

