const mqtt = require('mqtt');
const util = require('util');

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://192.168.86.184:1883');

client.on('connect', function () {
	console.log('Connected to MQTT broker');

	// Subscribe to the topic that lists all devices
	client.subscribe('zigbee2mqtt/bridge/devices');
});

client.on('message', function (topic, message) {
	// Check if it's the correct topic
	if (topic === 'zigbee2mqtt/bridge/devices') {
		const devices = JSON.parse(message.toString());
		// console.log('Devices:');
		// console.log(util.inspect(devices, { showHidden: false, depth: null, colors: true }));

		let fingerbot = devices.find(device => device.ieee_address === '0x282c02bfffe6b844');
		console.log('Exposes:');
		fingerbot?.definition.exposes.forEach(expose => {
			console.log(util.inspect(expose, { showHidden: false, depth: null, colors: true }));
		});

		// Optionally, print devices in a more readable format
		devices.forEach(device => {
			console.log(`Device ID: ${device.ieeeAddr} - Model: ${device.model} - Friendly Name: ${device.friendly_name}`);
		});

		client.end(); // Close the connection after receiving the data
	}
});

client.on('error', function (error) {
	console.log('MQTT Client Error:', error);
});
