import express from "express";

import bodyParser from "body-parser";

// import * as FirebaseService from "./FirebaseService";
import {Expo} from "expo-server-sdk";

const app = express();
const port = 8000;

const expo = new Expo()

const jsonParser = bodyParser.json();
const httpParser = bodyParser.urlencoded({extended:false});

// app.post("/registerPushToken",jsonParser,async(req,res)=>{
//   const userId = String(req.body.userId);
//   console.log('LINE 15 '+JSON.stringify(req.body));
//   const token = String(req.body.token);
//   console.log('LINE 17 '+token)

//   await FirebaseService.saveToken(userId,token);
//   res.status(200).send('success');
// });

app.post('/sample',jsonParser,async(_,res)=>{
  // const {token} = await FirebaseService.getToken("0000001");
  expo.sendPushNotificationsAsync([
    {
      to:'ExponentPushToken[-Ji6d1F69jCS1l4qGHB3Zw]',
      title:"Soil Water level",
      body:'water your plan'
    },
  ])

  return res.status(200).send("success");
})


app.listen(port,()=> console.log(`running on Port ${port}`));
