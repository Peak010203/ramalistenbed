const axios = require('axios');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const cron = require('node-cron');
require('dotenv').config();

dayjs.extend(utc);
dayjs.extend(timezone);

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const TO_USER_ID = process.env.TO_USER_ID;

async function sendImageByTimestampToLine() {
  try {
    const bangkokDate = dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD');
    let imageSent = false;

    for (let sec = 0; sec <= 10; sec++) {
      const paddedSec = sec.toString().padStart(2, '0');
      const timestamp = dayjs.tz(`${bangkokDate}T18:00:${paddedSec}`, 'Asia/Bangkok');
      const unixTimestamp = Math.floor(timestamp.valueOf() / 1000);
      const fileName = `${unixTimestamp}.png`;
      const imageUrl = `https://www5.ra.mahidol.ac.th/neuro/notify/line/imagefile/${fileName}`;

      const checkResponse = await axios.get(imageUrl, { validateStatus: () => true });

      if (checkResponse.status === 200) {
        const message = {
          to: TO_USER_ID,
          messages: [
            {
              type: "image",
              originalContentUrl: imageUrl,
              previewImageUrl: imageUrl
            }
          ]
        };

        await axios.post(
          'https://api.line.me/v2/bot/message/push',
          message,
          {
            headers: {
              'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('✅ ส่งภาพสำเร็จ:', imageUrl);
        imageSent = true;
        break;
      } else {
        console.log(`⏩ ยังไม่พบภาพ: ${imageUrl}`);
      }
    }

    if (!imageSent) {
      const fallbackMessage = {
        to: TO_USER_ID,
        messages: [
          {
            type: "text",
            text: "❌ ไม่พบภาพจากช่วงเวลา 18:00:00 ถึง 18:00:10"
          }
        ]
      };

      await axios.post(
        'https://api.line.me/v2/bot/message/push',
        fallbackMessage,
        {
          headers: {
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📭 ส่งข้อความแจ้งว่าไม่พบภาพ');
    }

  } catch (error) {
    console.error('⚠️ เกิดข้อผิดพลาด:', error.message);
  }
}

// รันทุกวันเวลา 18:01 (เวลาไทย) = 11:01 UTC
cron.schedule('* * * * *', () => {
  console.log(`[${new Date().toISOString()}] Running scheduled job...`);
  sendImageByTimestampToLine();
});
