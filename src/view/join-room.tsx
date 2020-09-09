import React from 'react'
import JoinInterview from './join-interview';
import { InterviewRoom } from './interview-room';

/**
 * Onboard is where we create the interview room.
 */

interface JoinRoomProps {
  interviewId: string;
}

class JoinRoom extends React.Component<JoinRoomProps> {
  state = {
    didGetUserName: false,
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
        this.state.didGetUserName ?
          <React.Fragment>
            <JoinInterview username={this.state.inputText} owner={false} />
            <InterviewRoom owner={false} interviewId={this.props.interviewId} />
            {/* <ChessInterview myUserName={this.state.inputText} /> */}
          </React.Fragment>
          :
          <div>
            <h1 style={{ textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px" }}>Your Username:</h1>

            <input style={{ marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "62px" }}
              ref={this.textArea}
              onInput={this.typingUserName}></input>

            <button className="btn btn-primary"
              style={{ marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px" }}
              disabled={!(this.state.inputText.length > 0)}
              onClick={() => {
                // When the 'Submit' button gets pressed from the username screen,
                // We should send a request to the server to create a new room with
                // the uuid we generate here.
                this.setState({
                  didGetUserName: true
                })
              }}>Submit</button>
          </div>
      }
    </React.Fragment>)
  }
}

export default JoinRoom