/**
 * Punjab Immigration - Google Reviews Auto-Sync Script for Next.js
 * 
 * Run this script to fetch the latest Google Place reviews
 * and save them to src/data/reviews.json.
 * 
 * Usage: node --env-file=.env.local scripts/sync-reviews.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// ── Configuration ──────────────────────────────────────────────────────────
// The API key lives in .env.local (never committed). Add a line:
//   GOOGLE_PLACES_API_KEY=your-key
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!GOOGLE_PLACES_API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY. Add it to .env.local, then run:
  node --env-file=.env.local scripts/sync-reviews.js');
  process.exit(1);
}
const GOOGLE_PLACE_ID       = "ChIJ8WGMENRlGTkRFWTK_9mfa9M";
const REVIEWS_JSON_PATH     = path.join(__dirname, '..', 'src', 'data', 'reviews.json');
// ──────────────────────────────────────────────────────────────────────────

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Invalid JSON: ' + data.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

function buildReviewEntry(r, colorIndex) {
  const authorName = (r.author_name || "Anonymous").replace(/"/g, '\\"');
  const initial    = authorName.charAt(0).toUpperCase();
  const quote      = (r.text || "").replace(/"/g, '\\"').replace(/\n/g, ' ');
  const colors     = colorIndex % 2 === 0
    ? { bg: "fab00d", fg: "333" }
    : { bg: "06122e", fg: "fff" };

  return {
    name: authorName,
    visa: "Verified Google Review",
    quote: quote,
    image: `https://placehold.co/100x100/${colors.bg}/${colors.fg}?text=${initial}`
  };
}

async function syncReviews() {
  console.log('\n Fetching reviews from Google Places API...');

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}`;
  
  let googleReviews;
  try {
    const data = await fetchJson(url);
    if (data.status !== 'OK') {
      console.error(`Google API Error: ${data.status} - ${data.error_message || ''}`);
      process.exit(1);
    }
    googleReviews = data.result?.reviews || [];
  } catch (err) {
    console.error('Failed to fetch reviews:', err.message);
    process.exit(1);
  }

  console.log(`Received ${googleReviews.length} reviews from Google.`);

  if (googleReviews.length === 0) {
    console.log('No reviews returned. Nothing to update.');
    return;
  }

  if (!fs.existsSync(REVIEWS_JSON_PATH)) {
    console.error(`Reviews file not found: ${REVIEWS_JSON_PATH}`);
    process.exit(1);
  }

  let reviewsList = [];
  try {
    const fileContent = fs.readFileSync(REVIEWS_JSON_PATH, 'utf8');
    reviewsList = JSON.parse(fileContent);
  } catch (err) {
    console.error('Failed to parse reviews.json:', err.message);
    process.exit(1);
  }

  const existingAuthors = new Set(reviewsList.map(r => r.name.trim().toLowerCase()));
  let hasNew = false;
  let colorIndex = reviewsList.length;

  googleReviews.forEach(r => {
    const name = (r.author_name || '').trim().toLowerCase();
    if (name && !existingAuthors.has(name)) {
      const entry = buildReviewEntry(r, colorIndex++);
      reviewsList.push(entry);
      existingAuthors.add(name);
      hasNew = true;
      console.log(`+ Added new review from: ${entry.name}`);
    }
  });

  if (hasNew) {
    try {
      fs.writeFileSync(REVIEWS_JSON_PATH, JSON.stringify(reviewsList, null, 2), 'utf8');
      console.log(`\n Success! Updated ${REVIEWS_JSON_PATH} with new reviews.`);
    } catch (err) {
      console.error('Failed to write updated reviews.json:', err.message);
    }
  } else {
    console.log('\n No new reviews found. reviews.json is already up to date!');
  }
}

syncReviews();
