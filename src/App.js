import React, {useState, useEffect} from 'react'
import './App.css'
import './media.css'
import {db, useDB} from './db'
import NamePicker from './namePicker'
import { BrowserRouter, Route } from 'react-router-dom'
import Camera from 'react-snap-pic'
import {FiCamera} from 'react-icons/fi'
import * as firebase from "firebase/app"
import "firebase/storage"
import Div100vh from 'react-div-100vh'


function App(){
  useEffect(()=>{
    const {pathname} = window.location
    if(pathname.length<2) window.location.pathname='home'
  }, [])
  return <BrowserRouter>
    <Route path="/:room" component={Room} />
  </BrowserRouter>
}

function Room(props) {
  /*const [messages, setMessages] = useState([])*/ /* const [variable, function to change the variable], useState([]) it's initial value, so it's an empty array*/ 
  const {room} = props.match.params
  const [name,setName] = useState("")
  const messages = useDB(room)
  const [showCamera, setShowCamera] = useState(false)

  async function takePicture(img) {
    setShowCamera(false)
    const imgID = Math.random().toString(36).substring(7)
    var storageRef = firebase.storage().ref()
    var ref = storageRef.child(imgID + '.jpg')
    await ref.putString(img, 'data_url')
    db.send({ 
      img: imgID, name, ts: new Date(), room 
    })
  }

  return <main>
    {showCamera && <Camera takePicture={takePicture} />}
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
      {messages.map((m,i)=> <Message key={i} m={m} name={name}/>)}
    </div>

    <TextInput 
      showCamera={()=>setShowCamera(true)}
      onSend={(text)=> {
        db.send({
          text, name, ts: new Date(), room
        })
      }}
    />
  </main>
}

const bucket = 'https://firebasestorage.googleapis.com/v0/b/chatter2020-bf8ab.appspot.com/o/'
const suffix = '.jpg?alt=media'

function Message({m, name}){
  return <div className="messages-wrap" 
    from={m.name===name?'me':'you'} 
    onClick={()=>console.log(m)}>
    <div className="msg">
      <div className="msg-name">{m.name}</div>
      <div className="msg-text">
        {m.text}
        {m.img && <img src={bucket + m.img + suffix} alt="pic" />}
      </div>         
    </div>
  </div>
}

function TextInput(props) {
  var [text, setText] = useState('') /* empty string as initial state, setText as a function to set the text*/ 
  
  return <div className="text-input-wrap">
    <button onClick={props.showCamera} className="camera">
      <FiCamera className="camera-img" />
    </button>
    <input className="text-input"
      value={text}
      placeholder = "Write your message"
      onChange = {e=> setText(e.target.value)}
      onKeyPress={e=> {
        if(e.key==='Enter') {
          if(text) props.onSend(text)
          setText('')
        }
      }}
    />
    <button className="button"
      disabled={!text}
      onClick={()=> {
      if(text) props.onSend(text) /* 'text' is like the parameters sent to the function onSend, which shows as 'm'*/
      setText('')
    }}> <img alt="send" src="https://upload.wikimedia.org/wikipedia/commons/6/61/Black_Up_Arrow.png"/> </button>
  </div>
}

export default App;