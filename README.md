# EIPWebServer
Build a device to communicate with PLC or other device via EtherNet/IP and fetch data from web server.



## Snapshot from WireShark

The procedures to establish an implicit messaging between master and client devices are as shown below:

* **Register Session**

* **Forward Open**

* **Start Messaging**

  

  ![alt Implicit massaging wireshark screenshot](/images/ImplicitMessagingSnapshot.png)



*Register Session* (CMD: 0x65)

The session handle value is used to identify messages sent between two devices that use this session. Client device send RegisterSession request to master, once master receives the request, then it further creates a Session Handle and returns in the RegisterSession reply.

![encapsulation packet structure](/images/EncapsulatePacketStructure.png)



*Forward Open* (CMD: 0x6F, )



# References

1.  [CIP.pdf](/manuals/CIP.pdf)
2. 



