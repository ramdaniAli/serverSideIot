//declaration des modules 
var mysql = require('mysql');
var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

//declaration des constantes pour la connection au port serie
const port = new SerialPort('COM20', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

//declaration de variabes globales 
let sensorsData ;
var currentTime = new Date();

//connection au port serie
port.on("open", () => {
    console.log('serial port open');
  });

//lecture et envoie des données du port serie
parser.on('data', data =>{
  //lecture des données
    sensorsData = JSON.parse(data);
    console.log(sensorsData);

//connection a la base de données
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "258654147598753",
    database: "vtdash"
  });  

//envoie des données vers la base de données
  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      var sql = "INSERT INTO data (temp, hum, waterlvl, moisture , user_id , created_at ) VALUES ?";
      var values = [
          [
            sensorsData.Temperature ,
            sensorsData.Humidity , 
            sensorsData.Waterlvl , 
            sensorsData.Moisture , 
            sensorsData.Id , 
            currentTime 
          ],
      ] ;
      con.query(sql, [values], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
        });
    });
  
});  


