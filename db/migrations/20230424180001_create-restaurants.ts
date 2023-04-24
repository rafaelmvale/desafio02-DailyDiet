import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description')
    table.timestamp('date').defaultTo(knex.fn.now()).notNullable()
    table.boolean('isDiet').defaultTo(true).notNullable()
    table.text('userId').references('id').inTable('users').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks')
}
