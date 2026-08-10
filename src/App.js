import React, { useState, useEffect } from 'react'
import './App.css';
import Preview from './components/preview';
import Message from './components/message';
import NotesContainer from './components/notes/notesContainer'
import NotesList from './components/notes/notesList';
import Note from './components/notes/note';
import NoteForm from './components/form'
import Alert from './components/alert';
function App() {
  
  const [notes, setnotes] = useState([])
  const [deletedNotes, setdDeletedNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [trash, setTrash] = useState(false)
  const [validationmessages, setvalidationmessages] = useState([])

    useEffect(()=>{
    if(localStorage.getItem("notes")){
      setnotes(JSON.parse(localStorage.getItem('notes')))
    }else{
      localStorage.setItem('notes',JSON.stringify([]))
    }
  },[])

    useEffect(()=>{
    if(localStorage.getItem("deletedNotes")){
      setdDeletedNotes(JSON.parse(localStorage.getItem('deletedNotes')))
    }else{
      localStorage.setItem('deletedNotes',JSON.stringify([]))
    }
  },[])

  const addToTrash =(value)=>{
    localStorage.setItem('deletedNotes', JSON.stringify(value))
  }

  //add the note to the local storage
  const addToStorage = (value)=>{
    localStorage.setItem('notes', JSON.stringify(value))
  }


  useEffect(()=>{
    if(validationmessages){
      setTimeout(()=>{
        setvalidationmessages([])
      },3000)
    }
  },[validationmessages])


  //عند الضغط على زر الtrash
  const onTrashClicked = ()=>{
    console.log('i have clicked')
    setSelectedNote(null)
    setEditing(false)
    setCreating(false)
    setTrash(!trash)
  }


//حفظ ملاحظة جديده
  const saveNoteHandler = ()=>{

    if (!addValidationMessages()) return
    
    const note = {
      id: `${new Date()}`,
      title: title,
      content: content
    }
    const updateNote = [...notes,note]
    addToStorage(updateNote)
    setnotes(updateNote)
    setCreating(false)
    setSelectedNote(note.id)
    setContent('')
    setTitle('')
  }

  //انشاء صفحة ملاحظه جديده
  const creatingNotePreview =()=>{
    setCreating(true)
    setEditing(false)
    setContent('')
    setTitle('')
  }

  //الانتقال لوضع تعديل الملاحظه
    const editNoteHandler = ()=>{
    const note = notes.find(note=> note.id === selectedNote)
    setEditing(true)
    setContent(note.content)
    setTitle(note.title)
  }

  //لتعديل الملاحظات
  const updateNoteHandler =()=>{
    if (!addValidationMessages()) return

    const updatedNotes = [...notes]
    const noteIndex = notes.findIndex(note => note.id === selectedNote)
    updatedNotes[noteIndex] = {
      id:selectedNote,
      content:content,
      title:title
    }
    addToStorage(updatedNotes)
    setnotes(updatedNotes)
    setEditing(false)
    setContent('')
    setTitle('')
  }

  //حذف ملاحظة
  const deleteNote = ()=> {
    const noteIndex = notes.findIndex(note=>note.id === selectedNote)
    const deletedNote = notes.find(note =>note.id === selectedNote)
    notes.splice(noteIndex,1)
    const updatedDeletedNotes = [...deletedNotes, deletedNote]
    setdDeletedNotes(updatedDeletedNotes)
    addToTrash(updatedDeletedNotes)
    addToStorage(notes)
    setnotes(notes)
    setSelectedNote(null)
  }

  //اختيار العنصر
  const noteClickedHandler = (noteid) =>{
    setSelectedNote(noteid)
    console.log(noteid)
  }

  
  const getAddNote = () => {
    return (
      <div>
        <h2>إضافة ملاحظة جديدة</h2>
        <NoteForm content={content} setTitle={setTitle} setContent={setContent} title={title} text="حفظ" func={saveNoteHandler}/>
      </div>
    );
  };

  const addValidationMessages = ()=>{
    const validationMessages =[]
    let passed = true
    if (!title){
      validationMessages.push("الرجاء ادخال عنوان الملاحظة")
      passed = false
    }
    if (!content){
      validationMessages.push("الرجاء ادخال محتوى الملاحظة")
      passed = false
    }
    setvalidationmessages(validationMessages)
    return passed

  }

  const getPreview = () => {
    if ((trash?deletedNotes:notes).length === 0){
      return <Message title="لا يوجد ملاحظات"/>
    }
    if (!selectedNote) {
      return <Message title="الرجاء اختيار ملاحظة"/>
    }
    
    const note = (trash?deletedNotes:notes).find(note =>{
      return note.id === selectedNote
    })
    
    let noteDisplay =(
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )
    
    if (editing){
      noteDisplay = (
      <div>
        <h2>تعديل الملاحظه</h2>
          <NoteForm content={content} setTitle={setTitle} setContent={setContent} title={title} text="تعديل" func={updateNoteHandler}/>

      </div>
      )
    }
    return (
      <div>
        {!editing && (!trash) && <div className="note-operations" >

          <a href="#" onClick={editNoteHandler}>
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#" onClick={deleteNote}>
            <i className="fa fa-times" />
          </a>
        </div>
        }

        {noteDisplay}

      </div>
    );
  };

  
  
  return (
    <div className="App">
      <NotesContainer trashClicked={()=>onTrashClicked()} trash={trash}>
        <NotesList>
          {(trash? deletedNotes : notes).map(note => (
            <Note 
              key={note.id}
              title={note.title}
              onClicked={() => noteClickedHandler(note.id)}
              active={selectedNote===note.id} />))}
        </NotesList>
       
        {(!trash) && <button className="add-btn" onClick={creatingNotePreview}>+</button>}
      </NotesContainer>
      <Preview className="preview-section">{creating? getAddNote():getPreview()}</Preview>
      {validationmessages.length !== 0 && <Alert validationMessage={validationmessages}/>}
    </div>
  );
}

export default App;
