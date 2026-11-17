import type { Request, Response } from 'express';
import { veiculoService } from '../services/veiculoService.ts';

export const veiculoController = {
  listar(req: Request, res: Response) {
    const concessionariaId =
      typeof req.query.concessionariaId === 'string' ? req.query.concessionariaId : undefined;
    res.json(veiculoService.listar(concessionariaId));
  },

  buscarPorId(req: Request, res: Response) {
    res.json(veiculoService.buscarPorId(Number(req.params.id)));
  },

  criar(req: Request, res: Response) {
    const novo = veiculoService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req: Request, res: Response) {
    res.json(veiculoService.atualizar(Number(req.params.id), req.body));
  },

  remover(req: Request, res: Response) {
    veiculoService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
