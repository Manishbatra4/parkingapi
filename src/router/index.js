const {Router} = require("express");
const router = Router();
const {nanoid} = require("nanoid")


const slots = [];
const maxSlot = process.env.MAX_SLOT;

/*
to run this endpoint
open postmaster
method: Post
url : http://localhost:5000/park
go to body -> row -> (select json)
copy =
    {
        "license": "DL46P3472"
    }
*/

router.post("/park",(req, res) => {

    //check if slot is less then 5 or not
    if (slots.length < maxSlot) {

        //check if license number is exist or not
        const isLicense = slots.find(a => a.license === req.body.license);
        if (isLicense !== undefined){
            res.send({
                status: false,
                error: "Licence Plate Number Already exist",
            })
            return false;
        }

        //find and assign a slot automatically
        let emptySlotArray = [];
        let emptySlot;
        slots.map(value => emptySlotArray.push(parseInt(value.slot)));
        for (let i = 1; i <= maxSlot; i++) {
            if (emptySlotArray.indexOf(i) === -1) {
                emptySlot = i;
                break;
            }
        }

        //slot already exist or not
        const isSlot = slots.find(a => a.slot === req.body.slot);
        if (isSlot === undefined){
            const parking = {
                id: nanoid(5),
                license: req.body.license,
                slot: emptySlot
            }
            slots.push(parking)
            res.send({
                status: true,
                data: parking
            })
        }
        else{
            res.send({
                status: false,
                error: "This Slot is Taken Try Another One"
            })
        }
    }else{
        res.send({
            status: false,
            error: "Slot Full No Space For New Car",
        })
    }
})


/*
to run this endpoint
open postmaster
method: Get
url : http://localhost:5000/slot
*/

router.get("/slot",(req, res) => {
    // display all the slots data
    res.send({
        data: slots
    });
})


/*
to run this endpoint
open postmaster
method: Get
url : http://localhost:5000/unpark
go to body -> row -> (select json)
copy =
    {
        "license": "DL46P3472"
    }
*/

router.get("/unpark",(req, res) => {
    let license = req.body.license;
    //check if slot have any car or not
    const isCar = slots.find(a => a.license === license);
    if (isCar !== undefined) {
        slots.splice(slots.findIndex(a => a.license === license), 1)
        res.send({
            status: true,
            data: slots
        })
    }else{
        res.send({
            status: false,
            error: "Car Not Found",
        })
    }
})


module.exports = router;
