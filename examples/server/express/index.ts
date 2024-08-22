import { generateQr } from "@qrgrid/server";
import { dotModuleStyle, smoothModuleStyle } from "@qrgrid/styles/svg/styles";
import express from "express";

const PORT = 5000;

const app = express();

// api routes
app.use("/", (req, res) => {
  const qr = generateQr("hello world from server");
  const qr2 = generateQr("hello world from server", {
    moduleStyle: dotModuleStyle,
    color: { finder: "blue" },
  });
  const qr3 = generateQr("hello world from server", {
    moduleStyle: smoothModuleStyle,
  });
  res.set("Content-Type", "text/html");
  res.send(
    Buffer.from("<p>qr</p>" + qr + "<p>qr2</p>" + qr2 + "<p>qr3</p>" + qr3)
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
