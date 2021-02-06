
import React from 'react'
import { useParams } from 'react-router-dom'
import { socket } from '../connections/socket'
import CopyUrlToClipboard from './clipboard';

import './interview-room.css';

/**
 * 'Join interview' is where we actually join the interview room. 
 */


function joinInterviewRoom(interviewId: string, interviewer: string, owner: boolean) {
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
    interviewer,
    owner,
  }
  socket.emit('join-interview', idData)
}

interface JoinInterviewProps {
  interviewer: string,
  owner: boolean,
}

interface JoinInterviewParams {
  interviewId: string;
}

function JoinInterview(props: JoinInterviewProps) {
  /**
   * Extract the 'interviewId' from the URL. 
   * the 'interviewId' is the interviewRoom ID. 
   */
  const { interviewId } = useParams<JoinInterviewParams>()
  joinInterviewRoom(interviewId, props.interviewer, props.owner);
  return <div>
    <h1 style={{ textAlign: 'center' }}>Welcome to Interview!</h1>
    <CopyUrlToClipboard />
  </div>
}

export default JoinInterview