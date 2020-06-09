import * as http from 'http'
import * as path from 'path'
import express from 'express'
import socketio from 'socket.io'

const app: express.Application = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const port = process.env.PORT || 3000
server.listen(port, () => { console.log('server listening on port ' + port) })

io.on('connection', socket => {
  // N.b. the server does NOT perform any security checks or attempt to limit room entry.
  // Clients are designed to act as though the server is adversarial; they will perform their own checks.
  socket.on('request connection', roomName => {
    socket.join(roomName)
    const clients = io.sockets.adapter.rooms[roomName] ? io.sockets.adapter.rooms[roomName].length : 0
    // TODO: handle race condition
    if (clients > 1) {
      socket.emit('await offer')
      // TODO: verify that this was received before starting the process
      io.to(roomName).emit('begin connection')
    } else {
      socket.emit('send offer')
    }
    socket.on('message', message => {
      socket.broadcast.to(roomName).emit('message', message)
    })
    socket.on('abandoning', () => {
      socket.broadcast.to(roomName).emit('abandon')
    })
  })
})
