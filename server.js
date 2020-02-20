const app = require('./app')

const port = 3000
const host = 'http://127.0.0.1'
app.listen(port, () => {
    console.log(`server running at ${host}:${port}`)
})