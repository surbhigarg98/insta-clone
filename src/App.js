
import { Avatar, Button, Input } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import { auth, db } from './Firebase';
import Post from './Post';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';  
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts,setPosts] = useState([])
  const [open,setOpen] = useState(false)
  const [openSignIn,setOpenSignIn] = useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword]=useState("")
  const [username,setUsername]=useState("")
  const [user,setUser]= useState(null)
  useEffect(()=>{
 const unsubscribe = auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      //user has logged in
      console.log(authUser)
      setUser(authUser)
    }else{
      //user has logged out
      setUser(null)
    }
  })
  return ()=>{
    unsubscribe();
  }
  },[user,username])

  useEffect(()=>{
   db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot=>{
     //this code will fire whenever our post collection changes
     setPosts(snapshot.docs.map(doc=>({
      id:doc.id,
      post:doc.data()})));
   })
  },[])

  const handleSignUp =(e)=>{
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
     return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message))
    setOpen(false)
  }
  const handleSignIn =(e)=>{
    e.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="App">
     
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
    <div style={modalStyle} className={classes.paper}>
     <form className="form__signup">
     <center>
     <img className="header__img" 
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt=""/> 
     </center>
     <Input className="form__input" type="text" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)}/>

        <Input  className="form__input" type="email" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
      
       <Input  className="form__input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)}/>
       
       <Button onClick={handleSignUp}>Sign Up</Button>
     </form>
     
    </div>        
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
    <div style={modalStyle} className={classes.paper}>
     <form className="form__signup">
     <center>
     <img className="header__img" 
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt=""/> 
     </center>
    
        <Input  className="form__input" type="email" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
      
       <Input  className="form__input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)}/>
       
       <Button onClick={handleSignIn}>Sign In</Button>
     </form>
     
    </div>        
      </Modal>


     <div className="header">
       <img className="header__img" 
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt=""/>
       {user ? (
    <div className="logout__container">
       <Avatar src="/" alt={user?.displayName} className="avatar"/>
     <Button onClick={()=>auth.signOut()}>Log Out</Button>
    </div>
   
 ):(
  <div className="login__container">
  <Button onClick={()=>setOpen(true)}>Sign Up</Button>
  <Button onClick={()=>setOpenSignIn(true)}>Log In</Button>
  </div>
 )}
      </div>
     
        {posts.map(({id,post})=>(
      <Post postId={id} user={user} key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
    ))}


   
     {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>Sorry,You Need To Login To Upload</h3>
      )}
    </div>

  );
}

export default App;
