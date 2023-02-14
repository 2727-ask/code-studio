const express = require('express')
const app = express()
const port = 3000
const dependancy = require('./inject/dependancy');
dependancy(app);




app.get('/', (req, res) => {
    res.sendFile(__dirname + "/ui/index.html");
})

app.listen(port, () => {
  console.log(`Code Studio listening on port ${port}`)
})