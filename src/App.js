import './sass/App.scss';

// app
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from './store/actions';
import { Outlet } from "react-router";
import { colours, grids, Internal, Server } from './constants/constants';

// firebase
import { getFirestore, getDocs, writeBatch, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
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
  const [adminPosts, setAdminPosts] =  useState([]);
  const [wallPosts, setWallPosts] =  useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalPromise, setModalPromise] = useState(null);
  const [modalContents, setModalContents] = useState({});
  const [confirmation, setConfirmation] = useState(false);
  const [server, setServer] = useState(Server.DEVELOPMENT);
  const [settingsId, setSettingsId] = useState();

  const [minGrid, setMinGrid] = useState(0);
  const [maxGrid, setMaxGrid] = useState(4);
  const [wallTimeout, setWallTimeout] = useState(30);
  const [appTimeout, setAppTimeout] = useState(15);

  // const [wakeWall, setWakeWall] = useState(false);

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
    const app = firebaseConfigs.find(config=>config.name===server);
    setApp(initializeApp(app.config, app.name));
    setSettingsId(app.settingsId);
    props.onInitApp({
      type: actionTypes.INIT_APP,
      appKey: app.config.apiKey
    });
  }, [props, server])

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
      // for admin
      const posts = snapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
      setAdminPosts(posts);
      // for wall
      let sorted = posts.sort((a, b) => (a.created.seconds > b.created.seconds) ? 1 : -1);
      const threshold = grids[maxGrid].threshold// threshold is always length of the walk but the walk can't exceed the grid
      const chunked = sorted.map((e, i) => i % threshold ? null : sorted.slice(i, i + threshold))
        .filter(e => e)
        .pop() || [];
      setWallPosts(chunked);
    })
    return () => {
      unsubscribe();
    }
  }, [app, maxGrid, grids])

  useEffect(()=>{
    if(!app) return;
    // clearMessage();
    let unsubscribe = onSnapshot(collection(getFirestore(app), "settings"), (snapshot)=>{
      // for admin
      const settings = snapshot.docs.map((doc) => ({...doc.data(), id: "srGzLoFqUc3ifsS1oh98" }))[0];
      setMinGrid(settings.gridMin);
      setMaxGrid(settings.gridMax);
      setWallTimeout(settings.wallTimeout);
      setAppTimeout(settings.appTimeout);
      // if(!wakeWall && settings.internal === Internal.WAKE_WALL){
      //   setWakeWall(true);
      //   clearMessage();
      // }
    })
    return () => {
      unsubscribe();
    }
  }, [app/*, minGrid, maxGrid*/])

  // const clearMessage = async () => {
  //   await updateDoc(doc(getFirestore(app), "settings", settingsId), {
  //     internal: Internal.NONE
  //   })
  // }

  const deletePost = async (id) => {
    await deleteDoc(doc(getFirestore(app), "posts", id));
  }

  const deleteAllPosts = async () => {
    const batch = writeBatch(getFirestore(app));
    const querySnapshot = await getDocs(collection(getFirestore(app), "posts"));
    querySnapshot.forEach((post) => {
      batch.delete(doc(getFirestore(app), "posts", post.id));
    });
    await batch.commit().then(()=>{
    });
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
    }).then(()=>{
      setConfirmation(true);
    })
  }

  const initSettings = async () => {
    await updateDoc(doc(getFirestore(app), "settings", settingsId), {
      gridMin: 0,
      gridMax: 4,
      wallTimeout: 30,
      appTimeout: 15
    })
  }

  const updateSettings = async (data) => {
    await updateDoc(doc(getFirestore(app), "settings", settingsId), {
      gridMin: minGrid,
      gridMax: maxGrid,
      ...data
    })
  }

  const adjAlert = props.showAlert ? {marginTop: "4rem"} : null;

  return (
    <div className="h-100" style={adjAlert}>

      <Outlet context={[
        wallPosts,
        adminPosts,
        deletePost,
        savePost,
        updateFavourite,
        setShowModal,
        setModalContents,
        setModalPromise,
        props.onAlert,
        auth,
        confirmation,
        setConfirmation,
        minGrid,
        maxGrid,
        updateSettings,
        server,
        setServer,
        wallTimeout,
        appTimeout,
        deleteAllPosts,
        app,
        settingsId
      ]}></Outlet>
      
      <Modal dialogClassName={modalContents.customClass} centered show={showModal} onHide={modalEscape}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContents.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContents.body}</Modal.Body>
        <Modal.Footer>
          { modalContents.reject && <Button variant="secondary" onClick={modalReject}>
            {modalContents.reject}
          </Button>}
          { modalContents.customButton ? <div onClick={modalResolve}>{modalContents.customButton}</div> : 
            <Button variant="primary" onClick={modalResolve}>
              {modalContents.resolve}
            </Button>
          }
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
    appKey: state.appKey,
    app: state.app,
    settingsId: state.settingsId
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
