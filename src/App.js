import './sass/App.scss';

// app
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from './store/actions';
import { Outlet } from "react-router";
import { colours, grids, walks } from './constants/constants';

// firebase
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { firebaseConfigs } from './firebase/firebase';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Alert, Modal, Button } from "react-bootstrap";

// preload agrandir
const body = document.getElementsByTagName('body')[0];
const div = document.createElement('div');
body.append(div);
div.className = "preload-agrandir";
div.innerHTML = "preload agrandir"
setTimeout(()=>{
  div.remove();
}, 0)

function App(props) {

  const [app, setApp] = useState();
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(null);
  const [posts, setPosts] =  useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalPromise, setModalPromise] = useState(null);
  const [modalContents, setModalContents] = useState({});

  const lastGridIndex = useRef(0);

  // modal

  const modalEscape = () => {
    setShowModal(false);
  }

  const modalReject = () => {
    setShowModal(false);
  }

  const modalResolve = () => {
    modalPromise?.callback && modalPromise.callback();
    setShowModal(false);
  }

  useEffect(() => {
    const app = firebaseConfigs.find(config=>config.name==="lib-app");
    setApp(initializeApp(app.config, app.name));
    props.onInitApp({
      type: actionTypes.INIT_APP,
      appKey: app.config.apiKey
    });
  }, [props])

  useEffect(() => {
    if(!app) return;
    const auth = getAuth(app);
    setAuth(auth);
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      // if (user) {
      //   setUser(user);
      // } else {
      //   setUser(user);
      // }
    });
    let unsubscribe = onSnapshot(collection(getFirestore(app), "posts"), (snapshot)=>{
      const posts = snapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
      setPosts(posts);
    })
    return () => {
      unsubscribe();
    }
  }, [app])

  const deletePost = async (id) => {
    await deleteDoc(doc(getFirestore(app), "posts", id));
  }

  const updateFavourite = async (id, flag) => {
    await updateDoc(doc(getFirestore(app), "posts", id), {
      favourite: flag
    });
  }

  const savePost = async (data) => {
    await addDoc(collection(getFirestore(app), "posts"), {
      message: data.message,
      font: data.font,
      shape: data.shape,
      textColour: data.textColour,
      backgroundColour: data.backgroundColour,
      borderColour: data.borderColour,
      created: new Date(),
      favourite: false
    });
  }

  const adjAlert = props.showAlert ? {marginTop: "4rem"} : null;

  const getGridIndex = (grids, lastStep, lastGridIndex) => {
    let gridIndex = 0;
    if(lastStep){
      for(let g = 0; g < grids.length; g++){
        
        if((lastStep.row < (grids[g].row + grids[g].height))
          && (lastStep.row >= (grids[g].row))
          && (lastStep.column < (grids[g].column + grids[g].width))
          && (lastStep.column >= (grids[g].column))){
            gridIndex = Math.max(g, lastGridIndex.current);
            if(lastGridIndex.current < gridIndex) {
              lastGridIndex.current = gridIndex;
            }
            break;
        }
      }
    }

    return gridIndex;
  }

  const grid = getGridIndex(grids, walks[0][posts.length - 1], lastGridIndex);

  return (
    <div className="h-100" style={adjAlert}>

      <Outlet context={[posts, deletePost, savePost, updateFavourite, setShowModal, setModalContents, setModalPromise, props.onAlert, auth, grid]}></Outlet>
      
      <Modal dialogClassName={modalContents.customClass} centered show={showModal} onHide={modalEscape}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContents.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContents.body}</Modal.Body>
        <Modal.Footer>
          { modalContents.reject && <Button variant="secondary" onClick={modalReject}>
            {modalContents.reject}
          </Button>}
          <Button variant="primary" onClick={modalResolve}>
            {modalContents.resolve}
          </Button>
        </Modal.Footer>
      </Modal>

      <Alert className="alert--root" dismissible onClose={props.onDismissAlert} show={props.showAlert} key={`alert-${props.alertVariant}`} variant={props.alertVariant}>
        {props.alertContents}
      </Alert>

    </div>
  )
}

const mapStateToProps = state => {
  return {
    showAlert: state.showAlert,
    alertVariant: state.alertVariant,
    alertContents: state.alertContents,
    appKey: state.appKey
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAlert: (action) => dispatch(action),
    onInitApp: (action) => dispatch(action),
    onDismissAlert: (action) => dispatch({type: actionTypes.DISMISS_ALERT})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
