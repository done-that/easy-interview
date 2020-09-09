import io from 'socket.io-client';

const socket = io('http://localhost:7000');

// socket.emit('create', 'session');
// app.service('api/session').create({})

interface ICreateInterview {
  username: string,
  interviewId: string,
  socketId: string
}

var socketId: string;

socket.on("create-interview", (statusUpdate: ICreateInterview) => {
  console.log("A new game has been created! Username: " + statusUpdate.username + ", Game id: " + statusUpdate.interviewId + " Socket id: " + statusUpdate.socketId);
  socketId = statusUpdate.socketId;
})

export {
  socket,
  socketId,
};
