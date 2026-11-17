import type { Request, Response } from 'express';
import { clienteService } from '../services/clienteService.ts';

export const clienteController = {
  listar(req: Request, res: Response) {
    res.json(clienteService.listar());
  },

  buscarPorId(req: Request, res: Response) {
    res.json(clienteService.buscarPorId(Number(req.params.id)));
  },

  criar(req: Request, res: Response) {
    const novo = clienteService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req: Request, res: Response) {
    res.json(clienteService.atualizar(Number(req.params.id), req.body));
  },

  remover(req: Request, res: Response) {
    clienteService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
