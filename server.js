
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var io = require('socket.io');
var app = module.exports = express.createServer();
var io = io.listen(app);

//Serial port
//var serialport = require('serialport');
//var portName = '/dev/tty.usbmodemfa131';
//var sp = new serialport.SerialPort(portName,{
//	baudRate: 9600,
//	dataBits: 8,
//	parity: 'none',
//	stopBits: 1,
//	flowControl: false,
//	parser: serialport.parsers.readline("\n")
//});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/',routes.index);
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


var usersound = {};
//socket.io code
io.sockets.on('connection', function (socket) {
	socket.emit('news_event',{event_code : 'websocket is ready for '+socket.id});

	var soundId = Math.floor(Math.random()*3)+1;
	usersound[socket.id] = soundId;
	console.log(usersound);

	socket.emit("image_event",usersound[socket.id]);
	socket.broadcast.emit("desktop_image_event",usersound[socket.id]);

	socket.on('x_snare',function(data){
		socket.broadcast.emit('x_snare',usersound[socket.id]);
	});

	socket.on('gyro_val',function(data){
		socket.broadcast.emit('gyro_val',{x_val : data["x_val"], y_val : data["y_val"],z_val : data["z_val"]});
	});

	socket.on('disconnect', function () {
	 //  var flag = 1;
	 //  for(var sokid in usersound)
		// {
	 //      if(usersound[sokid] == usersound[socket.id])
	 //   	   {
	 //   	   	flag = 0;
  // 		    }
		// }
		// if(flag == 1){
	 //		socket.broadcast.emit("desktop_refresh",usersound[socket.id]);
 	 // 	}
		socket.broadcast.emit("desktop_refresh",usersound[socket.id]);
	 	//delete usersound[socket.id];
	 	console.log(usersound);
	});
});