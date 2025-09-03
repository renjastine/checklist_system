import Navigator from './navigator';
import React, { useEffect, useRef, useState } from 'react';
import Send from '../css/icons/send.svg';
import axios from 'axios';


function Chatbot() {

    const botCommands = 'These are the available commands:\n\nshow cmd - Display a list of available commands.\nshow available - Show all the titles of pending tasks.\nshow current - Display the titles of tasks you are currently working on.\nfind => task title - Find and show the location of a specific task by its title.';
    const [messages, setMessages] = useState([{ sender: 'Bot', input: "Hello! How may I assist you today?\n" + botCommands }]);
    const [userInput, setUserInput] = useState('');
    const chatContainer = useRef(null);
    const userToken = localStorage.getItem('user');

    const [pending, setPending] = useState([]);
    const [current, setCurrent] = useState([]);
    const [searchArray, setSearchArray] = useState([]);

    const send_MESSAGE = async (e) => {
        e.preventDefault();

        if (userInput.trim() === "") return;

        const userMessage = { sender: userToken, input: userInput };
        setMessages([...messages, userMessage])

        const botResponse = { sender: 'Bot', input: await fromBot(userInput) };

        setTimeout(() => {
            setMessages((prev) => [...prev, botResponse]);
        }, 500);

        setUserInput('');
    }

    const fromBot = async (usrMsg) => {
        const splitMessages = usrMsg.split(" ");
        if (splitMessages[0]?.toLowerCase() === 'hello') return "Hello! How may I assist you today?";
        if (splitMessages[0]?.toLowerCase() === 'show' && splitMessages[1]?.toLowerCase() === 'cmd') return botCommands;
        if (splitMessages[0]?.toLowerCase() === 'show' && splitMessages[1]?.toLowerCase() === 'available') return allPending();
        if (splitMessages[0]?.toLowerCase() === 'show' && splitMessages[1]?.toLowerCase() === 'current') return allCurrent();
        if (splitMessages[0]?.toLowerCase() === 'show') return "What do you want me to show you?\n=> show cmd?\n=> show available?\n=> show current?";
        if (splitMessages[0]?.toLowerCase() === 'find' && splitMessages[1]) return await findTitle(splitMessages[1]);
        if (splitMessages[0]?.toLowerCase() === 'find') return "What do you want me to find?";

        return "Sorry, I didn't recognize that command. Please try again or type {show cmd} to see a list of available commands.";
    }

    const allPending = () => {
        let listOfPending = "AVAILABLE TASKS (" + pending.length + ")\n";
        pending.map(data => listOfPending += "=> [" + data.prob_name + "]\n");
        return listOfPending;
    }

    const allCurrent = () => {
        let listOfCurrent = "YOUR ONGOING TASKS (" + current.length + ")\n";
        current.map(data => listOfCurrent += "[" + data.prob_name + "]\n=>" + data.description + "\n\n");
        return listOfCurrent;
    }

    const findTitle = async (splitMsg) => {
        const search = userInput.split("=>")[1]?.trim('');
        if (!search) return "Expected '=>' between 'find' and '" + splitMsg + "'\nCorrect Format: find => " + splitMsg;
        const searchTitle = "%" + search + "%";

        const res = await axios.post('http://localhost:5000/search_title', { searchTitle })
        let listOfResult = "FOUND (" + res.data.length + ")";
        res.data.map(data => listOfResult += "\n\n[" + data.prob_name + "] " + data.cat_id + " > " + data.scat_id + "");
        return listOfResult;
    }

    useEffect(() => {
        axios.get('http://localhost:5000/get_pendings')
            .then(res => setPending(res.data))
            .catch(err => console.log(err));

        axios.post('http://localhost:5000/get_current', { userToken })
            .then(res => setCurrent(res.data))
            .catch(err => console.log(err));
    }, [])


    useEffect(() => {
        if (chatContainer.current) {
            chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='chatbot-content flex-r'>
            <Navigator />
            <div
                className='c-chatbot'
            >
                <div className='c-cb-header'>
                    <p className=''>Chatbot</p>
                </div>
                <div className='wr-ch'>
                    <div
                        className='ch'
                        ref={chatContainer}
                    >
                        {messages.map((data, i) => (
                            <div key={i} className={data?.sender === 'Bot' ? 'usr-b' : 'usr-st'}>
                                <div className={data?.sender === 'Bot' ? 'ch-box' : 'ch-box-usr'}>
                                    <div className='usn'>{data?.sender === 'Bot' ? 'Ren' : data.sender}</div>
                                    <div className='msg'>
                                        {data?.input}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <form onSubmit={send_MESSAGE}>
                    <div className='ch-txt'>
                        <input
                            placeholder='Aa'
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            className='text'
                        />
                        <img className='s-b-send' onClick={send_MESSAGE} src={Send} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Chatbot;