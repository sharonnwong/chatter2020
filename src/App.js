import React, {useState, useEffect} from 'react';
import './App.css';
import {db, useDB} from './db'
import NamePicker from './namePicker'
import { BrowserRouter, Route } from 'react-router-dom'

function App() {
  useEffect(()=>{
    const {pathname} = window.location
    if(pathname.length<2) window.location.pathname='home'
  })
  return <BrowserRouter>
    <Route path="/:room" component={Room}/>
  </BrowserRouter>
}

function Room(props) {
  /*const [messages, setMessages] = useState([])*/ /* const [variable, function to change the variable], useState([]) it's initial value, so it's an empty array*/ 
  const {room} = props.match.params
  const [name,setName] = useState("")
  const messages = useDB(room)

  return <main>
    <header> 
      <div style={{display:'flex',alignItems:'center'}}>
        <img 
          alt="icon"
          src="https://upload.wikimedia.org/wikipedia/en/e/e0/WPVG_icon_2016.svg"/>
        Chatter 
      </div>
      
      <NamePicker onSave={setName}/>
    </header>

    <div className="messages" /* we want to make a scrollable block */> 
    {messages.map((m,i)=>{ /* map is a built in function that allows you to loop through the array*/
      return <div key={i} className="messages-wrap" from={m.name===name?'me':'you'}>
        <div className="msg">
          <div className="msg-name">{m.name}</div>
          <div className="msg-text">{m.text}</div>
        </div>
      </div>
    })}
    </div>

    <TextInput onSend={(text)=> {
      db.send({
        text, name, ts: new Date(), room
      })
    }}/>
  </main>
}

function TextInput(props) {
  const [text, setText] = useState('') /* empty string as initial state, setText as a function to set the text*/ 
  return <div className="text-input-wrap">
    <input className="text-input"
      value={text}
      placeholder = "Write your message"
      onChange = {e=> setText(e.target.value)}
    />
    <button className="button"
      onClick={()=> {
      if(text) props.onSend(text) /* 'text' is like the parameters sent to the function onSend, which shows as 'm'*/
      setText('')
    }}> <img alt="send" src="https://upload.wikimedia.org/wikipedia/commons/6/61/Black_Up_Arrow.png"/> </button>
  </div>
}

export default App;
