//Connection Manager automagically reconnects to controller that have lost connection. Scanner auto initiated.

// const {ControllerManager} = require('st-ethernet-ip')

// const cm = new ControllerManager();

// //addController(ipAddress, slot = 0, rpi = 100, connected = true, retrySP = 3000, opts = {})
// const cont = cm.addController('192.168.0.10');

// cont.connect();


// //addTag(tagname, program = null, arrayDims = 0, arraySize = 0x01)
// cont.addTag('Tag_1')

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

// const { Controller } = require("st-ethernet-ip");

// const PLC = new Controller();

// // Controller.connect(IP_ADDR[, SLOT])
// // NOTE: SLOT = 0 (default) - 0 if CompactLogix
// PLC.connect("172.16.0.24",0).then(() => {
//     console.log(PLC.properties);
// }).catch((error)=>{
//     console.log('something went wrong...')
//     console.log(error);
// });


// `Uses the same method as RsLinx to detect if device is on the network`
// const { Browser } = require("st-ethernet-ip");

// const browser = new Browser(originatorPort=2222, originatorIPaddress='172.16.0.24');

// browser.on("Broadcast Request", ()=>{
//     console.log('Broadcast Request');
// });

// //When new device is detected
// browser.on("New Device", device => {
//     //Display all device info
//     console.log(device);
//     //Display Device IP address
//     console.log(device.socketAddress.sin_addr);
//     //Display Device Description
//     console.log(device.productName)
// });

// //when device is not detected after x amount of scans
// browser.on("Device Disconnected", device => {
//     // 'device' is the disconnected device
//     console.log('Device Disconnected');
// });


// const { IO } = require("st-ethernet-ip")

// const scanner = new IO.Scanner(); // Iinitalize new scanner on default port 2222

// // device configuration from manufacturer.
// const config = {
//   // configInstance: {
//   //   assembly: 10,
//   //   size: 0
//   // },
//   outputInstance: {
//     assembly: 100,
//     size: 400
//   },
//   inputInstance: {
//     assembly: 101,
//     size: 240
//   }
// }

// // Add a connection with (device config, rpi, ip_address)
// const conn = scanner.addConnection(config, 100, '192.168.0.10')

// // After first UDP packet is received
// conn.on('connected', () => {
//   console.log('Connected')
//   console.log('input data => ', conn.inputData) // Display Input Data Buffer.
  
//   console.log('output data => ', conn.outputData) // Display Output Data Buffer.
//   // Create alias for bits and integers (can be named what ever you want)
//   // conn.addOutputBit(4, 0, 'out0') // Using outputData. Skip 4 bytes, use bit 0 and call it 'out0'
//   // conn.addOutputBit(4, 1, 'out1') // Skip 4 bytes, use bit 1 and call it 'out1'
//   // conn.addOutputInt(2, 'outputValue0') // Skip 2 bytes then use 16bit integer and call it 'value0'
//   // conn.addInputBit(4, 7, 'in7') // Skip 4 bytes then use bit 7 and call it 'in7'
//   // conn.addInputInt(2, 'inputValue0')
//   // // Set values to be written to devices
//   // conn.setValue('out0', true) 
//   // conn.setValue('out1', false)
//   // conn.setValue('value0', 1234)
//   // // Read values from device connection
//   // console.log(conn.getValue('in7'))
//   // console.log(conn.getValue('inputValue0'))
// })

// // Called when UDP packets are not receiving. (Timeout is based on rpi setting)
// conn.on('disconnected', () => {
//   console.log('Disconnected')
// })
const net = require("net");
const {header} = require("st-ethernet-ip/src/enip/encapsulation");

const server = net.createServer((socket)=>{
  console.log("connected");
  socket.on("data", (data)=>{
    console.log("data received: "+Buffer.isBuffer(data));
    if(Buffer.isBuffer(data)){
      const encapsulatedData = header.parse(data);
      const {commandCode, statusCode} = encapsulatedData;

      if(commandCode===0x65){
        let registerSession = header.build(0x65,0x1234,[0x01,0x00,0x00,0x00]);
        socket.write(registerSession);
        console.log(registerSession);
      }

      console.log(commandCode, statusCode);
    }
  })
});

server.listen(44818, ()=>{
  console.log('server bound');
});

server.on("connection", ()=>{
  console.log("client requests connetion");
});





// const {EthernetIP} = require("st-ethernet-ip");

// console.log(EthernetIP);

// EthernetIP.on("Session Registered", (id)=>{
//   console.log(id);
// });