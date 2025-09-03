import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import EditProblem from '../modal/editProblem';
import Navigator from './navigator';


function ViewProblem() {
    const {prob_no} = useParams();
    const navigate = useNavigate();
    const [probDetails, setProbDetails] = useState([]);
    const [showCategory, setShowCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [editModal, setEditModal] = useState('none');
    const now = new Date();
    const userToken = localStorage.getItem('user');
    const [userName, setUserName] = useState('');


    useEffect(() => {
        axios.post("http://localhost:5000/get_problem_details", {prob_no})
        .then(res => setProbDetails(res.data))
        .catch(err => console.log(err));

        axios.post('http://localhost:5000/get_user', {userToken})
        .then(res => {
            setUserName(res.data[0].name);
        })
        .catch(err => console.log(err));
    }, [])

    function getCategory(category) {
        axios.post('http://localhost:5000/get_category', {category})
        .then(res => setShowCategory(res.data[0].category))
        .catch(err => console.log(err));
    }

    function getSubCategory(subCategory) {
        axios.post('http://localhost:5000/get_subcat', {subCategory})
        .then(res => setSubCategory(res.data[0].sub_category))
        .catch(err => console.log(err));
    }

    function openEdit() {
        setEditModal('flex');
    }

    const deleteProblem = () => {
        const confirmation = window.confirm('Are you okay?');
        if (confirmation) {
            axios.post('http://localhost:5000/delete_prob', {prob_no})
            .then(res => {
                navigate('/dashboard');
            })
            .catch(err => console.log(err));
        }
    }

    const takeTask = () => {
        // user
        // prob_no
        // progress_started
        // status

        const progStart = now.toLocaleDateString() + " " + now.toLocaleTimeString();
        const user = localStorage.getItem('user');
        
        axios.post('http://localhost:5000/take_task', {prob_no, user, progStart})
        .then(res => {
            navigate('/dashboard');
        })
        .catch(err => console.log(err));
    }  
    
    const cancelTask = () => {
        // user = null
        // prob_no
        // progress_started = null
        // status = Pending

        axios.post('http://localhost:5000/cancel_task', {prob_no})
        .then(res => {
            console.log(res.data);
            navigate('/dashboard');
        })
        .catch(err => console.log(err));
    }

    const doneTask = () => {
        // Name of the User => userToken
        // prob_no
        // Finished => date
        // Status => Finished

        const finished = now.toLocaleDateString() + " " + now.toLocaleTimeString();
        axios.post('http://localhost:5000/finish_task', {finished, userToken, prob_no})
        .then(res => {
            navigate('/dashboard');
        })
        .catch(err => console.log(err));

    }

    return (
        <div className='problem-content flex-r'>
            <Navigator />
            <EditProblem
                editModalDisplay={editModal}
                setEditModalDisplay={setEditModal}
                problemDetails={probDetails}
            />
            {probDetails.map((data, i) => (
                <div className='pc-wrap' key={i}>
                    {getCategory(data.cat_id)}
                    {getSubCategory(data.scat_id)}

                    <div className='header'>
                        <p className='title'>{data.prob_name}</p>
                        {
                            data.author === localStorage.getItem('user') ?
                            (<div className='btn'>
                                <button 
                                    className='b-edit' 
                                    onClick={openEdit}
                                >Edit</button>
                                <button
                                    onClick={deleteProblem}
                                >Delete</button>
                            </div>) : ''
                        }
                        
                    </div>
                    <div className='details'>
                        <div className='d-1'>
                            <p>Status: {data.status}</p>
                            <p>Category: {showCategory}</p>
                            <p>Sub-Category: {subCategory}</p>
                        </div>
                        <div className='d-2'>
                            <p>Date Created: {data.date_created}</p>
                            <p>{data.progress_started === null ? '' : "Progress Started: " + data.progress_started}</p>
                            <p>{data.finished === null ? '' : "Finished: " + data.finished}</p>
                        </div>
                    </div>
                    <div className='prob-desc'>
                        <p>Description</p>
                        <textarea placeholder='Description' value={data.description} readOnly></textarea>
                    </div>
                    <div className='prob-status'>
                        <p>
                            {
                                data.status === 'In Progress' ? 
                                "Taken by: " + data.taken_by : data.status === 'Finished' ?
                                "Completed by: " + data.solved_by : ''
                            }
                        </p>
                        <div className='btn-st'>
                            {
                                data.status === 'Pending' ? 
                                (<button 
                                    id='b-s-take'
                                    onClick={takeTask}
                                >Take</button>) : 
                                data.status === 'In Progress' && data.taken_by === localStorage.getItem('user') ?
                                (<>
                                    <button 
                                        id='b-s-done'
                                        onClick={doneTask}
                                    >Done</button>
                                    <button
                                        id='b-s-cancel'
                                        onClick={cancelTask}
                                    >Cancel</button>
                                </>) : data.status === 'Finished' && data.taken_by === localStorage.getItem('user') ?
                                <button
                                    id='b-s-retake'
                                    onClick={takeTask}
                                >Reopen</button> : ''
                                
                            }
                            
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ViewProblem;