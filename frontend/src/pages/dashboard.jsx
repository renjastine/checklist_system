import React, { useEffect, useState } from 'react';
import AddTaskModal from '../modal/addTaskModal';
import { Link } from 'react-router-dom';
import Navigator from './navigator';
import axios from 'axios';

function Dashboard() {
    const [addModal, setAddModal] = useState('none');    
    const [problem, setProblem] = useState([]);
    const [headerCategory, setHeaderCategory] = useState('');
    const [headerSubCategory, setHeaderSubCategory] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const category = localStorage.getItem('category');
    const subCategory = localStorage.getItem('subCategory');

    useEffect(() => {

        axios.post("http://localhost:5000/get_tasks", {category, subCategory})
        .then(res => {setProblem(res.data)})
        .catch(err => console.log(err));

    }, [])

    useEffect(() => {
        axios.post('http://localhost:5000/get_category', {category})
        .then(res => setHeaderCategory(res.data[0].category))
        .catch(err => console.log(err));

        axios.post('http://localhost:5000/get_subcat', {subCategory})
        .then(res => setHeaderSubCategory(res.data[0].sub_category))
        .catch(err => console.log(err));
        
    }, [problem])   

    useEffect(() => {
        const matchedProblems = problem.filter(items => items.prob_name.toLowerCase().includes(searchTitle.toLowerCase()));
        setSearchResult(matchedProblems);
    }, [searchTitle])
    

    function addModalOn() {
        setAddModal('flex');
    }
    

    return (
        <div className='dashboard-content'>
            <Navigator/>
            <div className='dc-wrap flex-c'>
                <div className='scsa flex-r'>
                    <input 
                        className='search no-outline' 
                        placeholder='Search Problem...' 
                        value={searchTitle}
                        onChange={e => setSearchTitle(e.target.value)}
                    />
                    <div className='btns flex-r'>
                        <Link to='/chatbot' className='b-link flex-c'>
                            <button className='chatbot'>Chatbot</button>
                        </Link>
                        <button className='add' onClick={addModalOn}>Add</button>
                    </div>
                </div>
                <div className='prob'>
                    <p className='p-directory'>{headerCategory ? headerCategory : 'Loading'} {" > "} {headerSubCategory? headerSubCategory : 'Loading'}</p>
                    {!searchTitle && <ListOfProblems problemList={problem}/>}
                    {searchTitle && <Search searchedProblems={searchResult} />}
                </div>
            </div>
            <AddTaskModal addModal={addModal} setAddModal={setAddModal}/>
        </div>
    )
}

function ListOfProblems({problemList}) {
    return (
        <>
            {
                problemList.length > 0 ? 
                <div className='grid'>
                    {
                        problemList?.map((data, i) => (
                            <Link to={'/view_problem/' + data.prob_no} className='redirect' key={i}>
                                
                                <div className='btn-prob flex-c'
                                    style={{
                                        backgroundColor: 
                                            data.status == 'Pending' ? '#d9d9d9'
                                            : data.status == 'In Progress' ? '#f5f88c' 
                                            : '#95f88c',
                                    }}
                                >
                                    <div>
                                        <span className='b-p-name'>{data.prob_name}</span>
                                    </div>
                                    <div>
                                        <span>Status: {data.status}</span>
                                    </div>
                                    <div>
                                        <span>Created: {data.date_created}</span>
                                    </div>
                                    <div>
                                        <span>Created by: {data.author}</span>
                                    </div>
                                    <div>
                                        <span>{data.finished !== null ? 'Tasked Finished: ' + data.finished : ''}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                </div> : <div className='nrf flex-c'>No Records</div>
            }
        </>
    )
}

function Search({searchedProblems}) {
    return (
        <>
            {
                searchedProblems.length > 0 ?
                    <div className='grid'>
                        {
                            searchedProblems?.map((data, i) => (
                                <Link to={'/view_problem/' + data.prob_no} className='redirect' key={i}>
                                    
                                    <div className='btn-prob flex-c'
                                        style={{
                                            backgroundColor: 
                                                data.status == 'Pending' ? '#d9d9d9'
                                                : data.status == 'In Progress' ? '#f5f88c' 
                                                : '#95f88c',
                                        }}
                                    >
                                        <div>
                                            <span className='b-p-name'>{data.prob_name}</span>
                                        </div>
                                        <div>
                                            <span>Status: {data.status}</span>
                                        </div>
                                        <div>
                                            <span>Created: {data.date_created}</span>
                                        </div>
                                        <div>
                                            <span>Created by: {data.author}</span>
                                        </div>
                                        <div>
                                            <span>{data.finished !== null ? 'Tasked Finished: ' + data.finished : ''}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div> : <div className='nrf flex-c'>No Result Found</div>
            }
        </>
    )
}

export default Dashboard;