import React, { useEffect, useState } from 'react';
import AdminNav from './admin_nav';
import axios from 'axios';
import {CSVLink} from "react-csv";
import ViewInfo from '../modal/viewInfo';

function Admin() {
    const [table, setTable] = useState('Finished');
    const [tableBody, setTableBody] = useState([]);

    const [subCategoryList, setSubCategoryList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [staff, setStaff] = useState([]);
    const [dateCreated, setDateCreated] = useState([]);
    const [dateFinished, setDateFinished] = useState([]);
    const [progressStarted, setProgressStarted] = useState([]);

    const [specificSubCategory, setSpecificSubCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedDateCreated, setSelectedDateCreated] = useState('');
    const [selectedDateFinished, setSelectedDateFinished] = useState('');  
    const [selectedCompletedBy, setSelectedCompletedBy] = useState('');
    const [selectedProgress, setSelectedProgress] = useState('');

    const [viewInfoModalKey, setViewInfoModalKey] = useState('none');
    const [targetProbNo, setTargetProbNo] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/category')
        .then(res => setCategoryList(res.data));

        axios.get('http://localhost:5000/sub_category')
        .then(res => setSubCategoryList(res.data));

        axios.get('http://localhost:5000/get_staff')
        .then(res => setStaff(res.data))

        axios.get('http://localhost:5000/get_creation_dates')
        .then(res => setDateCreated(res.data))

        axios.get('http://localhost:5000/get_finish_dates')
        .then(res => setDateFinished(res.data))

        axios.get('http://localhost:5000/get_progress_started')
        .then(res => setProgressStarted(res.data))
    }, [])

    useEffect(() => {
        setSelectedCategory('');
        setSelectedSubCategory('');
        setSelectedDateCreated('');
        setSelectedDateFinished('');
        setSelectedCompletedBy('');
        setSelectedProgress('');

        axios.post('http://localhost:5000/get_table_details', {table})
        .then(res => setTableBody(res.data))
        .catch(err => console.log(err));
        
    }, [table])

    useEffect(() => {
        const filterData = subCategoryList.filter(items => items.cat_id === selectedCategory);
        setSpecificSubCategory(filterData);
        setSelectedSubCategory('');
    }, [selectedCategory])

    useEffect(() => {
        const addCat = selectedCategory.length ? " AND p.cat_id='" + selectedCategory + "'" : "";
        const addSCat = selectedSubCategory.length ? " AND p.scat_id='" + selectedSubCategory + "'" : "";
        const addDateCreated = selectedDateCreated.length ? " AND date_created LIKE '" + selectedDateCreated + "%'" : "";
        const addDateFinished = selectedDateFinished.length ? " AND finished LIKE '" + selectedDateFinished + "%'" : "";
        const addCompletedBy = selectedCompletedBy.length ? " AND solved_by='" + selectedCompletedBy + "'" : "";
        const addProgress = selectedProgress.length ? " AND progress_started LIKE '" + selectedProgress + "%'" : "";

        const addedQuery = addCat + addSCat + addDateCreated + addDateFinished + addCompletedBy + addProgress;

        axios.post('http://localhost:5000/filter_table', {table, addedQuery})
        .then(res => setTableBody(res.data));

    }, [selectedCategory, selectedSubCategory, selectedDateCreated, selectedDateFinished, selectedCompletedBy, selectedProgress])
    
    
    const get_dates = (dateTime) => {
        const dates = [];
        dateTime.map(data => {
            const cleanDate = data.date_created || data.finished || data.progress_started;
            const result = dates.find(date => date === cleanDate.split(" ")[0]);
            if (!result) dates.push(cleanDate.split(" ")[0])
        });
        
        return dates;
    }

    const header = [
        {label: 'Task #', key: 'prob_no'},
        {label: 'Category', key: 'cat_id'},
        {label: 'Sub-Category', key: 'scat_id'},
        {label: 'Title', key: 'prob_name'},
        {label: 'Description', key: 'description'},
        {label: 'Status', key: 'status'},
        {label: 'Date Created', key: 'date_created'},
        {label: 'Progress Started', key: 'progress_started'},
        {label: 'Date Finished', key: 'finished'},
        {label: 'Completed by', key: 'solved_by'},
        {label: 'Created by', key: 'author'},
        {label: 'Taken by', key: 'taken_by'},
    ]

    return (
        <div className='admin'>
            <AdminNav 
                setTableDetails={setTable}
            />
            <div className='ad-content flex-c'>
                <div className='ad-filters flex-r'>
                    <p className='ad-f-msg flex-c'>{tableBody.length ? '' : 'No Records Found'}</p>
                    <CSVLink 
                        className='ad-f-csv flex-c'
                        data={tableBody} 
                        headers={header}
                        filename={table + ".csv"}
                    >
                        CSV
                    </CSVLink>
                </div>
                <div className='ad-table'>
                    <table className='ad-t-orig-table'>
                        <thead className='ad-head'>
                            <tr>
                                <th className='col-1'>Task #</th>
                                <th className='col-2'>Task Title</th>
                                <th className='col-2'>
                                    <select 
                                        className='ad-f-dropdown no-outline'
                                        value={selectedCategory}
                                        onChange={e => setSelectedCategory(e.target.value)}
                                    >
                                        <option className='ad-f-d-option first-option' value={''}>Category</option>
                                        {categoryList.map(category => (
                                                <option 
                                                    key={category.cat_id} 
                                                    value={category.cat_id} 
                                                    className='ad-f-d-option'
                                                >{category.category}</option>
                                            ))}
                                    </select>
                                </th>
                                <th className='col-2'>
                                    <select 
                                        className='ad-f-dropdown no-outline'
                                        value={selectedSubCategory}
                                        onChange={e => setSelectedSubCategory(e.target.value)}
                                    >
                                        <option 
                                            className='ad-f-d-option first-option' 
                                            value={''}
                                        >Sub-Category</option>
                                        {specificSubCategory.map(subCategory => (
                                                <option 
                                                    key={subCategory.scat_id} 
                                                    value={subCategory.scat_id} 
                                                    className='ad-f-d-option'
                                                >{subCategory.sub_category}</option>
                                            ))}
                                    </select>
                                </th>
                                <th className='col-2'>
                                    <select 
                                        className='ad-f-dropdown no-outline'
                                        value={selectedDateCreated}
                                        onChange={e => setSelectedDateCreated(e.target.value)}
                                    >
                                        <option 
                                            className='ad-f-d-option first-option'
                                            value={''}
                                        >Date Created</option>
                                        {get_dates(dateCreated).map((date, i) => (
                                                <option 
                                                    key={i} 
                                                    className='ad-f-d-option' 
                                                    value={date}
                                                >{date}</option>
                                            ))}
                                    </select>
                                </th>
                                <th className={table === 'Finished' || table === 'In Progress' ? 'col-2' : 'hide'}>
                                    {table === 'Finished' ? (
                                            <select 
                                                className='ad-f-dropdown no-outline'
                                                value={selectedDateFinished}
                                                onChange={e => setSelectedDateFinished(e.target.value)}
                                            >
                                                <option 
                                                    className='ad-f-d-option first-option' 
                                                    value={''}
                                                >Date Finished</option>
                                                {get_dates(dateFinished).map((date, i) => (
                                                        <option 
                                                            key={i} 
                                                            className='ad-f-d-option'
                                                            value={date}
                                                        >{date}</option>
                                                    ))}
                                            </select>
                                        ) : table === 'In Progress' ? (
                                            <select 
                                                className='ad-f-dropdown no-outline'
                                                value={selectedProgress}
                                                onChange={e => setSelectedProgress(e.target.value)}
                                            >
                                                <option 
                                                    className='ad-f-d-option first-option' 
                                                    value={''}
                                                >Progress Started</option>
                                                {get_dates(progressStarted).map((date, i) => (
                                                        <option 
                                                            key={i} 
                                                            className='ad-f-d-option'
                                                            value={date}
                                                        >{date}</option>
                                                    ))}
                                            </select>
                                        ) : ''}
                                </th>
                                <th className={table === 'Finished' ? 'col-2' : 'hide'}>
                                    {table === 'Finished' ? (
                                            <select 
                                                className='ad-f-dropdown no-outline'
                                                value={selectedCompletedBy}
                                                onChange={e => setSelectedCompletedBy(e.target.value)}
                                            >
                                                <option 
                                                    className='ad-f-d-option first-option'
                                                    value={''}
                                                >Completed By</option>
                                                {staff.map(staff => (
                                                        <option 
                                                            key={staff.id} 
                                                            className='ad-f-d-option'
                                                            value={staff.username}
                                                        >{staff.username}</option>
                                                    ))}
                                            </select>
                                        ) : ''}
                                </th>
                            </tr>
                        </thead>
                        <TableBody 
                            tBody={tableBody}
                            tableName={table}
                            TARGET_PROB_NO={targetProbNo}
                            set_TARGET_PROB_NO={setTargetProbNo}
                            SET_VIEW_INFO_MODAL_KEY={setViewInfoModalKey}
                        />
                    </table>
                    <ViewInfo 
                        viewInfoModal={viewInfoModalKey} 
                        setViewInfoModal={setViewInfoModalKey}
                        probNo={targetProbNo}
                    />
                </div>
            </div>
        </div>
    )
}

function TableBody({
    tBody, 
    tableName,
    set_TARGET_PROB_NO,
    SET_VIEW_INFO_MODAL_KEY
}){

    const openViewInfo = (e) => {
        set_TARGET_PROB_NO(e.currentTarget.getAttribute('name'));
        SET_VIEW_INFO_MODAL_KEY('flex');
    }

    return(
        <tbody className='ad-body'>
            {tBody.map((data, i) => (
                    <tr 
                        key={i}
                        id='ad-b-rows'
                        name={data.prob_no}
                        onClick={openViewInfo}
                    >
                        <td>{data.prob_no}</td>
                        <td>{data.prob_name}</td>
                        <td>
                            {data.cat_id}
                        </td>
                        <td>
                            {data.scat_id}
                        </td>
                        <td>{data.date_created?.split(" ")[0]}</td>
                        <td>{tableName === 'Finished' ? data.finished?.split(" ")[0] : data.progress_started?.split(' ')[0]}</td>
                        <td>{data.solved_by}</td>
                    </tr>
                ))}
        </tbody>
    )
}

export default Admin;