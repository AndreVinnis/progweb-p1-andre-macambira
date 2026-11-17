import type { Request, Response } from 'express';
import { contaService } from '../services/contaService.ts';

export const contaController = {
  listar(req: Request, res: Response) {
    const clienteId = typeof req.query.clienteId === 'string' ? req.query.clienteId : undefined;
    res.json(contaService.listar(clienteId));
  },

  buscarPorId(req: Request, res: Response) {
    res.json(contaService.buscarPorId(Number(req.params.id)));
  },

  criar(req: Request, res: Response) {
    const nova = contaService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req: Request, res: Response) {
    res.json(contaService.atualizar(Number(req.params.id), req.body));
  },

  remover(req: Request, res: Response) {
    contaService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
