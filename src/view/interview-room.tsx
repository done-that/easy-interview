import React, { ChangeEvent } from 'react';
import { socket, socketId } from '../connections/socket';
import VideoChatApp from './videochat';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { CircularProgress, MenuItem, Select } from '@material-ui/core';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clojure/clojure';
import 'codemirror/mode/coffeescript/coffeescript';
import 'codemirror/mode/erlang/erlang';
import 'codemirror/mode/gherkin/gherkin';
import 'codemirror/mode/haskell/haskell';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/perl/perl';
import 'codemirror/mode/php/php';
import 'codemirror/mode/powershell/powershell';
import 'codemirror/mode/protobuf/protobuf';
import 'codemirror/mode/python/python';
import 'codemirror/mode/r/r';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/coffeescript-lint';
import 'codemirror/addon/lint/css-lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/yaml-lint';
import { JSHINT } from 'jshint';
import 'jsonlint/web/jsonlint';
import 'csslint/dist/csslint';
import { Dictionary } from 'lodash';

(window as any).JSHINT = JSHINT;

const languagesSupported: Dictionary<string> = {
  Java: 'text/x-java',
  'C++': 'text/x-c++src',
  Python: 'python',
  JavaScript: 'javascript',
  Swift: 'swift',
  'C#': 'text/x-csharp',
  C: 'text/x-csrc',
  Kotlin: 'text/x-kotlin',
  Typescript: 'text/typescript',
  Scala: 'text/x-scala',
  Ruby: 'ruby',
  Clojure: 'clojure',
  Coffee: 'coffeescript',
  'Objective-C': 'text/x-objectivec',
  Perl: 'perl',
  R: 'r',
  Erlang: 'erlang',
  Jsx: 'jsx',
  Powershell: 'powershell',
  Shell: 'shell',
  Html: 'htmlmixed',
  Sql: 'sql',
  Protobuf: 'protobuf',
  Php: 'php',
  Vue: 'vue',
  XML: 'xml',
  Yaml: 'yaml',
};

interface InterviewRoomProps {
  interviewId: string;
  owner: boolean;
}

export class InterviewRoom extends React.Component<InterviewRoomProps> {
  state = {
    waiting: true,
    code: '',
    selectedLanguage: 'Java',
  };

  timeout?: number;

  textArea: React.RefObject<CodeMirror>;

  constructor(props: InterviewRoomProps) {
    super(props);
    this.textArea = React.createRef();

    socket.on('start interview', (candidate: any) => {
      console.log(candidate);
      this.setState({
        waiting: false,
      });
    });

    socket.on('code updated', (codeChange: any) => {
      this.setState({
        code: codeChange.code,
      });
    });

    socket.on('language selected', (language: any) => {
      console.log(language);

      this.setState({
        selectedLanguage: language,
      });
    });
  }

  typingCode = (typedText: string) => {
    // grab the input text from the field from the DOM
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
  };

  onLanguageSelected(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
    this.setState({
      selectedLanguage: event.target.value,
    });

    const { interviewId } = this.props;
    socket.emit('language selected', {
      interviewId,
      language: event.target.value,
    });
  }
  renderLanguageList() {
    const items = [];

    for (const key of Object.keys(languagesSupported)) {
      items.push(
        <MenuItem key={key} value={key}>
          {key}
        </MenuItem>
      );
    }
    return (
      <Select
        name='language'
        id='language'
        onChange={this.onLanguageSelected.bind(this)}
        value={this.state.selectedLanguage}
      >
        {items}
      </Select>
    );
  }

  render() {
    return (
      <div className='interview'>
        {this.state.waiting ? (
          <div>Waiting for candidate to join... <CircularProgress size={24} /></div>
        ) : (
            <div></div>
          )}
        <div className='language'>
          <span>Select Language: </span>
          {this.renderLanguageList()}
        </div>
        <div className='content'>
          <CodeMirror
            className='codeEditor'
            value={this.state.code}
            options={{
              mode: languagesSupported[this.state.selectedLanguage],
              theme: 'material',
              lineNumbers: true,
              gutters: ['CodeMirror-lint-markers'],
              lint: { esversion: '8' } as any,
            }}
            onChange={(editor, data, value) => {
              this.typingCode(value);
            }}
          />
          <VideoChatApp
            socketId={socketId}
            opponentSocketId={''}
            opponentUsername={''}
          ></VideoChatApp>
        </div>
      </div>
    );
  }
}
