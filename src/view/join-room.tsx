import React from 'react'
import JoinInterview from './join-interview';
import { InterviewRoom } from './interview-room';
import { Button, TextField } from '@material-ui/core';
import './onboard.css';

/**
 * Onboard is where we create the interview room.
 */

interface JoinRoomProps {
  interviewId: string;
}

class JoinRoom extends React.Component<JoinRoomProps> {
  state = {
    didGetName: false,
    inputText: ""
  }

  textArea: React.RefObject<HTMLInputElement>

  constructor(props: JoinRoomProps) {
    super(props);
    this.textArea = React.createRef();
  }

  typingUserName = () => {
    // grab the input text from the field from the DOM 
    const typedText = this.textArea.current ? this.textArea.current.value : '';

    // set the state with that text
    this.setState({
      inputText: typedText
    })
  }

  render() {

    return (<React.Fragment>
      {
        this.state.didGetName ?
          <React.Fragment>
            <JoinInterview interviewer={this.state.inputText} owner={false} />
            <InterviewRoom owner={false} interviewId={this.props.interviewId} />
          </React.Fragment>
          :
          <div className='onboard'>
            <div className='header'>Your name</div>
            <TextField className='text'
              inputRef={this.textArea}
              onInput={this.typingUserName}></TextField>

            <Button className='submit'
              variant='contained'
              disabled={!(this.state.inputText.length > 0)}
              onClick={() => {
                // When the 'Submit' button gets pressed from the username screen,
                // We should send a request to the server to create a new room with
                // the uuid we generate here.
                this.setState({
                  didGetName: true
                })
              }}>Submit</Button>
          </div>
      }
    </React.Fragment>)
  }
}

export default JoinRoom