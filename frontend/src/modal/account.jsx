import React, { useState } from 'react';
import Cancel from '../css/icons/cancel.svg';
import { useEffect } from 'react';
import axios from 'axios';

function Account({displayAccount, setDisplayAccount}) {
    const [profile, setProfile] = useState('flex');
    const [changeName, setChangeName] = useState('none');
    const [changeUsername, setChangeUsername] = useState('none');
    const [changePassword, setChangePassword] = useState('none');

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [decoyPassword, setDecoyPassword] = useState('gotchu_nerd');
    const [role, setRole] = useState('');

    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        const userToken = localStorage.getItem('user');

        if (newName.length !== 0){
            axios.post('http://localhost:5000/update_name', {name, userToken})
            .then(res => console.log(res))
            .catch(err => console.log(err));
        }

        setNewName('');
    }, [newName])

    useEffect(() => {
        const userToken = localStorage.getItem('user');

        if (newUsername.length != 0){
            axios.post('http://localhost:5000/update_username', {username, userToken})
            .then(res => localStorage.setItem('user', newUsername))
            .catch(err => console.log(err));
        }
        setNewUsername('');
    }, [newUsername])

    useEffect(() => {
        const userToken = localStorage.getItem('user');
        axios.post('http://localhost:5000/get_user', {userToken})
        .then(res => {
            setName(res.data[0].name);
            setUsername(res.data[0].username);
            setRole(res.data[0].role);
            setPassword(res.data[0].password);
        })
        .catch(err => console.log(err));
    }, [])

    function enableProfile(){
        setProfile('flex');
        setChangeName('none');
        setChangeUsername('none');
        setChangePassword('none');  
    }

    function enableChangeName(){
        setProfile('none');
        setChangeName('flex');
        setChangeUsername('none');
        setChangePassword('none');
    }
    
    function enableChangeUsername(){
        setProfile('none');
        setChangeName('none');
        setChangeUsername('flex');
        setChangePassword('none');
    }
    
    function enableChangePassword(){
        setProfile('none');
        setChangeName('none');
        setChangeUsername('none');
        setChangePassword('flex');
    }

    function disableAccount(){
        setDisplayAccount('none');
        window.location.reload();
    }


    return (
        <div className='acc-modal' style={{display: displayAccount}}>
            <div className='acc-modal-wrap'>
                <div className='acc-modal-nav'>
                    <h1 className='am-n-header'>Account</h1>
                    <button className='btn-prof' onClick={enableProfile}>Profile</button>
                    <h5 className='change-header'>Change</h5>
                    <div className='acc-modal-nav-change'>
                        <button className='amnc-link' onClick={enableChangeName}>Name</button>
                        <button className='amnc-link' onClick={enableChangeUsername}>Username</button>
                        <button className='amnc-link' onClick={enableChangePassword}>Password</button>
                    </div>
                </div>
                <div className='acc-modal-content'>
                    <div className='close' onClick={disableAccount}>
                        <img className='close-icon' src={Cancel} />
                    </div>
                    <Profile 
                        profileDisplay={profile} 
                        viewName={enableChangeName} 
                        viewUsername={enableChangeUsername} 
                        viewPassword={enableChangePassword}
                        profileName={name}
                        profileRole={role}
                        profileUsername={username}
                        profilePassword={decoyPassword}
                    />
                    <ChangeName 
                        changeNameDisplay={changeName}
                        profileName={name}
                        setProfileName={setName}
                        setProfileNewName={setNewName}
                        backToProfile={enableProfile}
                        
                    />
                    <ChangeUsername 
                        changeUsernameDisplay={changeUsername}
                        profileUsername={username}
                        setProfileUsername={setUsername}
                        setProfileNewUsername={setNewUsername}
                        backToProfile={enableProfile}
                    />
                    <ChangePassword 
                        changePasswordDisplay={changePassword}
                        lastPassword={password}
                        setLastPassword={setPassword}
                        backToProfile={enableProfile}
                    />
                </div>
            </div>
        </div>
    )
}

function Profile({
    profileDisplay, 
    viewName, 
    viewUsername, 
    viewPassword,
    profileName,
    profileRole,
    profileUsername,
    profilePassword,
}){ 

    const now = new Date();
    const userToken = localStorage.getItem('user');
    const userRole = localStorage.getItem('role');
    const [totalToday, setTotalToday] = useState(0);
    const [totalTask, setTotalTask] = useState(0);

    useEffect(() => {
        const finished = now.toLocaleDateString() + "%";
        axios.post("http://localhost:5000/total_task_done_today", {userToken, finished})
        .then(res => setTotalToday(res.data[0].total))
        .catch(err => console.log(err));
        
        axios.post("http://localhost:5000/total_task_done", {userToken, finished})
        .then(res => setTotalTask(res.data[0].total))
        .catch(err => console.log(err));

    }, [])

    return (
        <div className='profile' style={{display: profileDisplay}}>
            <h1 className='profile-header'>Profile</h1>
            {userRole === 'staff' ? (
                <div className='task-comp'>
                    <h5 className='task-header'>Task Completed</h5>
                    <div className='task-wrap'>
                        <div className='today'>
                            <p className='num'>{totalToday}</p>
                            <p className='task-label'>Today</p>
                        </div>
                        <div className='total'>
                            <p className='num'>{totalTask}</p>
                            <p className='task-label'>Total</p>
                        </div>
                    </div>
                </div>) : ''}
            <div className='user-details'>
                <div className='row top-corner cursor' onClick={viewName}>
                    <p className='bold'>Name</p>
                    <p className='ud-details'>{profileName}</p>
                </div>
                <div className='row' id='topless'>
                    <p className='bold'>Role</p>
                    <p className='ud-details'>{profileRole}</p>
                </div>
                <div className='row cursor' id='topless' onClick={viewUsername}> 
                    <p className='bold'>Username</p>
                    <p className='ud-details'>{profileUsername}</p>
                </div>
                <div className='row bot-corner cursor' id='topless' onClick={viewPassword}>
                    <p className='bold'>Password</p>
                    <input type='password' className='pass-outline' value={profilePassword} readOnly/>
                </div>
            </div>
        </div>
    )
}

