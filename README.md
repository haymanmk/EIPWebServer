# EIPWebServer
Build a device to communicate with PLC or other device via EtherNet/IP and fetch data from web servers.



## Introduction

The [ethernet-ip](https://github.com/cmseaton42/node-ethernet-ip.git) is implemented here. But this package does not serve as the target, there are major two roles defined in EtherNet/IP, which are **Originator** and **Target**. **Originator** starts the request to create a connection with **Target**. In a nutshell, this module will bring up a request to build a connection with target instead of waiting for the request from other devices. When it comes to **implicit messaging** or so-called **I/O messaging**, it requires a few steps of hand shaking before a communication is created. And when the devices both serve as originators, then they might be unable to fulfill the connection request from others. Taking Keyence PLC for instance, it does not provide the function for users to configure PLC's EIP connection objects, so whenever it receives the requests, it will further respond a failure message to inform originators that it cannot find any connection objects in its configuration related to what originator aims to connect. According to this issue, we need to develop another layer of functions on top of **ethernet-ip** to make our host device as a target rather than just an originator.

 

## <a name="implicit_massaging"></a>Implicit Messaging

Before we dive into talking about what can we do with EtherNet/IP and how to work with it, I want to show you the power of implicit communication. In general, when packets are transfered through TCP, each transfers will require an ACK response from the receiver to acknowledge it receives the data. By doing so, it provides a reliable communication but sacrifices the speed. On the other hand, when data is transfered via UDP, it no longer needs the ACK response which means the originator who send the packet will not wait for the response from the receiver, and it can continue on the next transfer. In addition, the header carried on UDP packet is restricted to 8 bytes long, unlike TCP which can vary from 20 bytes to 60 bytes, so UDP is more lightweight and faster than TCP is. Before you move into next topic, take a look at the following snapshot recorded by **Wireshark**, the packets labeled as **CIP I/O** are transfered via UDP and no ACK responses showing up in between each **CIP I/O** packets.

### Steps to Establish

The main procedures to establish an implicit messaging between server and client are as shown below:

* [**Register Session**](#register_session)

* [**Forward Open**](#forward_open)

* [**Start Messaging**](#start_messaging)

  

  ![alt Implicit massaging wireshark screenshot](/images/ImplicitMessagingSnapshot.png)



### <a name="register_session"></a>Register Session (CMD: 0x65)

The **Session Handle** as shown in the encapsulation header is an identifier used to mark the packets sent between devices in the same session. Originator sends a **RegisterSession** command to target, once target receives the request, then it further creates a Session Handle and returns a **RegisterSession** reply back to Originator to indicate that it has registered a session for Originator.

![encapsulation packet structure](/images/EncapsulatePacketStructure.png)



### <a name="forward_open"></a>Forward Open (CMD: 0x6F, Class: 0x06, InstanceID: 0x01)

To access **Forward open** service in Connection Manager Instance, **SendRRData** command is chosen, and encapsulate the necessary information like *Type ID*(0xB2, UCCM), Object Instance *Service Code*(0x54, ForwardOpen) and *Path segments with required parameters as a payload.

> *Path is composed of different segments each segment is encoded with different purposes like specifying target class, instance ID, and attribute.



### <a name="start_messaging"></a>Start Messaging

After above steps all finished, ether target or originator will repeatedly send data every **RPI** microseconds via UDP. RPI is in short of **Requested Packet Interval** which is the requested time between packets in microseconds.



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



### EPATH

[ref.2-pc-7] In order to specify the relationship among different objects, a value used to specify this relationship is **PATH**. A path attributes consists of multiple segments and has a data type **EPATH**. And the encoding for each segments is described as below.

* **Port segment** – used for routing from one subnet to another
* **Logical segment** - logical reference information (such as class/instance/attribute IDs)
* **Network segment** - specifies network parameters needed to transmit on a some networks
* **Symbolic segment** - symbolic name
* **Data segment** - embedded data (such as configuration data) 



#### Path Attribute

![alt example path attribute](/images/ExamplePathAttribute.png)



#### Path Segment Structure

![alt path segment structure](/images/PathSegmentStructure.png)

> The meaning of the **Segment Format** bits is based on the specified **Segment Type**. 



#### Logical Segment

The logical segment selects a particular object address within a device (for example, Object
Class, Object Instance, and Object Attribute). 

![alt logical segment encoding](/images/LogicalSegmentEncoding.png)



#### Example

![alt example epath](/images/ExampleEPATH.png)




> Why routing to Instance 1 which is an instance of connection manager class? I guess its a predefined value. For DeviceNet protocol, there is a predefined master/slave connection set. And it lists a series of predefined connection set in [ref.1-p44].
>
> ![alt predefined connection set](/images/PredefinedConnectionSetDeviceNet.png)









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



