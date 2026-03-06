const express = require("express");
const admin = require("firebase-admin");
const app = express();
app.use(express.json());

// A kulcsot a Render környezeti változóiból fogjuk beolvasni (biztonságosabb!)
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post("/send-notification", async (req, res) => {
  const { token, callerName } = req.body;
  const message = {
    token: token,
    notification: {
      title: "📞 Incoming Call!",
      body: `${callerName} Call you in the Goldex App.`
    }
  };
  try {
    await admin.messaging().send(message);
    res.status(200).send("Siker!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Postás élesítve!"));
