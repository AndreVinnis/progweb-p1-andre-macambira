import type { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const hora = new Date().toISOString();
  console.log(`[${hora}] ${req.method} ${req.url}`);
  next(); // sem isto, a requisição trava para sempre
}
