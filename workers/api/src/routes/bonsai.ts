import { Hono } from 'hono';
import type { Env } from '../middleware/cors';

const bonsaiRouter = new Hono<{ Bindings: Env }>();

bonsaiRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    // Phase 7で実装予定: R2へ画像アップロード + D1へメタデータ保存
    // 現在は受信確認のみ
    
    return c.json({
      success: true,
      message: 'Bonsai save endpoint (Phase 6 skeleton)',
      receivedKeys: Object.keys(body),
    }, 200);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request payload',
    }, 400);
  }
});

export default bonsaiRouter;
