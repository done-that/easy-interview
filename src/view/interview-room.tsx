import React from 'react';
import { socket, socketId } from '../connections/socket'
import VideoChatApp from './videochat';

interface InterviewRoomProps {
  interviewId: string;
  owner: boolean;
}

export class InterviewRoom extends React.Component<InterviewRoomProps> {
  state = {
    waiting: true,
  }

  timeout?: number

  textArea: React.RefObject<HTMLTextAreaElement>;

  constructor(props: InterviewRoomProps) {
    super(props);
    this.textArea = React.createRef();

    socket.on('start interview', (candidate: any) => {
      console.log(candidate);
      this.setState({
        waiting: false
      })
    });

    socket.on('code updated', (codeChange: any) => {
      if (this.textArea.current) {
        this.textArea.current.value = codeChange.code;
      }
    });
  }

  typingCode = () => {
    // grab the input text from the field from the DOM 
    const typedText = this.textArea.current ? this.textArea.current.value : '';

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    const { interviewId } = this.props;

    this.timeout = setTimeout(() => {
      socket.emit('code updated', {
        interviewId,
        code: typedText,
      });
      this.timeout = undefined;
    }, 500);
  }

  render() {
    return <div>
      {this.state.waiting ?
        <p>Waiting for candidate to join</p> :
        <div style={{ display: 'flex' }}>
          <textarea className='textArea' onInput={this.typingCode} ref={this.textArea}></textarea>
          <VideoChatApp socketId={socketId} opponentSocketId={''} opponentUsername={''}></VideoChatApp>
        </div>
      }
    </div>
  }
}