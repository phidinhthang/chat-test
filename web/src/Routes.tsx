import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Header } from './layouts/Header';
import { Pending } from './pages/Pending';
import { FriendsList } from './pages/Friends';
import { Chat } from './ui/Chat';
import { Test } from './ui/Test';

export const Routes = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/pending' component={Pending} />
          <Route exact path='/friends' component={FriendsList} />
          <Route exact path='/chat' component={Chat} />
          <Route exact path='/test' component={Test} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
