export default function handler(req, res) {
  // Grab the query parameters sent by the Vue frontend
  const { prefecture, station } = req.query;

  // In the future, this is where you'd securely call a real transit API
  // using process.env.API_KEY. For now, we return dynamic mock data.
  
  let data = {};

  if (station === 'shinjuku') {
    data = {
      time: '14:30',
      track: '12',
      type: { jp: '中央特快', en: 'Chuo Special Rapid' },
      destination: { jp: '高 尾', en: 'Takao' },
      info: { 
        jp: 'まもなく12番線に電車が参ります。', 
        en: 'Train approaching track 12.' 
      }
    };
  } else {
    // Default to Kobe/Takarazuka data
    data = {
      time: '11:46',
      track: '3',
      type: { jp: '普通', en: 'Local' },
      destination: { jp: '宝 塚', en: 'Takarazuka' },
      info: { 
        jp: 'ご案内 ・・・宝塚へは快速急行宝塚電車にご注意ください', 
        en: 'Train approaching. Please stand behind the yellow line.' 
      }
    };
  }

  // Send the data back as JSON with a 200 OK status
  res.status(200).json(data);
}

// api/trains.js

// Helper function to find the next train based on current JST time
function getNextTrain(timetable) {
  // 1. Get current time in Japan Standard Time (JST)
  const nowJST = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
  const currentDate = new Date(nowJST);
  
  // Format current time as HH:mm (e.g., "11:43")
  const currentHours = String(currentDate.getHours()).padStart(2, '0');
  const currentMinutes = String(currentDate.getMinutes()).padStart(2, '0');
  const currentTimeString = `${currentHours}:${currentMinutes}`;

  // 2. Loop through the timetable and find the first train AFTER the current time
  for (const train of timetable) {
    if (train.time >= currentTimeString) {
      return train; // We found the next train!
    }
  }

  // 3. Fallback if no more trains today
  return {
    time: '--:--', track: '-',
    type: { jp: '終了', en: 'Out of Service' },
    destination: { jp: '本日の運行は終了しました', en: 'No more trains today' },
    info: { jp: '', en: '' }
  };
}

export default function handler(req, res) {
  const { stationId } = req.query;

  // MOCK TIMETABLE (Simulating what ODPT will eventually send us)
  // We've set these times around the late morning to test the logic.
  const mockOdptTimetable = [
    { time: '11:15', track: '3', type: { jp: '普通', en: 'Local' }, destination: { jp: '宝 塚', en: 'Takarazuka' }, info: { jp: '電車が参ります', en: 'Train approaching.' } },
    { time: '11:30', track: '3', type: { jp: '急行', en: 'Express' }, destination: { jp: '宝 塚', en: 'Takarazuka' }, info: { jp: '白線の内側へ', en: 'Stand behind the line.' } },
    { time: '11:46', track: '3', type: { jp: '普通', en: 'Local' }, destination: { jp: '宝 塚', en: 'Takarazuka' }, info: { jp: 'ご案内 ・・・宝塚へは快速急行宝塚電車にご注意ください', en: 'Train approaching. Please stand behind the yellow line.' } },
    { time: '12:05', track: '4', type: { jp: '快速', en: 'Rapid' }, destination: { jp: '三 宮', en: 'Sannomiya' }, info: { jp: '次は西宮に止まります', en: 'Next stop Nishinomiya.' } }
  ];

  // Pass the full timetable into our helper function
  const nextTrainData = getNextTrain(mockOdptTimetable);

  // Send the single next train to the Vue frontend
  res.status(200).json(nextTrainData);
}