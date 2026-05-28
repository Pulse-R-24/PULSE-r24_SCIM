import pino from 'pino'

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info')

const destinations = [] as any[]

if (process.env.NODE_ENV === 'development') {
  destinations.push(pino.destination({ sync: false }))
} else {
  destinations.push(pino.destination({ sync: false }))
}

export const logger = pino({ level, redact: ['req.headers.authorization'] })

export function childLogger(bindings: Record<string, unknown> = {}) {
  return logger.child(bindings)
}

export default logger
