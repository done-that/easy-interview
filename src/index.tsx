import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component {
  public render() {
    return (<div>Hello App</div>);
  }
}

ReactDOM.render(<App></App>, document.getElementById('mount'));
