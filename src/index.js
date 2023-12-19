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