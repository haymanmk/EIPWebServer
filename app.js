// //Connection Manager automagically reconnects to controller that have lost connection. Scanner auto initiated.

// const {ControllerManager} = require('st-ethernet-ip')

// const cm = new ControllerManager();

// //addController(ipAddress, slot = 0, rpi = 100, connected = true, retrySP = 3000, opts = {})
// const cont = cm.addController('172.16.0.10');

// cont.connect();

// //addTag(tagname, program = null, arrayDims = 0, arraySize = 0x01)
// cont.addTag('TheInteger')

// cont.on('TagChanged', (tag, prevValue) => {
//   console.log(tag.name, ' changed from ', prevValue, ' => ', tag.value)
// })

// cont.on('error', (e) => {
//   console.log(e)
// })


// const { Socket, isIPv4 } = require("net");

// let socket = new Socket();
// socket.connect(5000, '172.16.0.10', ()=>{
//     console.log('server connecting');
// });

// socket.on('data', (data) => {
//     console.log(data.toString());
// })

const { Controller } = require("st-ethernet-ip");

const PLC = new Controller();

// Controller.connect(IP_ADDR[, SLOT])
// NOTE: SLOT = 0 (default) - 0 if CompactLogix
PLC.connect("172.16.0.10", 0).then(() => {
    console.log(PLC.properties);
});