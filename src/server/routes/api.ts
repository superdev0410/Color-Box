import { Router, Response, Request } from "express";

const apiRouter = Router();

var history: number[] = [];

apiRouter.post("/history", async (req: Request, res: Response) => {
  const { index } = req.body;
  history.push(index);
  res.sendStatus(200);
});

apiRouter.get("/history", async (_: Request, res: Response) => {
  res.json(history);
});

export default apiRouter;
