/**
 * Run once in your PTC Website spreadsheet:
 * Extensions → Apps Script → paste this file → Run populateLatestUpdates
 */
function populateLatestUpdates() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Latest Updates');
  if (!sheet) {
    throw new Error('Sheet "Latest Updates" not found.');
  }

  var rows = [
    ['active', 'headline', 'date', 'description', 'link', 'image', 'image_alt'],
    [
      true,
      'The Way Out: Updated Edition Released in August 2026',
      'August 2026',
      'New practical plans and exercises for individual, social, and systemic change—plus lessons on reforming the institutions that entrench conflict and building sustainable ways to live together.',
      'https://cup.columbia.edu/book/the-way-out/9780231224772/',
      'https://edventuredesign.com/wp-content/uploads/2026/01/Title-2-scaled.jpg',
      'The Way Out, Updated Edition',
    ],
    [
      true,
      'The Conflict Intelligence (CIQ) Lab *Executive Education Program*',
      'October 26, 2026 — November 15, 2026',
      'Transform conflict into your competitive advantage with a research-backed program from MD-ICCCR and TC Academy at Teachers College, Columbia University.',
      'https://www.tc.columbia.edu/tcacademy/programs/all-offerings/conflict-intelligence-executive-education-program/',
      'https://www.tc.columbia.edu/tcacademy/programs/all-offerings/conflict-intelligence-executive-education-program/Conflict_Intelligence_Executive_Education_Program.jpg',
      'Conflict Intelligence (CIQ) Lab Executive Education Program',
    ],
    [
      true,
      'On the science of de-escalation in an election year — *The Ezra Klein Show.*',
      'Apr 11, 2026',
      'A conversation on how research on intractable conflict applies to difficult political moments.',
      '#',
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80&auto=format&fit=crop',
      'Podcast interview',
    ],
  ];

  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}
