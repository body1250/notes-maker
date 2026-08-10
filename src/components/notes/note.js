import React from 'react'

const note = (props)=>{

    const {title, active, onClicked} = props
    
    return <li className={`note-item ${active && 'active'}`} onClick={onClicked}> {title}</li>
}

export default note