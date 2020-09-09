
import React from 'react'
import { useParams } from 'react-router-dom'
import { socket } from '../connections/socket'

/**
 * 'Join interview' is where we actually join the interview room. 
 */


function joinInterviewRoom(interviewId: string, username: string, owner: boolean) {
  /**
   * For this browser instance, we want 
   * to join it to a interviewRoom. For now
   * assume that the interview room exists 
   * on the backend. 
   *  
   * 
   * TODO: handle the case when the interview room doesn't exist. 
   */
  const idData = {
    interviewId,
    username,
    owner,
  }
  socket.emit("join-interview", idData)
}

interface JoinInterviewProps {
  username: string,
  owner: boolean,
}

function JoinInterview(props: JoinInterviewProps) {
  /**
   * Extract the 'interviewId' from the URL. 
   * the 'interviewId' is the interviewRoom ID. 
   */
  const { interviewId } = useParams()
  joinInterviewRoom(interviewId, props.username, props.owner);
  return <div>
    <h1 style={{ textAlign: "center" }}>Welcome to Interview with Friend!</h1>

  </div>
}

export default JoinInterview