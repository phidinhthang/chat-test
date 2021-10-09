import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Header } from './layouts/Header';
import { Pending } from './pages/Pending';
import { FriendsList } from './pages/Friends';

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
        </Switch>
      </div>
    </BrowserRouter>
  );
};
