import cookieSession from 'cookie-session'
import { errorHandler } from './middlewares/src/error-handler'
import { NotFoundError } from './errors/src/not-found-error'
import express from "express"
import cookieParser from 'cookie-parser'
import userRouter from "./routes/userRoutes"
import swaggerUi from "swagger-ui-express"
import yaml from "yamljs"

const app = express()

const swaggerDefinition = yaml.load('./swagger.yaml')
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition))

app.use(express.json())
app.use(cookieParser())

app.set('trust proxy', true);
app.use(cookieSession({ signed: false }))

app.get('/', (req, res) => {
    res.send('web server 1')    
})

app.use("/api/users", userRouter)

app.get("*", (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }