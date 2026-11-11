import type { Request, Response } from 'express';
import { concessionariaService } from '../services/concessionariaService.ts';

export const concessionariaController = {
  listar(req: Request, res: Response) {
    res.json(concessionariaService.listar());
  },

  buscarPorId(req: Request, res: Response) {
    res.json(concessionariaService.buscarPorId(Number(req.params.id)));
  },

  criar(req: Request, res: Response) {
    const nova = concessionariaService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req: Request, res: Response) {
    res.json(concessionariaService.atualizar(Number(req.params.id), req.body));
  },

  remover(req: Request, res: Response) {
    concessionariaService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
