const express = require('express');
const cors = require('cors');
const {adminRouter} = require('./src/routes/adminRouter')
const {userRouter} = require('./src/routes/userRouter')
const {authrouter} = require('./src/routes/authRouter')
const app = express();
const port = 3001;

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.json());

app.use('/api/auth', authrouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)

app.listen(port, ()=> {
    console.log(`Server listening at http://localhost:${port}`)
})