import { generateQr } from "@qrgrid/server";
import express from "express";

const PORT = 5000;

const app = express();

// api routes
app.use("/", (req, res) => {
  const qr = generateQr("hello world from server");
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(qr));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
