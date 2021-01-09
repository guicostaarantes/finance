import express from "express";
import cors from "cors";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`Finance server listening to port ${process.env.PORT}`);
});
