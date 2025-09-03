import React, { useEffect, useState } from 'react';
import Cancel from '../css/icons/cancel.svg';
import axios from 'axios';

function EditProblem({
    editModalDisplay,
    setEditModalDisplay,
    problemDetails
}){
    const [desc, setDesc] = useState('');
    const [probNo, setProbNo] = useState('');
    const [probName, setProbName] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');
    const [currentSubCategory, setCurrentSubCategory] = useState('');
    const [specificSubCategory, setSpecificSubCategory] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/category')
        .then(res => setCategories(res.data))
        .catch(err => console.log(err));

        axios.get('http://localhost:5000/sub_category')
        .then(res => setSubCategories(res.data))
        .catch(err => console.log(err));
    }, [])
    

    useEffect(() => {
        if (problemDetails && problemDetails.length > 0) {
            setProbNo(problemDetails[0].prob_no);
            setProbName(problemDetails[0].prob_name);
            setDesc(problemDetails[0].description);
            setCurrentCategory(problemDetails[0].cat_id);
            setCurrentSubCategory(problemDetails[0].scat_id);
        }
    }, [problemDetails]);

    useEffect(() => {
        const filterData = subCategories.filter(items => items.cat_id === currentCategory);
        setSpecificSubCategory(filterData);

    }, [currentCategory])
    

    function turnOffModal() {
        setEditModalDisplay('none');
    }

    function updateProblem(){
        axios.post("http://localhost:5000/update_problem", {currentCategory, currentSubCategory, probName, desc, probNo})
        .then(res => {
            window.location.reload();
        })
        .catch(err => console.log(err));
    }

    return(
        <div className='add-modal flex-c' style={{display: editModalDisplay}}>
            <div className='task flex-c'>
                <div className='close' onClick={turnOffModal}>
                    <img className='close-icon' src={Cancel} />
                </div>
                <input type='text' className='title' 
                    value={probName} 
                    onChange={e => setProbName(e.target.value)} 
                placeholder='Title'/>
                <div className='row flex-r'>
                    <span>Category</span>
                    <select 
                        value={currentCategory} 
                        onChange={e => setCurrentCategory(e.target.value)} 
                        className='dropdown no-outline'
                    >
                        {
                            categories.map((data, i) => (
                                <option key={data.cat_id} value={data.cat_id}>{data.category}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='row flex-r'>
                    <span>Sub-Category</span>
                    <select

                        className='dropdown no-outline' 
                        value={currentSubCategory}
                        onChange={e => setCurrentSubCategory(e.target.value)}
                    >
                        {
                            specificSubCategory.map((data, i) => (
                                <option key={data.scat_id} value={data.scat_id}>{data.sub_category}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='desc flex-c'>
                    <p>Description</p>
                    <textarea placeholder='Description'
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                    ></textarea>
                </div>
                <button 
                className='addTask' 
                onClick={updateProblem}
                >Edit Problem</button>
            </div>
        </div>
    )
}

export default EditProblem;