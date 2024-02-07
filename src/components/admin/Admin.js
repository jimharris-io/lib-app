// components
import Post from "../wall/Post";
import AdminItem from "./AdminItem";
import { PersonCircle, DatabaseX, DatabaseDown, EmojiSmile, SortAlphaDown, SortAlphaUp, SortNumericUp, SortNumericDown, Heart, HeartFill } from 'react-bootstrap-icons';
import LibraryOn from "../campaign/LibraryOn";
import Everyones from "../campaign/Everyones";
import Test from "./Test";

// app
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCallback, useRef } from "react";
import { connect } from "react-redux";
import * as actionTypes from "./../../store/actions";
import { Server, SortOrder, SortBy, pagelength, Internal } from './../../constants/constants';
import { toPng } from 'html-to-image'

// firebase
import { addDoc, query, limit, orderBy, getFirestore, getDocs, writeBatch, collection, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { signOut, signInWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";

// bootstrap
import { Button, Form, FormGroup, Container, Row, Col, Card, Stack, Pagination } from "react-bootstrap";

const Admin = (props) => {

    const [dateSortOrder, setDateSortOrder] = useState(SortOrder.ASCENDING);
    const [nameSortOrder, setNameSortOrder] = useState(SortOrder.ASCENDING);
    const [sortBy, setSortBy] = useState(SortBy.NAME);
    const [page, setPage] = useState(0);
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [error, setError ] = useState('');

    const [minGrid, setMinGrid] = useState(0);
    const [maxGrid, setMaxGrid] = useState(3);
    const [wallTimeout, setWallTimeout] = useState(30);
    const [appTimeout, setAppTimeout] = useState(15);
    const [videoTimeout, setVideoTimeout] = useState(5);

    const [, setUser] = useState(null);
    const [auth, setAuth] = useState(null);
    const [posts, setPosts] =  useState([]);

    const params = useParams();

    // posts // QUERY
    useEffect(() => {
        if(!props.app) return;

        const auth = getAuth(props.app);
        setAuth(auth);
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        const colRef = collection(getFirestore(props.app), "posts");
        const indexQuery = query(colRef, orderBy('created', 'desc')/*, limit(1000)*/)
       
        let unsubscribe = onSnapshot(indexQuery, (snapshot)=>{
            const posts = snapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
            setPosts(posts);
        }, (err) => {
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "listening to posts",
                error: err
            })
        })
        return () => {
            unsubscribe();
        }
    }, [props.app])

    // settings
    useEffect(()=>{
        if(!props.app) return;
        let unsubscribe = onSnapshot(collection(getFirestore(props.app), "settings"), (snapshot)=>{
            const settings = snapshot.docs.map((doc) => ({...doc.data(), id: props.app.options.settingsId }))[0];
            setMinGrid(settings.gridMin);
            setMaxGrid(settings.gridMax);
            setWallTimeout(settings.wallTimeout);
            setAppTimeout(settings.appTimeout);
            setVideoTimeout(settings.videoTimeout);
            
        }, (err) => {
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "listening to settings",
                error: err
            })
        })
        return () => {
            unsubscribe();
        }
    }, [props.app])

    // actions

    const save = async (data) => {
        props.onShowLoading({type: actionTypes.SHOW_LOADING});
        await addDoc(collection(getFirestore(props.app), "posts"), data).then(()=>{
        }).catch((err)=>{
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "saving post",
                error: err
            })
        }).finally(()=>{
            props.onHideLoading({type: actionTypes.HIDE_LOADING});
        })
    }

    const deletePost = async (id) => {
        props.onShowLoading({type: actionTypes.SHOW_LOADING});
        await deleteDoc(doc(getFirestore(props.app), "posts", id))
            .then((res)=>{
                //
            }).catch((err)=>{
                props.onErrorMessage({
                    type: actionTypes.ERROR_MESSAGE,
                    title: "deleting post",
                    error: err
                })
            }).finally(()=>{
                props.onHideLoading({type: actionTypes.HIDE_LOADING});
            })
    }

    const deleteAllPosts = async () => {
        props.onShowLoading({type: actionTypes.SHOW_LOADING});
        const batch = writeBatch(getFirestore(props.app));
        const querySnapshot = await getDocs(collection(getFirestore(props.app), "posts"));
        querySnapshot.forEach((post) => {
            batch.delete(doc(getFirestore(props.app), "posts", post.id));
        });
        await batch.commit()
            .then((res)=>{
                setPage(0);
            }).catch((err)=>{
                props.onErrorMessage({
                    type: actionTypes.ERROR_MESSAGE,
                    title: "deleting all posts",
                    error: err
                })
            }).finally(()=>{
                props.onHideLoading({type: actionTypes.HIDE_LOADING});
            })
    }

    const updateFavourite = async (id, flag) => {
        props.onShowLoading({type: actionTypes.SHOW_LOADING});
        await updateDoc(doc(getFirestore(props.app), "posts", id), {
            favourite: flag
        }).then(()=>{
            //
        }).catch((err)=>{
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "updating favourite",
                error: err
            })
        }).finally(()=>{
            props.onHideLoading({type: actionTypes.HIDE_LOADING});
        });
    }

    const changeWallRange = (e) => {
        updateSettings({
            wallTimeout: parseInt(e.target.value)
        })
    }

    const changeAppRange = (e) => {
        updateSettings({
            appTimeout: parseInt(e.target.value)
        })
    }

    const changeVideoRange = (e) => {
        updateSettings({
            videoTimeout: parseInt(e.target.value)
        })
    }

    const updateSettings = async (data) => {
        props.onShowLoading({type: actionTypes.SHOW_LOADING});
        await updateDoc(doc(getFirestore(props.app), "settings", props.app.options.settingsId), {
            gridMin: minGrid,
            gridMax: maxGrid,
            ...data
        }).then(()=>{
            
        }).catch((err)=>{
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "updating settings",
                error: err
            })
        }).finally(()=>{
            props.onHideLoading({type: actionTypes.HIDE_LOADING});
        })
    }

    const ref = useRef(null);

    const changeEmail = (event) => {
        setEmail(event.target.value);
        setError('');
    }

    const changeServer = (event) => {
        props.setServer(event.target.value);
    }

    const changePassword = (event) => {
        setPassword(event.target.value);
        setError('');
    }

    const changeMinGrid = (e) =>{
        updateSettings({
            gridMin: parseInt(e.target.value)
        })
    }

    const changeMaxGrid = (e) =>{
        updateSettings({
            gridMax: parseInt(e.target.value)
        })
    }

    const downloadPosthandler = useCallback((post)=>{

        const source = <Post classList="download display" font={post.font} message={post.message} textColour={post.textColour} fill={post.backgroundColour} strokeWidth="5" stroke={post.borderColour} shape={post.shape}/>

        props.onOpenModal({
            type: actionTypes.OPEN_MODAL,
            contents: {
                title: "Download image",
                body: <div ref={ref}>{source}</div>,
                reject: "Cancel",
                resolve: "Download"
            },
            resolve: {
                callback: () => {
                  toPng(ref.current, { cacheBust: true, })
                      .then((dataUrl) => {
                          const a = document.createElement('a');
                          a.download = 'post.png';
                          a.href = dataUrl;
                          a.click();
                      }).catch((err) => {
                            props.onErrorMessage({
                                type: actionTypes.ERROR_MESSAGE,
                                title: "downloading image",
                                error: err
                            })
                      })
                  }
              }
        })
       
    }, [ref])

    const dumpDatabaseHandler = () => {
        props.onOpenModal({
            type: actionTypes.OPEN_MODAL,
            contents: {
                title: "Delete entire database",
                body: "Warning, this cannot be undone",
                reject: "Cancel",
                resolve: "Delete"
            },
            resolve: {
                callback: () => {
                  deleteAllPosts();
                }
            }
        })
    }

    const downloadDatabaseHandler = () => {
        let data = ['date,', 'time,', 'message', '\n'];
        for(let post of posts){
            const date = post.created.toDate().toLocaleString('en-GB').replace(" ", "");
            data.push(`${date},`);
            data.push(`${post.message}`);
            data.push("\n");
        }
        const blob = new Blob([data.join("")], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = "posts.csv";
        a.href = url;
        a.click();
    }

    const favouriteHandler = () => {
        if(sortBy === SortBy.FAVOURITE){
            setSortBy(SortBy.DATE);
            setDateSortOrder(SortOrder.ASCENDING);
        } else {
            setSortBy(SortBy.FAVOURITE);
        }
    }

    const alphaUpHandler = () => {
        const name = sortBy === SortBy.NAME;
        setSortBy(SortBy.NAME);
        if(name){
            setNameSortOrder(SortOrder.DESCENDING);
        }
    }

    const alphaDownHandler = () => {
        const name = sortBy === SortBy.NAME;
        setSortBy(SortBy.NAME);
        if(name){
            setNameSortOrder(SortOrder.ASCENDING);
        }
    }

    const dateUpHandler = () => {
        const date = sortBy === SortBy.DATE;
        setSortBy(SortBy.DATE);
        if(date){
            setDateSortOrder(SortOrder.DESCENDING);
        }
    }

    const dateDownHandler = () => {
        const date = sortBy === SortBy.DATE;
        setSortBy(SortBy.DATE);
        if(date){
            setDateSortOrder(SortOrder.ASCENDING);
        }
    }

    const loginHandler = (event) => {
        event.preventDefault();
        setError('');
        props.onShowLoading({type: actionTypes.SHOW_LOADING});
        signInWithEmailAndPassword(auth, email, password)
            .then((credentials) => {
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                setError(error.code);
            })
            .finally(()=>{
                props.onHideLoading({type: actionTypes.HIDE_LOADING});
            })
    }

    const signOutHandler = () => {
        props.onShowLoading({type: actionTypes.SHOW_LOADING});
        signOut(auth)
            .then(() => {})
            .catch((err) => {
                props.onErrorMessage({
                    type: actionTypes.ERROR_MESSAGE,
                    title: "logging out",
                    error: err
                })
            })
            .finally(()=>{
                props.onHideLoading({type: actionTypes.HIDE_LOADING});
            });
    }

    const debug = async (flag) => {
        // const command = flag ? Internal.TOGGLE_DEBUG : Internal.NONE;
        // await updateDoc(doc(getFirestore(props.app), "settings", props.app.options.settingsId), {
        //     internal: flag
        // }).then((res)=>{})
        // .catch((err)=>{
        //     props.onErrorMessage({
        //         type: actionTypes.ERROR_MESSAGE,
        //         title: "toggling debug",
        //         error: err
        //     })
        // }).finally(()=>{})
    }

    const sort =
        <Stack direction="horizontal" gap={2}>
            {dateSortOrder === SortOrder.ASCENDING ?
                <SortNumericUp alt="Sort by latest" title="Sort by latest" className={`sort use-cursor ${sortBy === SortBy.DATE ? '':'disabled'}`} onClick={dateUpHandler} size={32}/>:
                <SortNumericDown alt="Sort by oldest" title="Sort by oldest" className={`sort use-cursor ${sortBy === SortBy.DATE ? '':'disabled'}`} onClick={dateDownHandler} size={32}/>}
            {nameSortOrder === SortOrder.ASCENDING ?
                <SortAlphaUp alt="Sort Z-A" title="Sort Z-A" className={`sort use-cursor ${sortBy === SortBy.NAME ? '':'disabled'}`} onClick={alphaUpHandler} size={32}/>:
                <SortAlphaDown alt="Sort A-Z" title="Sort A-Z" className={`sort use-cursor ${sortBy === SortBy.NAME ? '':'disabled'}`} onClick={alphaDownHandler} size={32}/>}
            {sortBy === SortBy.FAVOURITE ?
                <HeartFill alt="Filter off" title="Filter off" className={`sort use-cursor`} onClick={favouriteHandler} size={32}/>:
                <Heart alt="Filter favourites" title="Filter favourites" className={`sort use-cursor disabled`} onClick={favouriteHandler} size={32}/>}
        </Stack>

    const funcs =
        <Stack direction="horizontal" gap={2}>
            <DatabaseDown alt="Download all" title="Download all" className={`sort use-cursor`} onClick={downloadDatabaseHandler} size={32}/>
            <DatabaseX alt="Delete all" title="Delete all" className={`sort use-cursor danger`} onClick={dumpDatabaseHandler} size={32}/>
            <PersonCircle alt="Logout" title="Logout" className={`sort use-cursor`} onClick={signOutHandler} size={32}/>
            {/* <EmojiSmile className={`sort use-cursor`} onClick={devHandler} size={32}/> */}
        </Stack>

    const minGridSize =
        <FormGroup controlId="wall">
            <Form.Label>Minimum wall size</Form.Label>
            <Form.Select onChange={changeMinGrid} value={minGrid} aria-label="minimum grid size"> 
                <option value="0">5 x 3</option>
                <option value="1">7 x 5</option>
                <option value="2">9 x 7</option>
                <option value="3">11 x 9</option>
                <option value="4">13 x 11</option>  
            </Form.Select>
        </FormGroup>

    const serverMarkup =
        <FormGroup controlId="wall">
            <Form.Select onChange={changeServer} value={props.server} aria-label="server">
                <option value={Server.PRODUCTION}>Production</option>
                <option value={Server.STAGING}>Staging</option>
                <option value={Server.DEVELOPMENT}>Development</option>
            </Form.Select>
        </FormGroup>

    const maxGridSize =
        <FormGroup controlId="wall">
            <Form.Label>Maximum wall size</Form.Label>
            <Form.Select onChange={changeMaxGrid} value={maxGrid} aria-label="maximum grid size">
                <option value="0">5 x 3</option>
                <option value="1">7 x 5</option>
                <option value="2">9 x 7</option>
                <option value="3">11 x 9</option>
                <option value="4">13 x 11</option>
            </Form.Select>
        </FormGroup>

    const wallTimeoutMarkup =
        <FormGroup controlId="wall_timeout">
            <Form.Label>Wall timeout: {wallTimeout} mins</Form.Label>
            <Form.Range step="5" min="5" max="60" onChange={changeWallRange} value={wallTimeout}/>
        </FormGroup>

    const appTimeoutMarkup =
        <FormGroup controlId="app_timeout">
            <Form.Label>App timeout: {appTimeout} mins</Form.Label>
            <Form.Range step="5" min="5" max="60" onChange={changeAppRange} value={appTimeout}/>
        </FormGroup>

    const videoTimeoutMarkup =
        <FormGroup controlId="video_timeout">
            <Form.Label>Video timeout: {videoTimeout} mins</Form.Label>
            <Form.Range step="1" min="1" max="30" onChange={changeVideoRange} value={videoTimeout}/>
        </FormGroup>

    let sorted;
    if(sortBy === SortBy.NAME){
        if(nameSortOrder === SortOrder.ASCENDING){
            sorted = posts.sort((a, b) => (a.message > b.message) ? 1 : ((b.message > a.message) ? -1 : 0));
        } else if(nameSortOrder === SortOrder.DESCENDING){
            sorted = posts.sort((b, a) => (a.message > b.message) ? 1 : ((b.message > a.message) ? -1 : 0))
        }
    } else if(sortBy === SortBy.DATE){
        if(dateSortOrder === SortOrder.ASCENDING){
            sorted = posts.sort((a, b) => (a.created > b.created) ? 1 : ((b.created > a.created) ? -1 : 0));
        } else if(dateSortOrder === SortOrder.DESCENDING){
            sorted = posts.sort((b, a) => (a.created > b.created) ? 1 : ((b.created > a.created) ? -1 : 0))
        }
    } else if(sortBy === SortBy.FAVOURITE){
        sorted = posts.filter((p)=>p.favourite)
    }

    const allPosts = sorted.map((post)=><AdminItem downloadPost={downloadPosthandler} key={post.id} updateFavourite={updateFavourite} delete={deletePost} post={post}/>)

    let pages = [];
    for (let i = 0; i < (allPosts.length / pagelength); i++) {
        pages.push(
            <Pagination.Item key={`page=${i}`} onClick={()=> setPage(i)} active={i === page}>
            {i + 1}
            </Pagination.Item>
        );
    }
    if(pages.length >0 && page > pages.length - 1){
        setPage(pages.length - 1);
    }
   
    const none = allPosts.length > 0 ? '' : <span>No posts to show</span>
    const network = error ? <Card.Text className="text-capitalize text-danger mt-3">{error}</Card.Text> : '';

    const title =
        <Card className="admin title mb-3">
            <Card.Header>
                <Stack className="justify-content-between" direction="horizontal">
                    <Stack className="justify-content-between" gap={3} direction="horizontal">
                        <div><Everyones context="admin"/></div>
                        <div>Admin</div>
                        {serverMarkup}
                    </Stack> 
                    {auth?.currentUser ? funcs : ""}
                </Stack>
            </Card.Header>
        </Card>

    const test = <Test debug={debug} save={save}/>

    const main =
        <div>
            {title}
            <Card className="admin mb-3">
                <Card.Header>
                    <Stack className="justify-content-between" direction="horizontal">
                        <span>Settings</span>
                    </Stack>
                </Card.Header>
                <Card.Body>
                    <Stack className="justify-content-between" direction="horizontal" gap={3}>
                        {/* {minGridSize} */}
                        {maxGridSize}
                        {wallTimeoutMarkup}
                        {appTimeoutMarkup}
                        {videoTimeoutMarkup}
                    </Stack>
                </Card.Body>
            </Card>
            {params.option === "test" && test}
            <Card className="admin">
                <Card.Header>
                    <Stack className="justify-content-between" direction="horizontal">
                        <span>Posts ({allPosts.length})</span>
                        {sort}
                    </Stack>
                </Card.Header>
                <Card.Body>
                    <Stack direction="vertical" gap={3}>
                        {allPosts.slice(page * pagelength, (page * pagelength) + pagelength)}
                        {allPosts.length > pagelength && <Pagination>{pages}</Pagination>}
                        {none}
                    </Stack>
                </Card.Body>
            </Card>
        </div>

    const login =
        <div>
            {title}
            <Card>
                <Card.Header>
                    Login
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={loginHandler}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-1" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control onChange={changeEmail} value={email} type="email"/>
                                </Form.Group>
                                {network}
                                <Button className="mt-2" variant="primary" type="submit">Login</Button>
                            </Col>
                            <Col>
                                <Form.Group className="mb-1" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control onChange={changePassword} value={password} type="password"/>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </div>

    return <Container fluid>
            <Row className="mt-3">
                <Col>
                    { auth?.currentUser ? main : login }
                </Col>
            </Row>
        </Container>
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        onShowLoading: (action) => dispatch(action),
        onHideLoading: (action) => dispatch(action),
        onOpenModal: (action) => dispatch(action),
        onErrorMessage: (action) => dispatch(action)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);