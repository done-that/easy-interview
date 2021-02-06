import { createContext } from 'react'

export const InterviewContext = createContext({
  didRedirect: false,
  didStart: () => { },
  didJoin: () => { }
});
