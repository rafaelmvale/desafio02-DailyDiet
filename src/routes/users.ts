import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from 'src/database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string().min(6),
    })
    const { name, email, password } = createUserSchema.parse(request.body)
    console.log(new Date())
    const userEmailExists = await knex('users').where('email', email).first()
    if (userEmailExists) {
      return reply.status(409).send({ message: 'User Exists' })
    }
    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password,
    })

    return reply.status(201).send()
  })
  app.get('/users/:id', async (request, reply) => {
    const getUsersParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUsersParamsSchema.parse(request.params)

    const user = await knex('users')
      .where({
        id,
      })
      .first()

    return { user }
  })
  app.get('/users', async () => {
    const table = await knex('users').select('*')
    return table
  })
  app.delete('/users/:id', async (request, reply) => {
    const getUsersParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUsersParamsSchema.parse(request.params)

    await knex('users')
      .where({
        id,
      })
      .del()

    return reply.status(202).send()
  })
}
