import "dotenv/config";
import stats from "./api/index.ts";
import express from "express";

const app = express();
app.listen(process.env.port || 9000);

app.get("/", stats);
