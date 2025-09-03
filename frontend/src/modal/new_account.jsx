import React, { useEffect, useState } from 'react';
import Close from '../css/icons/cancel.svg';
import axios from 'axios';

function NewAccount({newAccountDisplay, setNewAccountDisplay}) {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [isMatched, setIsMatched] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    function disableNewAccount() {
        setNewAccountDisplay('none');
    }

    function handleCreateAccount(event) {
        event.preventDefault();
        if (isApproved && isMatched){
            axios.post("http://localhost:5000/create_account", {username, password})
            .then(res => {
                alert(res.data[0].status);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            })
            .catch(err => console.log(err));
        }
    }   

    useEffect(() => {
        if (username.length >= 8) {
            setMessage('');

            axios.post('http://localhost:5000/find_username', {username})
            .then(res => {
                if (res.data[0].isFound == 'yes'){
                    setMessage('Username is already taken!');
                    setIsApproved(false);
                } else {
                    setMessage('');
                    setIsApproved(true);
                }
            })
            .catch(err => console.log(err));
        } else if (username.length === 0) {
            setMessage('');
            setIsApproved(false);
        } else {
            setIsApproved(false);
            setMessage('Username must be at least 8 characters long.');
        }
    }, [username])

    useEffect(() => {
      if (password.length >= 8 && confirmPassword.length >= 8) {
        setMessage('');
        if (password === confirmPassword) {
            setIsMatched(true);
        } else {
            setMessage('Password and Confirm Password do not match.');
            setIsMatched(false);
        }
      } else if (password.length == 0 && confirmPassword.length == 0){
        setMessage('');
        setIsMatched(false);
      } else {
        setMessage('Password and Confirm Password must be at least 8 characters long.');
        setIsMatched(false);
      }
    }, [password, confirmPassword])   

    return (
        <div className='new-account-modal' style={{display: newAccountDisplay}}>
            <form className='nam-create-account' onSubmit={handleCreateAccount}>
                <div className='nam-ca-close' onClick={disableNewAccount}>
                    <img className='nam-ca-c-close' src={Close}/>
                </div>
                <h1 className='nam-ca-header'>Create Account</h1>
                <div className='nam-ca-row'>
                    <input type='text' className='nam-c-r-input' placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    required/>
                </div>
                <div className='nam-ca-row'>
                    <input type='password' className='nam-c-r-input' placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    required/>
                </div>
                <div className='nam-ca-row'>
                    <input type='password' className='nam-c-r-input' placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    required/>
                </div>
                <div className='nam-ca-row'>
                    <button className='nam-c-r-button'>Create</button>
                </div>
                <div 
                    className={'nam-c-a-message flex-c'}
                    style={{color: 'red'}}>
                    <span>{message}</span>
                </div>
            </form>
        </div>
    )
}

export default NewAccount;