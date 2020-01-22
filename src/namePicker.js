import React, {useState, useRef, useEffect} from 'react';
import { FiEdit, FiSave } from "react-icons/fi"; /*fi is like the first two letters of FiEdit, plz find it on React icon library online */

function NamePicker(props){
    const [name, setName] = useState("")
    const [showName, setShowName] = useState(false)
    const inputEl = useRef(null)

    function save(){
        inputEl.current.focus()
        if(name && !showName) {
            props.onSave(name)
            localStorage.setItem('name',name)   

        }
        setShowName(!showName)

    }

    useEffect(()=>{
        const n = localStorage.getItem('name')
        if(n) {
            setName(n)
            save()
        }
    },[])

    return <div>
    <input 
        value={name} 
        ref={inputEl}
        style = {{ display: showName ? 'none':'flex'}}
        onChange = {e=> setName(e.target.value)}
        onKeyPress = {e=> {
            if(e.key==='Enter') save() /*Save the user name */
        }}
    />

    {showName && <div>{name}</div>}

    <button 
        onClick={save}>
        {showName ? <FiEdit /> : <FiSave /> /* ? is if, and : is else. If showname is true, show FiEdit; otherwise show FiSave */} 
    </button>

    </div>
}

export default NamePicker