# EIPWebServer
Build a device to communicate with PLC or other device via EtherNet/IP and fetch data from web server.



## Snapshot from WireShark

The procedures to establish an implicit messaging between server and client devices are as shown below:

* **Register Session**

* **Forward Open**

* **Start Messaging**

  

  ![alt Implicit massaging wireshark screenshot](/images/ImplicitMessagingSnapshot.png)



*Register Session* (CMD: 0x65)

The session handle value is used to identify messages sent between two devices that use this session. Client device send RegisterSession request to server, once master receives the request, then it further creates a Session Handle and returns in the RegisterSession reply.

![encapsulation packet structure](/images/EncapsulatePacketStructure.png)



*Forward Open* (CMD: 0x6F, )



## Communication Object Class

The Communication Object Classes are defined by describing:

* Object Class Attributes

* Object Class Services

* Object Instance Attributes

* Object Instance Services

* Object Instance Behavior 

Each CIP connection is represented by a Connection Object (Class code 0x05).

### Creation of Communication Object

The creation of this **communication object** resource can be done in one of two ways. 

* Use of the **Create service** (Service code 0x08) for the **Connection Object**(Class code 0x05) [ref.2-p3-10]
* Use of the **Forward Open service**(Service code 0x4E) for the **Connection Manager Object**(Class code 0x06) [ref.3-p3-53]



## Encapsulation Packet Structure

The total encapsulation messages length shall be limited to 65535 bytes. [ref.3-p2-4]

![alt field explanation of encapsulation packet](/images/EncapsulatePacketFieldExplanation.png)



## Command Code

[ref.3-p2-5]

![alt command field](/images/EncapsulateCommandField.png)



## Register Session

[ref.3-p2-12] An originator shall send a RegisterSession command to a target to initiate a session. 

![alt registersession request](/images/RegisterSessionRequest.png)

![alt registersession reply](/images/RegisterSessionReply.png)

### Examples

* Request

![alt request](/images/RegisterSessionRequestScreenshot.png)



* Reply

![alt reply](/images/RegisterSessionReplyScreenshot.png)


## SendRRData

[ref.3-p2-17] A SendRRData command shall transfer an encapsulated request/reply packet between the
originator and target, where the originator initiates the command. 

![alt sendrrdata request](/images/SendRRDataRequest.png)

![alt sendrrdata reply](/images/SendRRDataReply.png)



## Common Packet Format

[ref.3-2-22] 
![alt common packet format](/images/CommonPacketFormat.png)
![alt common packet format typeid table1](/images/CommonPacketFormatTypeIDTable1.png)
![alt common packet format typeid table1](/images/CommonPacketFormatTypeIDTable2.png)



## Common Industrial Protocol

[ref.3-p3-3] This chapter, Common Industrial Protocol (**CIP**), documents the encapsulation of the UCMM(vis TCP) and connected packets(via UDP).

### CIP Packet over TCP/IP
When the path of a CIP packet traverses an Ethernet-TCP/IP network, the encapsulated packet
shall be transmitted using the TCP/IP protocol suite and the encapsulation protocol.

#### Unconnected Messages
![alt ucmm request](/images/UCMMRequest.png)

![alt ucmm request](/images/UCMMReply.png)



### Message Router Formats

[ref.2-p2-10] **CIP** defines a standard data format for delivering data to and from the **Message Router object**. 

![alt message router request](/images/MessageRouterRequestFormat.png)

![alt message router request](/images/MessageRouterReplyFormat.png)



## Connection Manager Object Class	(Class Code: 0x06)

[ref.2-p3-53] 



### Object Instance Object Specific Services

![alt connection manager object instances object specific services](/images/ConnectionManagerObjectInstanceSpecificServices.png)



### Object Specific Service Parameters

For the detailed information about all the parameters, refer to [ref.2-p3-57].

>  The **Forward_Open**, **Large_Forward_Open** and **Forward_Close** services shall be sent using the
>  **UCMM** or an unbridged (local) explicit messaging connection only.
>   
> ![alt cip device object model](/images/CIPDeviceObjectModel.png)


# References

1.  [COMMON INDUSTRIAL PROTOCOL (CIP™) AND THE FAMILY OF CIP NETWORKS](/manuals/CIP.pdf)
2.  [THE CIP NETWORKS LIBRARY, Volume 1, Common Industrial Protocol (CIP™)](/manuals/CIP%20Vol1_3.3.pdf) 
3. [THE CIP NETWORKS LIBRARY, Volume 2, EtherNet/IP Adaptation of CIP](/manuals/CIP%20Vol2_1.4.pdf) - *Main Reference for EIP*



