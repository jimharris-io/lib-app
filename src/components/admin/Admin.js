// components
import Post from "../wall/Post";
import PostAdmin from "./PostAdmin";
import { PersonCircle, DatabaseX, DatabaseDown, EmojiSmile, SortAlphaDown, SortAlphaUp, SortNumericUp, SortNumericDown, Heart, HeartFill } from 'react-bootstrap-icons';

// app
import { useState } from 'react';
import { useOutletContext } from "react-router-dom";
import * as actionTypes from './../../store/actions';import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image'
import { useCallback, useRef } from "react";
import { colours } from './../../constants/constants';
import { signOut, signInWithEmailAndPassword } from "firebase/auth";

import { SortOrder, SortBy } from './../../constants/constants';

// bootstrap
import { Button, Form, Container, Row, Col, Card, Stack } from "react-bootstrap";

const Admin = () => {

    const [posts, deletePost,, updateFavourite, setShowModal, setModalContents, setModalPromise, alert, auth] = useOutletContext();
    const [dateSortOrder, setDateSortOrder] = useState(SortOrder.ASCENDING);
    const [nameSortOrder, setNameSortOrder] = useState(SortOrder.ASCENDING);
    const [sortBy, setSortBy] = useState(SortBy.NAME);
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [error, setError ] = useState('');

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

    const downloadPosthandler = useCallback((post)=>{

        const fill = colours.find((colour) => colour.value === post.backgroundColour)?.hex;
        const stroke = colours.find((colour) => colour.value === post.borderColour)?.hex;
        const source = <Post mode="display" font={post.font} message={post.message} textColour={post.textColour} fill={fill} strokeWidth="5" stroke={stroke} shape={post.shape}/>

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
            <SortNumericUp className={`sort use-cursor ${sortBy === SortBy.DATE ? '':'disabled'}`} onClick={dateUpHandler} size={32}/>:
            <SortNumericDown className={`sort use-cursor ${sortBy === SortBy.DATE ? '':'disabled'}`} onClick={dateDownHandler} size={32}/>}
        {nameSortOrder === SortOrder.ASCENDING ?
            <SortAlphaUp className={`sort use-cursor ${sortBy === SortBy.NAME ? '':'disabled'}`} onClick={alphaUpHandler} size={32}/>:
            <SortAlphaDown className={`sort use-cursor ${sortBy === SortBy.NAME ? '':'disabled'}`} onClick={alphaDownHandler} size={32}/>}
        {sortBy === SortBy.FAVOURITE ?
            <HeartFill className={`sort use-cursor`} onClick={favouriteHandler} size={32}/>:
            <Heart className={`sort use-cursor disabled`} onClick={favouriteHandler} size={32}/>}
            <DatabaseDown className={`sort use-cursor`} onClick={downloadDatabaseHandler} size={32}/>
            <DatabaseX className={`sort use-cursor danger`} onClick={dumpDatabaseHandler} size={32}/>
            <PersonCircle className={`sort use-cursor`} onClick={signOutHandler} size={32}/>
            {/* <EmojiSmile className={`sort use-cursor`} onClick={devHandler} size={32}/> */}
        </Stack>

    const allPosts = sorted.map((post)=><PostAdmin downloadPost={downloadPosthandler} key={post.id} updateFavourite={updateFavourite} delete={deletePost} post={post}/>)

    const err = allPosts.length > 0 ? '' : <span>No posts to show</span>
    const network = error ? <Card.Text className="text-capitalize text-danger mt-3">{error}</Card.Text> : '';

    const main = <Card>
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

    const login = <Card>
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

    return <Container fluid>
            <Row className="mt-3">
                <Col>
                    { auth?.currentUser ? main : login }
                </Col>
            </Row>
        </Container>
}

export default Admin;