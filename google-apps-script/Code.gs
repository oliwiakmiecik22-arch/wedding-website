const SHEET_NAME = 'RSVP';
const RSVP_DEADLINE = new Date('2027-03-01T23:59:59+01:00');

const HEADERS = [
  'Submission ID',
  'Submitted At',
  'Lead Guest Name',
  'Attendance',
  'Guest Count',
  'Full Names of Attendees',
  'Dietary Requirements or Allergies',
  'Accommodation Required',
  'Additional Nights',
  'Preferred Check-in Date',
  'Preferred Check-out Date',
  'Second-day Celebration',
  'Coach from Kraków',
  'Coach Seats',
  'Return Transport to Kraków',
  'Dance Floor Song',
  'Client Submitted At',
  'RSVP Deadline Status',
];

function doGet() {
  return jsonResponse({ ok: true, service: 'Kasia & Jake RSVP' });
}

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    const payload = parsePayload(event);
    validatePayload(payload);

    lock.waitLock(30000);
    const sheet = getOrCreateSheet();

    if (isDuplicateSubmission(sheet, payload.submissionId)) {
      return jsonResponse({ ok: true, duplicate: true });
    }

    const attending = payload.attendance === 'yes';
    const row = [
      safeText(payload.submissionId, 100),
      new Date(),
      safeText(payload.leadGuestName, 120),
      attending ? 'Attending' : 'Unable to attend',
      attending ? safeInteger(payload.guestCount, 1, 12) : 0,
      attending ? safeText(payload.attendeeNames, 800) : '',
      attending ? safeText(payload.dietaryRequirements, 1000) : '',
      attending ? displayChoice(payload.accommodation) : '',
      attending ? displayChoice(payload.additionalNights) : '',
      attending ? safeText(payload.checkInDate, 20) : '',
      attending ? safeText(payload.checkOutDate, 20) : '',
      attending ? displayChoice(payload.followingDay) : '',
      attending ? displayChoice(payload.coachFromKrakow) : '',
      attending && payload.coachFromKrakow === 'yes'
        ? safeInteger(payload.coachSeats, 1, 12)
        : '',
      attending ? displayChoice(payload.returnTransport) : '',
      safeText(payload.danceFloorSong, 200),
      safeText(payload.submittedAtClient, 40),
      new Date() <= RSVP_DEADLINE ? 'On time' : 'After deadline',
    ];

    sheet.appendRow(row);
    sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('yyyy-mm-dd hh:mm:ss');

    return jsonResponse({ ok: true, submissionId: payload.submissionId });
  } catch (error) {
    console.error(error);
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to save RSVP',
    });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error('Missing request body');
  }

  try {
    return JSON.parse(event.postData.contents);
  } catch (_error) {
    throw new Error('Invalid JSON request');
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid RSVP data');
  if (safeText(payload.website, 200)) throw new Error('Spam check failed');
  if (!/^[a-zA-Z0-9-]{8,100}$/.test(String(payload.submissionId || ''))) {
    throw new Error('Invalid submission ID');
  }
  if (safeText(payload.leadGuestName, 120).length < 2) {
    throw new Error('Lead guest name is required');
  }
  if (!['yes', 'no'].includes(payload.attendance)) {
    throw new Error('Attendance choice is required');
  }

  if (payload.attendance === 'yes') {
    safeInteger(payload.guestCount, 1, 12);
    if (safeText(payload.attendeeNames, 800).length < 2) {
      throw new Error('Attendee names are required');
    }
    ['accommodation', 'additionalNights', 'followingDay', 'coachFromKrakow', 'returnTransport'].forEach(
      function (field) {
        if (!['yes', 'no'].includes(payload[field])) {
          throw new Error('Missing required choice: ' + field);
        }
      },
    );
    if (payload.additionalNights === 'yes') {
      const checkIn = safeText(payload.checkInDate, 20);
      const checkOut = safeText(payload.checkOutDate, 20);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
        throw new Error('Preferred accommodation dates are required');
      }
      if (checkOut <= checkIn) throw new Error('Check-out date must be after check-in date');
    }
    if (payload.coachFromKrakow === 'yes') safeInteger(payload.coachSeats, 1, 12);
  }
}

function getOrCreateSheet() {
  const configuredId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const spreadsheet = configuredId
    ? SpreadsheetApp.openById(configuredId)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error('Spreadsheet not found. Set the SPREADSHEET_ID script property.');
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const header = sheet.getRange(1, 1, 1, HEADERS.length);
    header.setFontWeight('bold');
    header.setBackground('#777650');
    header.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
  }

  return sheet;
}

function isDuplicateSubmission(sheet, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  const firstRow = Math.max(2, lastRow - 499);
  const ids = sheet.getRange(firstRow, 1, lastRow - firstRow + 1, 1).getDisplayValues();
  return ids.some(function (row) {
    return row[0] === submissionId;
  });
}

function safeText(value, maxLength) {
  let text = String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);

  // Prevent Google Sheets formula injection while preserving the guest's text.
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function safeInteger(value, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error('Invalid number');
  }
  return number;
}

function displayChoice(value) {
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  return '';
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
