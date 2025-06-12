import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import { loginSchema, refreshTokenSchema } from '../validations/auth.validation';
import authController from '../middlewares/auth.controller';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authController.logout);

export default router;