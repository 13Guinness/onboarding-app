import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Prisma reads .env by default; Next.js uses .env.local
config({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
})
