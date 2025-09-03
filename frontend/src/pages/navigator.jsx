import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

import Account from '../modal/account';

function Navigator({changeCategory}) {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [bora, setBora] = useState('0');
    const [account, setAccount] = useState('none');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/category")
        .then(res => setCategories(res.data))
        .catch(err => console.log(err));
        
        axios.get("http://localhost:5000/sub_category")
        .then(res => setSubCategories(res.data))
        .catch(err => console.log(err));
    }, [])     

    function openCategory(category_id) {
        setSelectedCategory(category_id)
    }

    function closeCategory() {
        setSelectedCategory(null)
    }

    function filterSubCategory(catID) {
        const filterData = subCategories.filter(items => items.cat_id === catID);
        return filterData.map((data) => (
            <button 
                key={data.scat_id} 
                className='n-c-cs-sc-button' 
                onClick={() => {content(catID, data.scat_id)}}
            >{data.sub_category}</button>
        ));
    }

    const content = (category, subCategory) => {
        localStorage.setItem('category', category);
        localStorage.setItem('subCategory', subCategory);
        navigate('/dashboard');
        window.location.reload();
    }

    function enableAccount() {
        setAccount('flex');
    }

    function logout(){
        navigate('/');
        localStorage.setItem('role', '');
        localStorage.setItem('user', '');
        localStorage.setItem('category', null);
        localStorage.setItem('subCategory', null);
    }

    return (
        <div className='navigator'>
            <h1 className='n-header'>Dashboard</h1>
            <div className='n-categories'>
                <h4 className='n-c-header'>Categories</h4>
                <div className='n-c-category'>
                    {
                        categories.map((data, i) => (
                            <div key={i} className='n-c-cat-sub' 
                                onMouseEnter={() => openCategory(data.cat_id)}
                                onMouseLeave={() => closeCategory()}>
                                <button 
                                    className='n-c-cs-category' 
                                    style={{borderRadius: bora}}
                                    >
                                    {data.category}
                                </button>
                                <div className='n-c-cs-subcategory'>
                                    {selectedCategory === data.cat_id && filterSubCategory(data.cat_id)}
                                </div>
                            </div>
                        ))
                    }
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

export default Navigator;