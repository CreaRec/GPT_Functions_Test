require('dotenv').config();
const { OpenAI } = require("openai");
const readline = require('readline');
const {sendSwitchCommand} = require("./indexSwitchSocket");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


const client = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

async function fetchGPTResponse(message) {
	const runner = client.beta.chat.completions
		.runTools({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: message }],
			tools: [
				{
					type: 'function',
					function: {
						function: getCurrentLocation,
						parameters: { type: 'object', properties: {} },
					},
				},
				{
					type: 'function',
					function: {
						function: getWeather,
						parse: JSON.parse,
						parameters: {
							type: 'object',
							properties: {
								location: { type: 'string' },
							},
						},
					},
				},
				{
					type: 'function',
					function: {
						function: sumNumbers,
						parse: JSON.parse,
						parameters: {
							type: 'object',
							properties: {
								num1: { type: 'number' },
								num2: { type: 'number' },
							},
						},
					}
				},
				{
					type: 'function',
					function: {
						function: switchSocketFunction,
						description: 'Switches/toggles a socket on or off',
						parse: JSON.parse,
						parameters: {
							type: 'object',
							properties: {
								action: { type: 'string', enum: ['ON', 'OFF', 'TOGGLE'] },
							},
						},
					}
				},
			],
		})
		// .on('message', (message) => console.log(message));

	const finalContent = await runner.finalContent();
	// console.log();
	// console.log('Final content:', finalContent);
	return finalContent;
}

const askQuestion = (prompt) => {
	return new Promise((resolve) => {
		rl.question(prompt, (input) => resolve(input));
	});
};
async function main() {
	while (true) {
		const userInput = await askQuestion("You: ");
		if (userInput.toLowerCase() === "exit") {
			rl.close();
			break;
		}
		const response = await fetchGPTResponse(userInput);
		console.log("ChatGPT:", response);
	}
}

async function getCurrentLocation() {
	console.log('Getting current location');
	return 'Boston'; // Simulate lookup
}

async function getWeather(args) {
	console.log('Getting weather for:', args);
	const { location } = args;
	// … do lookup …
	let temperature = '50degF';
	let precipitation = 'high';
	return { temperature, precipitation };
}

const sumNumbers = (args) => {
	const { num1, num2 } = args;
	console.log(`Calculating sum of ${num1} and ${num2}`);
	return num1 + num2;
};

const switchSocketFunction = (args) => {
	sendSwitchCommand(args.action);
}

main();