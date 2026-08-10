import React from 'react'

const NoteForm = (props)=> {
    const {text,func,title,content,setTitle ,setContent} = props
    return(
        <form>
            <input
            type="text"
            name="title"
            className="form-input mb-30"
            placeholder="العنوان"
            value={title}
            //لتغيير القيمة التي تظهر على الشاشه
            onChange={(e) => {setTitle(e.target.value)}}
            />
        
            <textarea
            rows="10"
            name="content"
            className="form-input"
            placeholder="النص"
            value={content}
            //لتغيير القيمة التي تظهر على الشاشه
            onChange={(e) => {setContent(e.target.value)}}
            />
            
            <a onClick={props.func} href="#" className="button green">
            {props.text}
            </a>
        </form>
    )
}

export default NoteForm