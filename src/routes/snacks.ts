import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from 'src/database'
import { randomUUID } from 'crypto'

export async function snacksRoutes(app: FastifyInstance) {
  app.post('/snacks/:userId', async (request, reply) => {
    const createSnacksSchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const { name, description, isDiet } = createSnacksSchema.parse(request.body)

    const getUserIdParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getUserIdParamsSchema.parse(request.params)
    await knex('snacks').insert({
      id: randomUUID(),
      name,
      description,
      isDiet,
      userId,
    })
    return reply.status(201).send()
  })
  app.get('/snacks', async () => {
    const table = await knex('snacks').select('*')
    return table
  })
  app.get('/snacks/:userId', async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getUserIdParamsSchema.parse(request.params)
    const snack = await knex('snacks').select('*').where('userId', userId)
    return reply.status(200).send(snack)
  })
  app.get('/snack/:id', async (request, reply) => {
    const getSnackIdParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getSnackIdParamsSchema.parse(request.params)
    const snack = await knex('snacks').select('*').where('id', id)
    return reply.status(200).send(snack)
  })
  app.patch('/snacks/:id', async (request, reply) => {
    const getSnackParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getSnackParamsSchema.parse(request.params)

    const updateSnackSchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const { name, description, isDiet } = updateSnackSchema.parse(request.body)

    const snack = await knex('snacks').where('id', id).update({
      name,
      description,
      isDiet,
    })

    return reply.status(200).send(snack)
  })
  app.delete('/snacks/:id', async (request, reply) => {
    const getSnackParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getSnackParamsSchema.parse(request.params)

    await knex('snacks')
      .where({
        id,
      })
      .del()

    return reply.status(202).send()
  })
  app.get('/snacks/count/:userId', async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getUserIdParamsSchema.parse(request.params)

    const number = await knex('snacks')
      .count('id as Quantity of snacks')
      .where('userId', userId)
    return reply.status(200).send(number)
  })
  app.get('/snacks/inDiet/:userId', async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getUserIdParamsSchema.parse(request.params)

    const number = await knex('snacks')
      .count('id as Snacks in Diet')
      .where('userId', userId)
      .andWhere('isDiet', true)
    return reply.status(200).send(number)
  })
  app.get('/snacks/outDiet/:userId', async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getUserIdParamsSchema.parse(request.params)

    const number = await knex('snacks')
      .count('id as Snacks out Diet')
      .where('userId', userId)
      .andWhere('isDiet', false)
    return reply.status(200).send(number)
  })
}
