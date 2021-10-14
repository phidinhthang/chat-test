import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
// import { Header } from './layouts/Header';
import { Pending } from './pages/Pending';
import { FriendsList } from './pages/FriendsList';
import { Chat } from './ui/Chat';
import { Test } from './ui/Test';
import { Layout } from './layouts/Layout';
import { CurrentConversationProvider } from './contexts/currentConversation';
import { UsersList } from './pages/UsersList';

export const Routes = () => {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        </Switch>
        <Switch>
          <Route exact path='/test' component={Test} />
          <CurrentConversationProvider>
            <Layout>
              <Route exact path='/' component={Chat} />
              <Route exact path='/fdsa' component={Home} />
              <Route exact path='/pending' component={Pending} />
              <Route exact path='/friends' component={FriendsList} />
              <Route exact path='/users' component={UsersList} />
            </Layout>
          </CurrentConversationProvider>
        </Switch>
        {/* <Header /> */}
      </div>
    </BrowserRouter>
  );
};
