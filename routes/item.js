//Route module for handeling queries regarding items
const mongoose = require('mongoose')
const express = require('express');
const route = express.Router();
const fileUpload = require('express-fileupload');
const Item = require('../db/models').itemModel;
const User = require('../db/models').userModel;
// const imageFolder = require('../staticFolderConfig');
const fs = require('fs');
//API handlers
const { uploadToCloudinary, parseImage, removeFromCloudinary } = require('../config/cloudinary-config')

//GET Handlers:      
//GET all items:
route.get('/', (req, res, next) => {
    Item.find({})
        .sort({ date: 'desc' })
        .select('title price images')
        .then((item) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.status(200).send(item);
        })
        .catch(next);
});


//GET Items from Search Bar(name):                  
route.get('/search', (req, res, next) => {
    let items = [];
    const { name } = req.query;

    Item.find({ title: { $regex: name, $options: 'i' } })
        .select('title price images')
        .then((item) => {
            items = items.concat(item);
            Item.find({ categories: { $regex: name, $options: 'i' } })
                .select('title price images')
                .then((item) => {
                    items = items.concat(item);
                    Item.find({ description: { $regex: name, $options: 'i' } })
                        .select('title price images')
                        .then((item) => {
                            items = items.concat(item);
                            res.header("Access-Control-Allow-Origin", "*");
                            res.send(items);

                        })
                        .catch(next);

                })
                .catch(next);
        })
        .catch(next);

});



//----------------------------------------------------//
//GET Items from Filters:                           
route.get('/filter', (req, res, next) => {
    Item.find(req.query)
        .select('title price images')
        .then((item) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.status(200).send(item);
        })
        .catch(next);
});


//GET Item details:                             
route.get('/:id', (req, res, next) => {
    Item.findById(req.params.id)
        .select('title description date price userName images userEmail')
        .then((item) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.status(200).send(item)
        })
        .catch(next);
});



//---------------------------------------------------------------------------//

//POST AN ITEM
//Middleware:
route.use(fileUpload());
//POST Handler:
route.post('/', parseImage, async (req, res, next) => {
    try {
        const { body } = req;
        let setCategories = [];
        let index = 0;
        for (let key of Object.keys(body)) {
            var value = body[key];
            if (value == 'on') {
                setCategories[index] = key;
                index++;
            }
        }
        let imageLinks = [];

        for (let encoded of req.files.encodedUri) {
            let uploadedUrl = await uploadToCloudinary(encoded)
            imageLinks.push(uploadedUrl.url);
        }

        const itemBody = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            categories: setCategories,
            userID: req.body.userID,
            images: imageLinks
        }
        Item.create(itemBody)
            .then((item) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.status(201).send(item);


            })
            .catch(next);
    } catch (err) {
        next(err);
    }
});

//--------------------------------------------------------------------------//
//Send a Buy-Sell Notification 
route.put('/notify/:id', (req, res, next) => {
    Item.findById(req.params.id)
        .select('userID userName')
        .then((item) => {
            User.findOne({
                _id: item.userID,
                notifications: {
                    $elemMatch: {
                        message: req.body.notification.message,
                        userEmail: req.body.notification.userEmail
                    }
                }
            })
                .then(item1 => {
                    if (item1 != null) {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.status(200).send(`Already notified ${item.userName}`);
                    } else {
                        req.body.notification._id = new mongoose.Types.ObjectId();
                        User.updateOne({ _id: item.userID },
                            { "$push": { "notifications": req.body.notification } },
                        )
                            .then(() => {
                                res.header("Access-Control-Allow-Origin", "*");
                                res.status(200).send(`Notified ${item.userName}`);
                            })
                            .catch(next);

                    }
                })
        })
        .catch(next);
})



//Edit a posted item                               
route.put('/:id', (req, res, next) => {
    Item.updateOne({ _id: req.params.id }, req.body)
        .then(
            Item.findById(req.params.id)
                .then((item) => {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.status(200).send(`Your Ad, ${item.name} has been updated`);
                })
        )
        .catch(next);
});

//-------------------------------------------------------------------------//


//Delete a posted item                              
route.delete('/:id', (req, res, next) => {
    // Item.findById(req.params.id)
    //     .select('images')
    //     .then(item => {
    //         for (let image of item.images) {
    //             removeFromCloudinary(image);
    //         }
    //     });
    Item.deleteOne({ _id: req.params.id })
        .then(() => {

            res.header("Access-Control-Allow-Origin", "*");
            res.status(200).send(`Your Ad has been removed`);
        })
        .catch(next);
});



module.exports = route;