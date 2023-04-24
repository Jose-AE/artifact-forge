import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export default function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  //const token = req.headers.authorization?.split(" ")[1];
  const token = "ddd"; //req.headers.cookie?.split("; ")[1].split("=")[1];
  console.log(req);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const { userId } = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    req.userId = userId;

    next();
  } catch (err) {
    return res.status(401).json({ error: "JWT Invalid" });
  }
}
