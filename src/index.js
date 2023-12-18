import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'
import reducer from './store/reducer';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App';
import Wall from './components/wall/Wall';
import Admin from './components/admin/Admin';
import PostingApp from './components/posting/PostingApp';
import reportWebVitals from './reportWebVitals';

const store = configureStore({reducer});
const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "wall",
        element: <Wall/>
      },
      {
        path: "admin",
        element: <Admin/>
      },
      {
        path: "post",
        element: <PostingApp/>
      }
    ]
  }
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
