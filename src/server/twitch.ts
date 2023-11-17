/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import tmi from 'tmi.js';
import { env } from '~/env.mjs';

const botUsername =
  env.NODE_ENV === "production" ? "pepega_bot21" : "opti_21";

const twitchClient = new tmi.Client({
	options: { debug: true },
	identity: {
		username: botUsername,
		password: env.TWITCH_PASS
	},
	channels: [ 'officedrummer' ]
});
twitchClient.connect().catch(console.error);
twitchClient.on('message', (channel, tags, message, self) => {
    console.log(message);
	if(message.toLowerCase() === '!hello') {
		twitchClient.say(channel, `@${tags.username}, heya!`);
	}
});

export default twitchClient;