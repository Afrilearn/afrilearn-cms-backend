import { Router } from 'express';
import AdminController from '../controllers/admin.controller';
import Validator from '../middlewares/auth.middleware';
import checkIsAdminStatus from '../middlewares/isAdmin.middleware';

const router = Router();

router.get('/admin-enrolled/:id', Validator, checkIsAdminStatus, AdminController.allEnrolledCourse);

export default router;
