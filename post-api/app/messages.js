const express = require('express');

const db = require('../fileDb');

const router = express.Router();

router.get('/', (req, res) => {
  const messages = db.getItems();
  const newArray = messages.slice(messages.length - 30);
  return res.send(newArray);
});

router.get('/', (req, res) => {

  const date = req.query.datetime;
    const messages = db.getItems();

  if (!date) {
    return res.send([]);
  } else if(isNaN(date.getDate())){
    return res.send({message: "Date is wrong"});
  } else if(date){
    const newAr = messages.slice(req.query);
    res.send(newAr);
  }

})

router.post('/', async (req, res, next) => {
  try {
    if(!req.body.author || !req.body.message){
      return res.status(400).send('Data is incomplete!');
    }

    const post = {
      author: req.body.author,
      message: req.body.message,
    }

    await db.addItem(post);

    return res.send({id: post.id, author: post.author, message: post.message, datetime: post.datetime});

  } catch (e) {
    next(e);
  }


});

module.exports = router;