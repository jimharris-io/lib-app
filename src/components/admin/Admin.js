// components
import Post from "../wall/Post";
import AdminItem from "./AdminItem";
import { PersonCircle, DatabaseX, DatabaseDown, EmojiSmile, SortAlphaDown, SortAlphaUp, SortNumericUp, SortNumericDown, Heart, HeartFill } from 'react-bootstrap-icons';

// app
import { useState } from 'react';
import { useOutletContext } from "react-router-dom";
import * as actionTypes from './../../store/actions';import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image'
import { useCallback, useRef } from "react";
import { colours } from './../../constants/constants';
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import LibraryOn from "../campaign/LibraryOn";

import { SortOrder, SortBy } from './../../constants/constants';

// bootstrap
import { Button, Form, FormGroup, Container, Row, Col, Card, Stack } from "react-bootstrap";

const Admin = (props) => {

    const [, posts, deletePost,, updateFavourite, setShowModal, setModalContents, setModalPromise, alert, auth,,, minGrid, maxGrid, updateSettings] = useOutletContext();
    const [dateSortOrder, setDateSortOrder] = useState(SortOrder.ASCENDING);
    const [nameSortOrder, setNameSortOrder] = useState(SortOrder.ASCENDING);
    const [sortBy, setSortBy] = useState(SortBy.NAME);
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [error, setError ] = useState('');

    const [wall, setWall] = useState(30);
    const [app, setApp] = useState(15);

    const changeWallRange = (e) => {
        setWall(e.target.value);
    }

    const changeAppRange = (e) => {
        setApp(e.target.value);
    }

    const ref = useRef(null);

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

    const devHandler = () => {
        alert({
            type: actionTypes.SHOW_ALERT,
            variant: "success",
            contents: `Test`
          });
    }

    const changeEmail = (event) => {
        setEmail(event.target.value);
        setError('');
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

        setShowModal(true);
        setModalContents({
          title: "Download image",
          body: <div ref={ref}>{source}</div>,
          reject: "Cancel",
          resolve: "Download"
        })
        
        setModalPromise({
          callback: () => {
            toPng(ref.current, { cacheBust: true, })
                .then((dataUrl) => {
                    const a = document.createElement('a');
                    a.download = 'post.png';
                    a.href = dataUrl;
                    a.click();
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
        
    }, [ref])

    const dumpDatabaseHandler = () => {
        setShowModal(true);
        setModalContents({
          title: "Delete entire database",
          body: "Warning, this cannot be undone",
          reject: "Cancel",
          resolve: "Delete"
        })
        setModalPromise({
          callback: () => {
            console.log("// dump database");
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
        signInWithEmailAndPassword(auth, email, password)
            .then((credentials) => {
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                setError(error.code);
            });
    }

    const signOutHandler = () => {
        signOut(auth).then(() => {}).catch((error) => {});
    }

    const sort = <Stack direction="horizontal" gap={2}>
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

    const funcs = <Stack direction="horizontal" gap={2}>
            <DatabaseDown alt="Download all" title="Download all" className={`sort use-cursor`} onClick={downloadDatabaseHandler} size={32}/>
            <DatabaseX alt="Delete all" title="Delete all" className={`sort use-cursor danger`} onClick={dumpDatabaseHandler} size={32}/>
            <PersonCircle alt="Logout" title="Logout" className={`sort use-cursor`} onClick={signOutHandler} size={32}/>
            {/* <EmojiSmile className={`sort use-cursor`} onClick={devHandler} size={32}/> */}
        </Stack>

    const minGridSize = <FormGroup controlId="wall">
                    <Form.Label>Minimum wall size</Form.Label>
                    <Form.Select onChange={changeMinGrid} value={minGrid} aria-label="minimum grid size"> 
                        <option>Select</option>
                        <option value="0">5 x 3</option>
                        <option value="1">7 x 5</option>
                        <option value="2">9 x 7</option>
                        <option value="3">11 x 9</option>
                        <option value="4">13 x 11</option>  
                    </Form.Select>
                </FormGroup>

    const maxGridSize = <FormGroup controlId="wall">
                    <Form.Label>Maximum wall size</Form.Label>
                    <Form.Select onChange={changeMaxGrid} value={maxGrid} aria-label="maximum grid size">
                        <option>Select</option>
                        <option value="0">5 x 3</option>
                        <option value="1">7 x 5</option>
                        <option value="2">9 x 7</option>
                        <option value="3">11 x 9</option>
                        <option value="4">13 x 11</option>
                    </Form.Select>
                </FormGroup>

    const wallTimeout = <FormGroup controlId="wall">
            <Form.Label>Wall timeout: {wall} mins</Form.Label>
            <Form.Range step="5" min="5" max="60" onChange={changeWallRange} value={wall}/>
        </FormGroup>
    const appTimeout = <FormGroup controlId="wall">
            <Form.Label>App timeout: {app} mins</Form.Label>
            <Form.Range step="5" min="5" max="60" onChange={changeAppRange} value={app}/>
        </FormGroup>

    const allPosts = sorted.map((post)=><AdminItem downloadPost={downloadPosthandler} key={post.id} updateFavourite={updateFavourite} delete={deletePost} post={post}/>)

    const err = allPosts.length > 0 ? '' : <span>No posts to show</span>
    const network = error ? <Card.Text className="text-capitalize text-danger mt-3">{error}</Card.Text> : '';

    const title = <Card className="admin title mb-3">
                    <Card.Header>
                        <Stack className="justify-content-between" direction="horizontal">
                            <Stack className="justify-content-between" gap={3} direction="horizontal">
                                <div><LibraryOn context="admin"/></div>
                                <div>Admin v0.1</div>
                            </Stack>
                            {auth?.currentUser ? funcs : ""}
                        </Stack>
                    </Card.Header>
                </Card>

    const main = <div>
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
                            {wallTimeout}
                            {appTimeout}
                        </Stack>
                    </Card.Body>
                </Card>
                <Card className="admin">
                    <Card.Header>
                        <Stack className="justify-content-between" direction="horizontal">
                            <span>Posts</span>
                            {sort}
                        </Stack>
                    </Card.Header>
                    <Card.Body>
                        <Stack direction="vertical" gap={3}>
                            {allPosts}
                            {err}
                        </Stack>
                    </Card.Body>
                </Card>
            </div>

    const login = <div>
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

export default Admin;