// Fábrica de erros com status. O service usa; o errorHandler lê.
export type ErroHttp = Error & { status: number };

export function erro(status: number, message: string): ErroHttp {
  const e = new Error(message) as ErroHttp;
  e.status = status;
  return e;
}
