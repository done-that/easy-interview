import * as React from 'react';
import './App.css';
import { InterviewContext } from './context/interview-context';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Onboard from './view/onboard';
import JoinRoom from './view/join-room';
import JoinInterview from './view/join-interview';
import { InterviewRoom } from './view/interview-room';

function usePersistedState(key: string, defaultValue: unknown) {
  const [state, setState] = React.useState(
    () => {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      return JSON.parse(value);
    });
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function App() {
  const [didRedirect, setDidRedirect] = React.useState(false)

  const didStart = React.useCallback(() => {
    setDidRedirect(true)
  }, [])

  const didJoin = React.useCallback(() => {
    setDidRedirect(false)
  }, [])

  const [interviewer, setInterviewer] = React.useState('')
  const [candidate, setCandidate] = React.useState('')

  return (
    <InterviewContext.Provider value={{ didRedirect, didStart, didJoin }}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Onboard setInterviewer={setInterviewer} />
          </Route>
          <Route path="/interview/:interviewId" exact render={({ match }) => (
            didRedirect ?
              <React.Fragment >
                <JoinInterview interviewer={interviewer} owner={true} />
                <InterviewRoom owner={true} interviewId={match.params.interviewId} />
              </React.Fragment>
              :
              <JoinRoom interviewId={match.params.interviewId} />
          )} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </InterviewContext.Provider >);
}

export default App;
