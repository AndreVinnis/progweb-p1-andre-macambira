import { Router } from 'express';
import { concessionariaController } from '../controllers/concessionariaController.ts';

const router = Router();

router.get('/', concessionariaController.listar);
router.get('/:id', concessionariaController.buscarPorId);
router.post('/', concessionariaController.criar);
router.put('/:id', concessionariaController.atualizar);
router.delete('/:id', concessionariaController.remover);

export default router;
