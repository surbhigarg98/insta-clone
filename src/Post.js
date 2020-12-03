import { Avatar, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { db } from './Firebase'
import "./Post.css"
import firebase from "firebase"
function Post({user,postId,username,imageUrl,caption}) {
    const [comments,setCommnets]=useState([])
    const [comment,setComment]=useState("")

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot)=>{
                setCommnets(snapshot.docs.map((doc)=>(doc.data())))
            })
        }
        return()=>{
            unsubscribe();
        }
    },[postId])
    const handleComment = (e)=>{
        e.preventDefault()
        db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");

    }
    return (
        <div className="post">
         <div className="post_header">
            <Avatar src="/" alt={username} className="post_avatar"/>
            <h3>{username}</h3> 
             </div>      
        <img className="post_image" src={imageUrl}/>
        <h4 className="post_caption"><strong>{username} </strong>{caption}</h4>    
        <div className="post_comments">
            {comments.map((comment)=>(
                <p><strong>{comment.username} </strong> {comment.text}</p>
            ))}
        </div>
      {user && (
            <form className="post__form">
            <input type="text" placeholder="Enter a comment..." className="post__input" value={comment} onChange={e=>setComment(e.target.value)}/>
            <button className="post__button" onClick={handleComment} type="submit">Post</button>
            </form>  
      )}
        </div>
    )
}

export default Post
