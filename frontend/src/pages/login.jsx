import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import NewAccount from '../modal/new_account';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [newAccount, setNewAccount] = useState('none');

    const navigate = useNavigate();

    useEffect(() => {
      const user = localStorage.getItem('user');
      const role = localStorage.getItem('role');
      
      if (user != '' && role != ''){
        if (role == 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
      }
    }, [])
    

    async function handleSubmit(event) {
        event.preventDefault();
        const isFound = await findUsername();
        if (isFound == 'yes') {
            const userData = await isPassCorrect();
            // console.log(userData.data[0].username);
            if (userData.data === 'incorrect'){
                setMessage('Incorrect Password');
            } else {
                localStorage.setItem('user', userData.data[0].username);
                localStorage.setItem('role', userData.data[0].type);
                localStorage.setItem('category', 'HAR');
                localStorage.setItem('subCategory', 'har_1');

                if(userData.data[0].type == 'admin'){
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } else {
            setMessage('Username not found');
        }
    }

    async function findUsername() {
        const res = await axios.post("http://localhost:5000/find_username", {username});
        return res.data[0].isFound;
    }

    function enableNewAccount() {
        setNewAccount('flex');
    }

    async function isPassCorrect() {
        const res = await axios.post("http://localhost:5000/is_password_correct", {username, password});
        return res;
    }

    return(
        <div className='login'>
            <div className='l-title l-t-flex'>
                <h1 className='l-t-header no-margin'>Web-based Ticketing System</h1>
                <h3 className='l-t-office no-margin'>for ICT Office</h3>
            </div>
            <div className='l-form l-t-flex'>
                <form onSubmit={handleSubmit}>
                    <p className='l-f-message'>{message}</p>
                    <h4 className='l-f-header'>Login</h4>
                    <div className='l-f-row'>
                        <input 
                            type='text' 
                            className='l-f-input text no-outline'
                            onChange={e => setUsername(e.target.value)}
                            placeholder='Username'
                            required/>
                    </div>
                    <div className='l-f-row'>
                        <input 
                            type='password' 
                            className='l-f-input text no-outline' 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder='Password'
                            required/>
                    </div>
                    <div className='l-f-row'>
                        <input type='submit' className='l-f-button login' value='Login'/>
                    </div>
                    <div className='l-f-row border-top'>
                        <div className='l-f-button new-account flex-c' onClick={enableNewAccount}>New Account</div>
                    </div>
                </form>
            </div>
            <NewAccount newAccountDisplay={newAccount} setNewAccountDisplay={setNewAccount}/>
        </div>
    )
} 

export default Login;