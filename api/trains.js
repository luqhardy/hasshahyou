// api/trains.js

// Helper function to find the next train based on current JST time
function getNextTrain(timetable, debug = false) {
  // 1. Get current time in Japan Standard Time (JST)
  const nowJST = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
  const currentDate = new Date(nowJST);

  // Format current time as HH:mm (e.g., "11:43")
  const currentHours = String(currentDate.getHours()).padStart(2, '0');
  const currentMinutes = String(currentDate.getMinutes()).padStart(2, '0');
  const currentTimeString = `${currentHours}:${currentMinutes}`;

  if (debug) {
    console.log(`Current JST: ${currentTimeString}`);
    console.log(`Timetable has ${timetable.length} trains`);
    console.log('Train times:', timetable.map(t => t.time));
  }

  // 2. Loop through the timetable and find the first train AFTER the current time
  for (const train of timetable) {
    if (train.time >= currentTimeString) {
      if (debug) {
        console.log(`Found next train: ${train.time}`);
      }
      return train;
    }
  }

  // 3. Fallback if no more trains today
  if (debug) {
    console.log('No more trains today');
  }
  return {
    time: '--:--', track: '-',
    type: { jp: '終了', en: 'Out of Service' },
    destination: { jp: '本日の運行は終了しました', en: 'No more trains today' },
    info: { jp: '', en: '' }
  };
}

// Map station IDs to ODPT station codes
const STATION_MAP = {
  shinjuku: 'odpt:Station:JR-East.Yamanote.Shinjuku',
  shibuya: 'odpt:Station:JR-East.Yamanote.Shibuya',
  ueno: 'odpt:Station:JR-East.Yamanote.Ueno',
  ginza: 'odpt:Station:Tokyo-Metro.Ginza.Ginza',
  akasaka: 'odpt:Station:Tokyo-Metro.Ginza.Akasaka',
};

// Map station IDs to ODPT operators
const OPERATOR_MAP = {
  shinjuku: 'odpt.Operator:JR-East',
  shibuya: 'odpt.Operator:JR-East',
  ueno: 'odpt.Operator:JR-East',
  ginza: 'odpt.Operator:Tokyo-Metro',
  akasaka: 'odpt.Operator:Tokyo-Metro',
};

export default async function handler(req, res) {
  const { stationId, debug } = req.query;
  
  const accessToken = process.env.ODPT_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ error: 'ODPT_ACCESS_TOKEN not configured' });
  }

  // Default to Shinjuku if no station specified
  const station = stationId || 'shinjuku';
  const odptStation = STATION_MAP[station];
  const odptOperator = OPERATOR_MAP[station];

  if (!odptStation || !odptOperator) {
    return res.status(400).json({ error: `Unknown station: ${station}` });
  }

  try {
    // Fetch train timetable from ODPT API
    const url = `https://api.odpt.org/api/v4/odpt:TrainTimetable?odpt:operator=${odptOperator}&odpt:station=${odptStation}&acl:consumerKey=${accessToken}`;
    
    console.log(`Fetching ODPT API: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`ODPT API error: ${response.status}`);
    }

    const data = await response.json();

    if (debug === 'true') {
      // Return raw ODPT data for debugging
      return res.status(200).json({
        debug: true,
        rawCount: data.length,
        rawSample: data.slice(0, 5), // First 5 trains
        station: station,
        odptStation: odptStation,
        odptOperator: odptOperator
      });
    }

    // Convert ODPT data to our format
    const timetable = data.map(train => ({
      time: train['odpt:departureTime'] || train['odpt:arrivalTime'],
      track: train['odpt:platformNumber'] || '-',
      type: {
        jp: train['odpt:trainType'] || '普通',
        en: train['odpt:trainType'] || 'Local'
      },
      destination: {
        jp: train['odpt:destination'] || '',
        en: train['odpt:destination'] || ''
      },
      info: {
        jp: 'まもなく電車が参ります',
        en: 'Train approaching'
      }
    }));

    const nextTrain = getNextTrain(timetable, debug === 'true');
    res.status(200).json(nextTrain);

  } catch (error) {
    console.error('ODPT API Error:', error);
    res.status(500).json({ error: 'Failed to fetch train data', details: error.message });
  }
}
