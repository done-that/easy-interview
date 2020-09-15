import React from 'react'
import { Redirect } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { ColorContext } from '../context/color-context'
import { socket } from '../connections/socket'
import { Button, TextField } from '@material-ui/core';

import './onboard.css';

/**
 * Onboard is where we create the interviewrview room.
 */

interface CreateNewInterviewProps {
  didRedirect: () => void
  setUsername: (username: string) => void
}

class CreateNewInterview extends React.Component<CreateNewInterviewProps> {
  state = {
    didGetUsername: false,
    inputText: '',
    interviewId: ''
  };

  textArea: React.RefObject<HTMLInputElement>;

  constructor(props: CreateNewInterviewProps) {
    super(props);
    this.textArea = React.createRef();
  }

  send = () => {
    /**
     * This method should create a new room in the '/' namespace
     * with a unique identifier. 
     */
    const newInterviewId = uuid()

    // set the state of this component with the interviewrviewId so that we can
    // redirect the user to that URL later. 
    this.setState({
      interviewId: newInterviewId
    })

    // emit an event to the server to create a new room 
    socket.emit('create-interview', {
      username: this.state.inputText,
      interviewId: newInterviewId,
    })
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
    // !!! TODO: edit this later once you have bought your own domain. 

    return (<React.Fragment>
      {
        this.state.didGetUsername ?

          <Redirect to={'/interview/' + this.state.interviewId}>
            <Button className='btn btn-success' style={{ marginLeft: String((window.innerWidth / 2) - 60) + 'px', width: '120px' }}>
              Start Interview
            </Button>
          </Redirect>
          :
          <div className='onboard'>
            <div className='header'>Your name</div>
            {/* <TextField error id="standard-error" label="Error" defaultValue="Hello World" /> */}
            <TextField className='text'
              inputRef={this.textArea}
              onInput={this.typingUserName}></TextField>

            <Button className='submit'
              disabled={!(this.state.inputText.length > 0)}
              color='primary'
              variant='contained'
              onClick={() => {
                // When the 'Submit' button gets pressed from the username screen,
                // We should send a request to the server to create a new room with
                // the uuid we generate here.
                this.props.didRedirect()
                this.props.setUsername(this.state.inputText)
                this.setState({
                  didGetUsername: true
                })
                this.send()
              }}>Submit</Button>
          </div>
      }
    </React.Fragment>)
  }
}

interface OnBoardProps {
  setUsername: (username: string) => void
}

function Onboard(props: OnBoardProps) {
  const color = React.useContext(ColorContext)

  return <CreateNewInterview didRedirect={color.playerDidRedirect} setUsername={props.setUsername} />
}


export default Onboard