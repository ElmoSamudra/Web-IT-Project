// Client side


const socket = io('http://localhost:3000') // Location where we are hosting our socket
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')


//tasks
//current program receives one by one
//change to receive multiple users concurrently
//receive users as an object.


username = "BOBY"
console.log('hey!' + messageForm)
if (messageForm != null) {
  // get user name
  const name = username

  appendMessage('You joined')

  // send the name of new user to the server
  socket.emit('new-user', roomName, name) 


  // already in the chat window
  messageForm.addEventListener('submit', e => { // every time the 'send' button is pressed
  // prevent the page to be refreshed over and over again (if refreshed, will lose all the chat)
    e.preventDefault()  

    const message = messageInput.value
    appendMessage(`You: ${message}`)
    console.log('SENT MESSAGE')

    // emit: send information from the client to the server
    socket.emit('send-chat-message', roomName, message)  
    
    // empty the input box every time after we send a chat
    messageInput.value = ''  
  })
}


// socket.on(event name, data => {function})
// whenever we receive an event, we want to call the function
// with the data that we send down from the server




socket.on('room-created', room => {

  const roomElement = document.createElement('div')
  roomElement.innerText = room

  const roomLink = document.createElement('a')
  roomLink.href = `${room}`
  roomLink.innerText = 'join'

  roomContainer.append(roomElement)  // add room name to be then displayed in order
  roomContainer.append(roomLink)  // add room link to be then displayed in order
})


socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  // create a div element
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  // append the message to messageContainer
  messageContainer.append(messageElement)
}