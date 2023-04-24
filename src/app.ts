import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { snacksRoutes } from './routes/snacks'

export const app = fastify()

app.register(usersRoutes)
app.register(snacksRoutes)
