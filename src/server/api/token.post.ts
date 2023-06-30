import { generateToken } from 'node-2fa'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { secret } = body
  const token = generateToken(secret)?.token || ''
  return { token }
})
