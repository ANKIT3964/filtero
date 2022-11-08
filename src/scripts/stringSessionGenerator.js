import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import input from 'input'; // npm i input

const generateSession = async () => {
  const apiId = await input.text('Please enter your APP ID: ');
  const apiHash = await input.text('Please enter your API Hash: ');
  const stringSession = new StringSession('');

  const client = new TelegramClient(stringSession, parseInt(apiId), apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () =>
      await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err),
  });
  console.log(
    'You should now be connected. Check your saved messages for User Session',
  );
  console.log(client.session.save()); // Save this string to avoid logging in again
  await client.sendMessage('me', { message: client.session.save() });
};

(async () => {
  await generateSession();
})();
