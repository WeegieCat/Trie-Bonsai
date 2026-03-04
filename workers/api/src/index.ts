import { Hono } from "hono";
import { corsMiddleware, type Env } from "./middleware/cors";
import bonsaiRouter from "./routes/bonsai";

const app = new Hono<{ Bindings: Env }>();

app.use("*", corsMiddleware);

app.get("/healthz", (c) => {
    return c.json({
        status: "ok",
        service: "triebonsai-edge-api",
    });
});

app.get("/", (c) => {
    return c.text("Trie Bonsai Edge API");
});

app.route("/api/bonsai", bonsaiRouter);

export default app;
