import React, { useEffect, useState, useRef } from 'react';
import Peer, { SignalData } from 'simple-peer';
import styled from 'styled-components';
import { socket } from '../connections/socket';
import './videochat.css';

const Container = styled.div`
  flex-direction: column;
`;

const Row = styled.div`
  margin: 10px;
`;

const Video = styled.video`
  border: 1px solid blue;
`;

interface VideoChatProps {
  socketId: string;
  opponentUsername: string;
  opponentSocketId: string;
}

function VideoChatApp(props: VideoChatProps) {
  /**
   * initial state: both player is neutral and have the option to call each other
   * 
   * player 1 calls player 2: Player 1 should display: 'Calling {player 2 username},' and the 
   *                          'CallPeer' button should disappear for Player 1.
   *                          Player 2 should display '{player 1 username} is calling you' and
   *                          the 'CallPeer' button for Player 2 should also disappear. 
   * 
   * Case 1: player 2 accepts call - the video chat begins and there is no button to end it.
   * 
   * Case 2: player 2 ignores player 1 call - nothing happens. Wait until the connection times out. 
   * 
   */

  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState<SignalData | string>('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false)
  const userVideo = useRef<any>();
  const partnerVideo = useRef<any>();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.on('hey', (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal as SignalData);
    })
  }, []);

  function callPeer(id: string) {
    setIsCalling(true)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: props.socketId })
    })

    peer.on('stream', stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on('callAccepted', (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on('signal', data => {
      socket.emit('acceptCall', { signal: data, to: caller });
    });

    peer.on('stream', stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay style={{ width: '50%', height: '50%' }} />
    );
  }

  let mainView;

  if (callAccepted) {
    mainView = (
      <Video playsInline ref={partnerVideo} autoPlay style={{ width: '100%', height: '100%' }} />
    );
  } else if (receivingCall) {
    mainView = (
      <div>
        <div>{props.opponentUsername} is calling you</div>
        <button onClick={acceptCall}><h1>Accept</h1></button>
      </div>
    )
  } else if (isCalling) {
    mainView = (
      <div>
        <div>Currently calling {props.opponentUsername}...</div>
      </div>
    )
  } else {
    mainView = (
      <button onClick={() => {
        callPeer(props.opponentSocketId)
      }}><div>Call</div></button>
    )
  }

  return (<Container className='videochat'>
    <Row>
      {mainView}
    </Row>
    <Row>
      {UserVideo}
    </Row>
  </Container>);
}

export default VideoChatApp;