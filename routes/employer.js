const { Router } = require("express");
const category = require("../model/category");
const products = require("../model/products");
const Employer = require("../model/Employer");
const bcrypt = require('bcrypt');

const router = Router();

router.get("/allList", (req, res) => {
  Employer.find().then((data) => {
    return res.json(data);
  });
});

router.get("/allList/:id", (req, res) => {
  Employer.findById(req.params.id).then((data) => {
    return res.json(data);
  });
});

router.post("/addemployer", (req, res) => {
  const { fish, login, password, description,tel} = req.body;
  try {
    if (!fish || !login || !password) {
      return res.json({ error: "To`liq ma`lumot bering" });
    } else {
      Employer.findOne({ login }).then((data) => {
        if (data) {
          return res.json({ error: "bu username allaqachon band" });
        } else {
          bcrypt.hash(password, 10).then((hashed) => {
            Employer.create({
              fish,
              description,
              tel,
              login,
              password: hashed,
              role:{
                roles:[req.body.role]
              },
              assign_time:Date.now()
            })
              .then((data) => {
                return res.json({
                  msg: "Muvaffaqiyatli amalga oshirildi",
                  data,
                });
              })
              .catch((e) => console.log(e));
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/editUser/:id',(req,res)=>{
  Employer.findById(req.params.id)
    .then(data=>{
      if(data){
        return res.json(data)
      }else{
        return res.status(401).json({error:"Xatolik"})
      }
    })
}) // edit uchun 1 ta user topiladi

//---- role bilan bo`lgan muammoni yechish kerak---///
router.put('/editUser/:id',(req,res)=>{
  const {fish,description,tel,login,assign_time,role} = req.body;
  try {
 Employer.findOne({_id:req.params.id})  
  .then(user=>{
    if(!user){
      return res.status(406).json({error:"Xatolik"})
    }else{
      console.log(fish,description,tel,login,assign_time,role);
    user.fish = fish,
    user.description = description,
    user.tel = tel,
    user.login = login,
    user.assign_time = assign_time ? assign_time : Date.now(),
    user.role = {roles:[role]}
    user.save();
 
    return res.json(user)
  }

  })     
    
  } catch (error) {
    console.log(error);
  }
}) // employees ni o`zgartiradi ammo login uchun middleware yozish zarur

router.delete("/remove_item/:id",(req,res)=>{
  try {
    Employer.findByIdAndDelete(req.params.id)
      .then(data=>{
        if(data){
          return res.json(data)
        }else{
          return res.status(404).json({error:"Xatolik"})
        }
      })
  } catch (error) {
    console.log(error);
  }
})
module.exports = router;
