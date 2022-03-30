const express = require('express')
const app = express()
const db = require('./database')


app.use(express.json())

app.use(express.urlencoded())

app.set('view engine','ejs')

app.use(express.static('./public'))


app.get('/',  async(req, res) => {  
    let wyniki 
 
  try{
      
        wyniki = await db.promise().query(`SELECT * FROM user`)
  }
  catch(err){
      console.log(err)
  }

  console.log(wyniki[0])


    res.render('index')


})

app.listen(3000)