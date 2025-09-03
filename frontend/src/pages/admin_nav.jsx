import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import Account from '../modal/account';
import axios from 'axios';

function AdminNav({setTableDetails}) {
    const [account, setAccount] = useState('none');
    const [finished, setFinished] = useState([]);
    const [pending, setPending] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const navigate = useNavigate();
    
    
    function enableAccount() {
        setAccount('flex');
    }

    function logout(){
        navigate('/');
        localStorage.setItem('role', '');
        localStorage.setItem('user', '');
    }

    useEffect(() => {
        axios.get('http://localhost:5000/get_finished')
        .then(res => setFinished(res.data))
        .catch(err => console.log(err));
        
        axios.get('http://localhost:5000/get_pendings')
        .then(res => setPending(res.data))
        .catch(err => console.log(err));
        
        axios.get('http://localhost:5000/get_inprogress')
        .then(res => setInProgress(res.data))
        .catch(err => console.log(err));
    }, [])
    

    return(
        <div className='admin-nav'>
            <h1 className='an-header'>Admin</h1>
            <div className='an-record mb'>
                <h4 className='an-r-header'>Record</h4>
                <div className='an-r-buttons'>
                    <div className='an-r-b-row' onClick={() => setTableDetails('Finished')}>Finished <span>{finished.length}</span></div>
                    <div className='an-r-b-row' onClick={() => setTableDetails('In Progress')}>In Progress <span>{inProgress.length}</span></div>
                    <div className='an-r-b-row' onClick={() => setTableDetails('Pending')}>Pending <span>{pending.length}</span></div>
                </div>  
            </div>
            <div className='n-account'>
                <h4 className='n-a-header'>Account</h4>
                <div className='n-a-wrap'>
                    <p className='n-a-w-button' onClick={enableAccount}>Account</p>
                    <Link to='/' className='n-a-w-b-link'>
                        <p className='n-a-w-button' onClick={logout}>Logout</p>
                    </Link>
                </div>
            </div>
            <Account displayAccount={account} setDisplayAccount={setAccount}/>
        </div>
    )
}

export default AdminNav;