function ChangeName({
    changeNameDisplay,
    profileName,
    setProfileName,
    setProfileNewName,
    backToProfile
}) {

    const [name, setName] = useState(profileName);

    useEffect(() => {
        setName(profileName);
    }, [profileName])
    

    const setNewName = () => {
        setProfileNewName(name);
        setProfileName(name);
        backToProfile();
    }

    return (
        <div className='change-name' style={{display: changeNameDisplay}}>
            <h1 className='cn-header'>Change Name</h1>
            <div className='cn-content'>
                <p className='cn-c-header'>Name</p>
                <input type='text' className='cn-c-input' 
                value={name} onChange={(e) => setName(e.target.value)} 
                placeholder='Enter Name'/>
            </div>
            <button className='cn-button' onClick={setNewName}>Save Changes</button>
        </div>
    )
}

function ChangeUsername({
    changeUsernameDisplay,
    profileUsername,
    setProfileUsername,
    setProfileNewUsername,
    backToProfile
}) {
    const [username, setUsername] = useState(profileUsername);
    const [message, setMessage] = useState('');
    const [enableUseEffect, setEnableUseEffect] = useState(false);
    const [enableUpdate, setEnableUpdate] = useState(false);

    useEffect(() => {
        setUsername(profileUsername);
    }, [profileUsername])

    useEffect(() => {
        if (enableUseEffect){
            if(username.length >= 8){
                setMessage('');
                axios.post('http://localhost:5000/find_username', {username})
                .then(res => {
                    if (res.data[0].isFound == 'yes') {
                        setMessage('Username is already taken');
                        setEnableUpdate(false);
                    } else {
                        setEnableUpdate(true);
                        setMessage('');
                    }
                });
            } else {
                setMessage('Username must be at least 8 characters long');
                setEnableUpdate(false);
            }
        }
    }, [username, enableUseEffect])
    
    const inputUser = (e) => {
        setUsername(e.target.value);
        setEnableUseEffect(true);
    }

    const updateUsername = () => {
        if(enableUpdate){
            setProfileNewUsername(username);
            setProfileUsername(username);
            backToProfile();
        }
    }

    const setNewUsername = () => {
        setProfileUsername(username);
        backToProfile();
    }
    
    return (
        <div className='change-name flex-c' style={{display: changeUsernameDisplay}}>
            <h1 className='cn-header'>Change Username</h1>
            <div className='cn-content'>
                <p className='cn-c-taken'>{message}</p>
                <p className='cn-c-header'>Username</p>
                <input type='text' className='cn-c-input' 
                value={username} onChange={inputUser} 
                placeholder='Enter Username'/>
            </div>
            <button className='cn-button' onClick={updateUsername}>Save Changes</button>
        </div>
    )
}

function ChangePassword({
    changePasswordDisplay,
    lastPassword,
    setLastPassword,
    backToProfile
}) {
    // Password and Confirm Password do not matched
    const [message, setMessage] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isReadOnly, setIsReadOnly] = useState(true);

    useEffect(() => {
        if(oldPassword.length > 0){
            if (oldPassword === lastPassword){
                setIsReadOnly(false);
                setMessage('');
            } else {
                setIsReadOnly(true);
                setNewPassword('');
                setConfirmPassword('');
                setMessage('Invalid Old Password');
            }
        }
    }, [oldPassword])
    

    function changePassword(){
        if (newPassword.length >= 8 && confirmPassword.length >= 8){
            setMessage('');
            if(newPassword === confirmPassword){
                setMessage('');
                updatePassword(newPassword);
            } else {
                setMessage("Password and Confirm Password do not matched");
            }
        } else {
            setMessage('Password and Confirm Password must be at least 8 characters long');
        }
    }

    function updatePassword(password) {
        const userToken = localStorage.getItem('user');
        axios.post('http://localhost:5000/change_password', {password, userToken})
        .then(res => {
            alert('Password Change');
            setLastPassword(password);
            backToProfile();
            setOldPassword('');
            setConfirmPassword('');
            setNewPassword('');

        })
        .catch(err => console.log(err));
    }
    

    return (
        <div className='change-password' style={{display: changePasswordDisplay}}>
            <h1 className='cp-header'>Change Password</h1>
            <div className='cp-content'>
                <p className='cn-c-error'>{message}</p>
                <div className='cp-c-row cp-c-old bora-top'>
                    <p className='label bold'>Old Password</p>
                    <input type='password' value={oldPassword} onChange={e => setOldPassword(e.target.value)} className='cp-c-input bor-bot'/>                
                </div>
                <div className='cp-c-row cp-c-new no-top-border'>
                    <p className='label bold no-top-border'>New Password</p>
                    <input type='password' className='cp-c-input bor-bot' 
                        readOnly={isReadOnly}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        />
                </div>
                <div className='cp-c-row cp-c-confirm no-top-border bora-bot'>
                    <p className='label bold'>Confirm Password</p>
                    <input type='password' className='cp-c-input bor-bot' 
                        readOnly={isReadOnly}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        />
                </div>
            </div>
            <button className='cn-button cp-button'
                onClick={changePassword}    
            >Save Changes</button>
        </div>
    )
}


export default Account;