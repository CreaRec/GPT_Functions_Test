# GPT_Functions_Test
## Install node:
```bash
npm install
```
## Set up environment variables with one of the following methods:
1) Provide environment variables by yourself
2) Create .env file in root directory and add the following:
```dotenv
OPENAI_API_KEY='<OPENAI api key>'
MQTT_URL='mqtt://localhost:1883'
```

NOTE: MQTT_URL is optional. If not provided, some command may not work.

## Run app:
```bash
node index.js
```