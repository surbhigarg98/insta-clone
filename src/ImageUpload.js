import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { db, storage } from './Firebase'
import firebase from 'firebase'
import './ImageUplaod.css'

function ImageUpload({username}) {
    const[caption,setCaption] = useState('')
    const[progress,setProgress] = useState(0)
    const[image,setImage]=useState(null)

    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload=()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "stateChanged",
            (snapshot)=>{
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100
                );
                setProgress(progress)
            },(error)=>{
                //error function
                console.log(error)
                alert(error.message)
            },()=>{
                //complete function
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    //post data inside db
                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username
                        
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                   
                })
            }
        )
    }
    return (
        <div className="imageUplaod">
            <progress className="imagUplaod__progress"  value={progress} max="100"/>
           <input type="text" className="caption_input" placeholder="Enter a caption..." value={caption} onChange={e=>setCaption(e.target.value)}/>
           <input type ="file" onChange={handleChange} className="file"/>
           <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
