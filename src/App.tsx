import React from 'react';
import './App.css';
import { ColorContext } from './context/color-context';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Onboard from './view/onboard';
import JoinRoom from './view/join-room';
import JoinInterview from './view/join-interview';
import { InterviewRoom } from './view/interview-room';

function App() {
  const [didRedirect, setDidRedirect] = React.useState(false)

  const playerDidRedirect = React.useCallback(() => {
    setDidRedirect(true)
  }, [])

  const playerDidNotRedirect = React.useCallback(() => {
    setDidRedirect(false)
  }, [])

  const [username, setUsername] = React.useState('')

  return (
    <ColorContext.Provider value={{ didRedirect, playerDidRedirect, playerDidNotRedirect }}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Onboard setUsername={setUsername} />
          </Route>
          <Route path="/interview/:interviewId" exact render={({ match }) => (
            didRedirect ?
              <React.Fragment >
                <JoinInterview username={username} owner={true} />
                <InterviewRoom owner={true} interviewId={match.params.interviewId} />
              </React.Fragment>
              :
              <JoinRoom interviewId={match.params.interviewId} />
          )} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </ColorContext.Provider >);
}

export default App;
