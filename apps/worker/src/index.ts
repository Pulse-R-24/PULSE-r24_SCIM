import Redis from 'ioredis'
import { Queue, Worker } from 'bullmq'

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const redisConnection = new Redis(redisUrl)
const queueName = 'pulse:jobs'

const queue = new Queue(queueName, { connection: redisConnection })

const worker = new Worker(
  queueName,
  async (job) => {
    // placeholder: import processors from ./processor when implemented
    console.log('Processing job', job.id, job.name)
    return { ok: true }
  },
  { connection: redisConnection }
)

worker.on('completed', (job) => {
  console.log('Job completed', job.id)
})

worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err)
})

process.on('SIGINT', async () => {
  console.log('Shutdown: closing worker')
  await worker.close()
  await queue.close()
  process.exit(0)
})

export { queue, worker }
