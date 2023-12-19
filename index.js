import express from "express";
import {Expo} from "expo-server-sdk";
import https from 'https'
import fs from 'fs'
import cors from 'cors'
import hbjs from 'handbrake-js'
import * as firebase from 'firebase/app'
import {getStorage,ref,uploadBytes,getDownloadURL,uploadBytesResumable} from 'firebase/storage'



//firebase configuration
const firebaseConfig={
  apiKey: "AIzaSyByPUXoGGFnf-IAWh_Rh0EzTDUJc4qWxbE",
  authDomain: "todoapp-a09ac.firebaseapp.com",
  projectId: "todoapp-a09ac",
  storageBucket: "todoapp-a09ac.appspot.com",
  messagingSenderId: "46672997342",
  appId: "1:46672997342:web:4c09cb254904222a538b4f",
  measurementId: "G-9CPMY34QP4"
}
firebase.initializeApp(firebaseConfig);
const storage = getStorage();

/////////////////////////
const app = express();

app.use(cors());
app.use(express.json());
const port = 8000;
const expo = new Expo()

// utils function
async function convertVideo(obj,idx,res){
  console.log('convertVideo');
  const options = {
        input: "/tmp/"+obj.fullPath,
        output: "/tmp/"+obj.fullPath+".mp4",
        preset: 'Very Fast 1080p30',
       
      }
    
     const result = await hbjs.run(options)
      console.log("/tmp/"+obj.fullPath+".mp4")
      console.log('line45',result)
}
  
      


async function getVideo(obj) {
  return new Promise((resolve) => {
    console.log('getvideo')
    const stream = fs.createWriteStream("/tmp/" + obj.fullPath);
    console.log('getvideo lin 56')
    https.get(obj.url, response => {
      response.pipe(stream);
      response.on('end', () => {
        resolve(stream);
      });
    });
  });
}
async function uploadVideo(urls,name){
  if(!urls){
      console.log("no file uploaded");
      return;
    
  }
  const filePath = "/tmp/"+name+".mp4";
  const StorageRef = ref(storage,'apiVideo/'+name+".mp4");
  console.log('line 72')
 const metadata = {
  contentType:'video/mp4',
 }
 console.log('line 76')
 
 const data = fs.readFileSync(filePath)
   await uploadBytesResumable(StorageRef,data,metadata)
    console.log('line 78')
    try {
      const url = await getDownloadURL(StorageRef)
    
      urls.push({url:url,name:name});
      
    } catch (error) {
      console.log(error)
    }  
}



app.post('/',async(req,res)=>{
  const urls=[];
  const data = req.body;
  console.log('line 137'+ data);

    for(let i = 0;i<data.length;i++){
      let obj = data[i];
      let idx =i;
      let name = data[i].fullPath;
      try{
        await getVideo(obj)
       
         await convertVideo(obj,idx,res)
        
       
       
        await uploadVideo(urls,name);
  
      } catch (error) {
      console.log(error)
    }  

    }

    
  
return res.status(200).send({urls:urls});

})

 


app.post('/warning',async(_,res)=>{
 
  expo.sendPushNotificationsAsync([
    {
      to:'ExponentPushToken[-Ji6d1F69jCS1l4qGHB3Zw]',
      title:"WARNING",
      body:'Password input wrong too many time. Some one are trying to break into your Locker'
    },
  ])

  return res.status(200).send("successful push");
})

app.post('/open',async(_,res)=>{

  expo.sendPushNotificationsAsync([
    {
      to:'ExponentPushToken[-Ji6d1F69jCS1l4qGHB3Zw]',
      title:"LOCKER OPEN",
      body:'Your locker has been opened by someone'
    },
  ])

  return res.status(200).send("successful push");
})

app.post('/close',async(_,res)=>{

  expo.sendPushNotificationsAsync([
    {
      to:'ExponentPushToken[-Ji6d1F69jCS1l4qGHB3Zw]',
      title:"LOCKER CLOSE",
      body:'Your locker has been closed by someone'
    },
  ])

  return res.status(200).send("successful push");
})
app.get('/test',async(_,res)=>{
  return res.status(200).send("success");
})


app.listen(port,()=> console.log(`running on Port ${port}`));
