const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Client = require('./models/Client');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Hydration reminder every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('🚰 Sending hydration reminders...');
  const clients = await Client.find();
  for (const client of clients) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: '💧 Drink Water Reminder!',
      text: 'Time to drink a glass of water! Stay hydrated.'
    });
    console.log(`Sent hydration email to ${client.email}`);
  }
});

// ✅ Meal + workout reminders every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hh}:${mm}`;

  const clients = await Client.find();
  for (const client of clients) {
    if (client.mealSchedule.includes(currentTime)) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: client.email,
        subject: '🍽️ Meal Reminder',
        text: `Hi ${client.name}, it's time for your meal!`
      });
      console.log(`Sent meal reminder to ${client.email}`);
    }

    if (client.workoutSchedule.includes(currentTime)) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: client.email,
        subject: '🏋️ Workout Reminder',
        text: `Hi ${client.name}, time for your workout!`
      });
      console.log(`Sent workout reminder to ${client.email}`);
    }
  }
});
