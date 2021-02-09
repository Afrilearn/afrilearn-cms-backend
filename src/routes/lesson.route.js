import { Router } from 'express';
import LessonController from '../controllers/lesson.controller';
import validateToken from '../middlewares/auth.middleware';

const router = Router();

router.put('/video', validateToken, LessonController.addVideo);

router.get('/quiz', validateToken, LessonController.viewQuiz);

router.post('/quiz', validateToken, LessonController.createQuiz);

router.put('/quiz/:id', validateToken, LessonController.modify);

router.delete('/quiz/:id', validateToken, LessonController.remove);

export default router;
