const express = require("express");
const router = express.Router();
require("../../db/conn");
const Instrument = require("../../models/Instruments/instrumentSchema");
const axios = require('axios');
const fetchToken = require("../../marketData/generateSingleToken");



router.post("/instrument", async (req, res)=>{

    try{
        const {instrument, exchange, symbol, status, uId, createdOn, lastModified, createdBy, lotSize} = req.body;
        console.log(req.body);

        let instrumentToken = await fetchToken(exchange, symbol);
        console.log(instrumentToken);
        if(!instrument || !exchange || !symbol || !status || !uId || !createdOn || !lastModified || !createdBy || !lotSize || !instrumentToken){
            console.log(instrumentToken);
            console.log(req.body);
            console.log("data nhi h pura");
            return res.status(422).json({error : "Any of one feild is incorrect..."})
        }
    
        Instrument.findOne({uId : uId})
        .then((dateExist)=>{
            if(dateExist){
                console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }
            const instruments = new Instrument({instrument, exchange, symbol, status, uId, createdOn, lastModified, createdBy, lotSize, instrumentToken});
            console.log("instruments", instruments)
            instruments.save().then(()=>{
                res.status(201).json({massage : "data enter succesfully"});
            }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        }).catch(err => {console.log(err, "fail")});

    } catch(err) {
        res.status(500).json({error:"Failed to enter data Check access token"});
        return new Error(err);
    }
})

router.get("/readInstrumentDetails", (req, res)=>{
    Instrument.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readInstrumentDetails/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    Instrument.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readInstrumentDetails/:id", async (req, res)=>{
    console.log(req.params)
    console.log( req.body)
    const {Exchange, Symbole} = req.body;
    
    // const token = 1232444;
    // console.log(token, req.body)
    try{ 
        const {id} = req.params
        const token = await fetchToken(Exchange, Symbole);
        const instrument = await Instrument.findOneAndUpdate({_id : id}, {
            $set:{ 
                instrument: req.body.Instrument,
                exchange: req.body.Exchange,
                symbol: req.body.Symbole,
                status: req.body.Status,
                lastModified: req.body.lastModified,  
                lotSize: req.body.LotSize,
                instrumentToken: token,
            }
        })
        console.log("this is role", instrument);
        res.send(instrument)
    } catch (e){
        res.status(500).json({error:"Failed to edit data Check access token"});
    }
})

router.delete("/readInstrumentDetails/:id", async (req, res)=>{
    console.log(req.params)
    try{
        const {id} = req.params
        const instrument = await Instrument.deleteOne({_id : id})
        console.log("this is userdetail", instrument);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }
})

module.exports = router;