const mqtt = require('mqtt');
require('dotenv').config();
// const readline = require('readline');
//
// // Create a readline interface for console input
// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// });

let client;

if (!process.env.MQTT_URL) {
// Connect to the MQTT broker
	client = mqtt.connect(process.env.MQTT_URL);

	client.on('connect', () => {
		console.log('Connected to MQTT broker');
		// console.log('Type "ON", "OFF", or "TOGGLE" to control socket:');
	});

	client.on('error', (error) => {
		console.log('Error:', error);
	});
}

// Function to send a command to the fingerbot
function sendSwitchCommand(action) {
	const topic = 'zigbee2mqtt/Night bug/set';
	const message = JSON.stringify({ state: action });

	if (!client) {
		console.log('MQTT client not initialized');
		return;
	}
	client.publish(topic, message, () => {
		console.log(`Sent '${action}' command to socket`);
	});
}

// Listen for console input and trigger actions based on the input
// rl.on('line', (input) => {
// 	input = input.trim().toUpperCase();
// 	if (['ON', 'OFF', 'TOGGLE'].includes(input)) {
// 		sendSwitchCommand(input);
// 	} else {
// 		console.log('Invalid command. Please type "ON", "OFF", or "TOGGLE".');
// 	}
// });

module.exports = { sendSwitchCommand };