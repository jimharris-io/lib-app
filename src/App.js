import "./sass/App.scss";

// app
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actionTypes from "./store/actions";
import { Server } from "./constants/constants";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components
import Wall from "./components/wall/Wall";
import PostingApp from "./components/posting/PostingApp";
import Admin from "./components/admin/Admin";
import Location from "./components/admin/Location";
import Node from "./components/admin/Node";
import Version from "./components/admin/Version";
import PageNotFound from "./components/admin/PageNotFound";

// firebase
import { firebaseConfigs } from "./firebase/firebase";
import { initializeApp } from "firebase/app";

// bootstrap
import { Modal, Button, Spinner } from "react-bootstrap";

// preload agrandir
const body = document.getElementsByTagName("body")[0];
const div = document.createElement("div");
body.append(div);
div.className = "preload-agrandir";
div.innerHTML = "preload agrandir";
setTimeout(() => {
  div.remove();
}, 0);

function App(props) {

  const [app, setApp] = useState();
  const [server, setServer] = useState(Server.PRODUCTION);

  // modal

  const modalEscape = () => {
    props.onCloseModal({
      type: actionTypes.CLOSE_MODAL
    });
  };

  const modalReject = () => {
    props.onCloseModal({
      type: actionTypes.CLOSE_MODAL
    });
  };

  const modalResolve = () => {
    props.modalResolve?.callback && props.modalResolve.callback();
    props.onCloseModal({
      type: actionTypes.CLOSE_MODAL
    });
  };

  useEffect(() => {
    const app = firebaseConfigs.find((config) => config.name === server);
    setApp(initializeApp(app.config, app.name));
  }, [props, server]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PostingApp server={server} app={app} />,
    },
    {
      path: "wall",
      element: <Wall app={app} />,
    },
    {
      path: "admin",
      element: <Admin app={app} server={server} setServer={setServer} />,
    },
    {
      path: "admin/:option",
      element: <Admin app={app} server={server} setServer={setServer} />,
    },
    {
      path: "post",
      element: <PostingApp server={server} app={app} />,
    },
    {
      path: "post/:option",
      element: <PostingApp server={server} app={app} />,
    },
    {
      path: "node",
      element: <Node app={app} />,
    },
    {
      path: "*",
      element: <PageNotFound/>
    }
  ]);

  return (
    <div className="h-100">

      {/* routes */}
      <RouterProvider router={router} />

      {/* modal */}
      <Modal dialogClassName={props.modalContents.customClass} centered show={props.showModal} onHide={modalEscape}>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalContents.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.modalContents.body}</Modal.Body>
        <Modal.Footer>
          {props.modalContents.reject && (
            <Button variant="secondary" onClick={modalReject}>{props.modalContents.reject}</Button>
          )}
          {props.modalContents.customButton ? (
            <div onClick={modalResolve}>{props.modalContents.customButton}</div>
          ) : (
            <Button variant="primary" onClick={modalResolve}>{props.modalContents.resolve}</Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* spinner */}
      <Spinner className={`${props.loading ? 'show-loading':'hide-loading'}`} animation="border" />

      {/* version */}
      <Version server={server}/>

    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    showModal: state.showModal,
    modalContents: state.modalContents,
    modalResolve: state.modalResolve
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onShowLoading: (action) => dispatch(action),
    onHideLoading: (action) => dispatch(action),
    onOpenModal: (action) => dispatch(action),
    onCloseModal: (action) => dispatch(action)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
