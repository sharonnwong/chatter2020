import React, {useState} from 'react';

import './App.css';

function App() {
  return <main>
    <header> 
      <img 
        alt="icon"
        src="https://upload.wikimedia.org/wikipedia/en/e/e0/WPVG_icon_2016.svg"/>
      Chatter 
    </header>

    <TextInput onSend={t=> console.log(t)}/>

    {/*<Hi a={1} b={'2'} />*/}
  </main>
}

function TextInput(props) {
  const [text, setText] = useState('')
  return <div className="text-input-wrap">
    <input className="text-input"
      value={text}
      placeholder = "Write your message"
      onChange = {e=> setText(e.target.value)}
    />
    <button className="button"
      onClick={()=> 
      {props.onSend(text) 
      setText('')
    }}> <img alt="send" src="https://upload.wikimedia.org/wikipedia/commons/6/61/Black_Up_Arrow.png"/> </button>
  </div>
}

export default App;
