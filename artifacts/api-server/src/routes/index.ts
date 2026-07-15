import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import storeRouter from "./store";
import notificationsRouter from "./notifications";
import rankingsRouter from "./rankings";
import inviteRouter from "./invite";
import friendsRouter from "./friends";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(storeRouter);
router.use(notificationsRouter);
router.use(rankingsRouter);
router.use(inviteRouter);
router.use(friendsRouter);

export default router;
