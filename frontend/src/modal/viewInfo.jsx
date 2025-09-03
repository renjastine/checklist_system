import React, { useEffect, useState } from 'react'
import Cancel from '../css/icons/cancel.svg';
import axios from 'axios';

function ViewInfo({
    viewInfoModal,
    setViewInfoModal,
    probNo
}) {
    function turnOffModal() {
        setViewInfoModal('none');
    }

    const [probDetails, setProbDetails] = useState([]);

    useEffect(() => {
        axios.post('http://localhost:5000/get_prob_info', {probNo})
        .then(res => setProbDetails(res.data))
        .catch(err => console.log(err));
    }, [probNo])
    

  return (
    <>
        {probDetails.map(data => (
            <div key={data.prob_no} className='view-info-modal flex-c' style={{display: viewInfoModal}}>
                <div className='vim-content flex-c'>
                    <div className='close' onClick={turnOffModal}>
                        <img className='close-icon' src={Cancel} />
                    </div>
                    <h1 className='vim-c-header'>{data.prob_name}</h1>
                    <div className="vim-c-box flex-r">
                        <div className='vim-c-box-1 half flex-c'>
                            <p>Status: {data.status}</p>
                            <p>Category: {data.cat_id}</p>
                            <p>Sub-Category: {data.scat_id}</p>
                        </div>
                        <div className='vim-c-box-2 half flex-c'>
                            <p>Date Created: {data.date_created}</p>
                            <p>{data.progress_started? "Progress Started: " + data.progress_started : ''}</p>
                            <p>{data.finished? "Finished: " + data.finished : ''}</p>
                        </div>
                    </div>
                    <div className="vim-c-desc flex-c">
                        <p className='vim-c-d-header'>Description</p>
                        <textarea className='vim-c-d-textarea' value={data.description} readOnly></textarea>
                    </div>
                    <p className='vim-c-name'>{data.finished? 'Completed by: ' + data.solved_by : data.progress_started? 'Taken by: ' + data.taken_by : 'Created by: ' + data.author}</p>
                </div>
            </div>
        ))}
    </>
  )
}

export default ViewInfo;