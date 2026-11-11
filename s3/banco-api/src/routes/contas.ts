import { Router } from 'express';
import { contaController } from '../controllers/contaController.ts';

const router = Router();

router.get('/', contaController.listar);
router.get('/:id', contaController.buscarPorId);
router.post('/', contaController.criar);
router.put('/:id', contaController.atualizar);
router.delete('/:id', contaController.remover);

export default router;
