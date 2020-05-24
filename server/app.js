const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')()

const modif = (name, text, id) => ({name, text, id})

io.on('connection', socket => {

    socket.on('userJoined', (data, callBack) => {
        if (!data.name || !data.room) {
            return callBack('the data is incorrect')
        }

        socket.join(data.room)

        users.remove(socket.id)
        users.add({
            id: socket.id,
            name: data.name,
            room: data.room
        })


        callBack({userId: socket.id})
        io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
        socket.emit('newMessage', modif('admin', ` Welcome ${data.name}.`))
        socket.broadcast
                .to(data.room)
                .emit("newMessage", modif('admin', `User ${data.name} has joined.`))
    })

    socket.on('CreateMessage', (data, callBack) => {
        if(!data.text) {
            return callBack('text cannot be empty')
        }  
        
        const user = users.get(data.id)
        if (user) {
            io.to(user.room).emit('newMessage', modif(user.name, data.text, data.id))
        }
        callBack()
    })


    socket.on('userLeft', (id, callBack) => {
        const user = users.remove(id)
        if (user) {
            io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', modif('admin', `User ${user.name} left chat.`))
        }
        callBack()
    })

    socket.on('disconnect', () => {
        const user = users.remove(socket.id)
        if (user) {
            io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', modif('admin', `User ${user.name} left chat.`))
        }
    })
})


    module.exports = {
        app,
        server
    }