declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      password: string
      email: string
      created_at: string
    }
    snacks: {
      id: string
      name: string
      description: string
      date: string
      isDiet: boolean
      userId: Tables.users
      created_at: string
    }
  }
}
