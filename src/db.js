import {useState, useEffect} from 'react'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

function useDB(room) {
    const [messages, setMessages] = useState([])
    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> b.ts.seconds - a.ts.seconds)
            return msgs
        })
    }
    function remove(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }
    useEffect(() => {
        store.collection(coll)
        .where('room','==',room)
        .onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [])
    return messages
}

const db = {}
db.send = function(msg) {
    return store.collection(coll).add(msg)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
}

export { db, useDB }

const firebaseConfig = {
    apiKey: "AIzaSyA4vGJOmlkjvn7F7WvuczzcC16pihZkol0",
    authDomain: "chatter2020-bf8ab.firebaseapp.com",
    databaseURL: "https://chatter2020-bf8ab.firebaseio.com",
    projectId: "chatter2020-bf8ab",
    storageBucket: "chatter2020-bf8ab.appspot.com",
    messagingSenderId: "92326588346",
    appId: "1:92326588346:web:9d884cf965b7dc7b63f783",
    measurementId: "G-YM8PQZV0JZ"
  };

firebase.initializeApp(firebaseConfig)
store = firebase.firestore()