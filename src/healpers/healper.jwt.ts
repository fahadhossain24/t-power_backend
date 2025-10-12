import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken"

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresTime: string
): string => {
  const options: SignOptions = {
    expiresIn: expiresTime as SignOptions['expiresIn'], // 👈 Cast to correct type
  }

  return jwt.sign(payload, secret, options)
}

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload
}

const jwtHelpers = {
  createToken,
  verifyToken,
}

export default jwtHelpers
