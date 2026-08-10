import React from 'react'

const NotesContainer = (props)=> (
    <div className='notes-section'>
        {props.children}
         <a onClick={props.trashClicked}>
            <i className={`trash fa ${props.trash?"fa-arrow-alt-circle-left":"fa-trash"} `} />
        </a>
    </div>
    
)

export default NotesContainer