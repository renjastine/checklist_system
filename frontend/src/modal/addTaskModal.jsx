import React, { useEffect, useState } from 'react';
import Cancel from '../css/icons/cancel.svg';
import axios from 'axios';

function AddTaskModal({addModal, setAddModal}) {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [specificSubCategory, setSpecificSubCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [title, setTitle] = useState('Untitled');
    const [desc, setDesc] = useState('');
    const [author, setAuthor] = useState('');
    const userToken = localStorage.getItem('user');

    useEffect(() => {
        axios.get("http://localhost:5000/category")
        .then(res => setCategories(res.data))
        .catch(err => console.log(err));
        
        axios.get("http://localhost:5000/sub_category")
        .then(res => setSubCategories(res.data))
        .catch(err => console.log(err));
        
        axios.post('http://localhost:5000/get_user', {userToken})
        .then(res => setAuthor(res.data[0].name))
        .catch(err => console.log(err));
    }, [])

    useEffect(() => {
        const filterData = subCategories.filter(items => items.cat_id === selectedCategory);
        setSpecificSubCategory(filterData);
    }, [selectedCategory])
    

    function turnOffModal() {
        setAddModal('none');
    }   

    const addTask = () => {
        const now = new Date();
        const date_created = now.toLocaleDateString() + " " + now.toLocaleTimeString();
        const tempTitle = title.length === 0 ? 'Untitled' : title;
        
        if (selectedCategory.length === 0) {
            alert('Please select Category');
        } else {
            if(selectedSubCategory.length === 0){
                alert('Please select Sub-Category');
            } else {                
                axios.post("http://localhost:5000/add_task", {
                    selectedCategory, 
                    selectedSubCategory, 
                    tempTitle, 
                    desc, 
                    date_created, 
                    userToken
                })
                .then(res => {
                    window.location.reload();
                })
                .catch(err => console.log(err));
            }
        }

    }

    return (
        <div className='add-modal flex-c' style={{display: addModal}}>
            <div className='task flex-c'>
                <div className='close' onClick={turnOffModal}>
                    <img className='close-icon' src={Cancel} />
                </div>
                <input 
                    type='text' 
                    className='title' 
                    placeholder='Title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <div className='row flex-r'>
                    <span>Category</span>
                    <select 
                        className='dropdown no-outline'
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        <option value={''}>-</option>
                        {categories.map((data, i) => (
                                <option key={data.cat_id} value={data.cat_id}>{data.category}</option>
                            ))}
                    </select>
                </div>
                <div className='row flex-r'>
                    <span>Sub-Category</span>
                    <select 
                        className='dropdown no-outline'
                        value={selectedSubCategory}
                        onChange={e => setSelectedSubCategory(e.target.value)}
                    >
                        <option value={''} >-</option>
                        {
                            specificSubCategory.map((data, i) => (
                                <option key={data.scat_id} value={data.scat_id}>{data.sub_category}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='desc flex-c'>
                    <p>Description</p>
                    <textarea 
                        placeholder='Description'
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                    ></textarea>
                </div>
                <button 
                    className='addTask'
                    onClick={addTask}
                >Add Task</button>
            </div>
        </div>
    )
}

export default AddTaskModal;