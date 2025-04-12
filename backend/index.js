const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // ✅ 1. import dotenv
dotenv.config(); // ✅ 2. load .env
const app = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.error("❌ DB connection error:", err));

const credential = mongoose.model("credential", {}, "bulkmail");

// Install Nodemailer

app.post("/sendemail", function (req, res) {
  var msg = req.body.msg;
  var emailList = req.body.emails;
  credential
    .find()
    .then(function (data) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: data[0].toJSON().user,
          pass: data[0].toJSON().pass,
        },
      });
      new Promise(async function (resolve, reject) {
        try {
          for (var i = 0; i < emailList.length; i++) {
            await transporter.sendMail({
              from: "sivabalancarrer@gmail.com",
              to: emailList[i].A,
              subject: "Introduction of Our Bulk Email Sender Web Application",
              text: msg,
            });
            console.log("Email sent to:" + emailList[i].A);
          }
          resolve("Success");
        } catch (error) {
          reject("Failed");
        }
      })
        .then(function () {
          res.send(true);
        })
        .catch(function () {
          res.send(false);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(5000, function () {
  console.log("Server started");
});
