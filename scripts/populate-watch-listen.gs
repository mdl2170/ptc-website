/**
 * Run once in your PTC Website spreadsheet:
 * Extensions → Apps Script → paste → Run populateWatchListen
 *
 * Or import data/watch-listen-import.csv into tab "Watch and Listen".
 */
function populateWatchListen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Watch and Listen');
  if (!sheet) {
    sheet = ss.insertSheet('Watch and Listen');
  }

  var rows = [
    [
      'active',
      'sort_order',
      'youtube_id',
      'start_seconds',
      'source',
      'kind',
      'duration',
      'title',
      'description',
      'image',
      'image_alt',
    ],
    [true, 1, '6hs__OQwJaM', 2, 'AC4Columbia', 'Video', '', 'Peace is Possible: The Science and Core Dynamics of Sustainable Peace', '', '', 'Peace is Possible — AC4 Columbia'],
    [true, 2, '8eNeGTc96GU', 17, 'The Aspen Institute', 'Talk', '', 'Can We Learn to Talk to Each Other?', '', '', 'Can We Learn to Talk to Each Other? — Aspen Institute'],
    [true, 3, '_Nzjk8JDaM4', 0, 'AC4Columbia', 'Video', '', 'Peter T. Coleman - Complexity, Intractability and Social Change', '', '', 'Complexity and Social Change — AC4 Columbia'],
    [true, 4, 'UghtX-9Gvns', 0, 'Teachers College, Columbia University', 'Lecture', '', 'Peter Coleman: Professor of Psychology and Education', '', '', 'Peter Coleman — Teachers College'],
    [true, 5, 'CUN0qEm8W90', 0, 'Columbia SPS', 'Interview', '', 'Beyond the Bio: Peter T. Coleman, Ph.D.', '', '', 'Beyond the Bio — Columbia SPS'],
    [true, 6, 'WBoAZMS_XIQ', 0, 'Mark Twain Library', 'Talk', '', 'An Evening of Discussion with Dr. Peter Coleman and Dr. Averell Manes', '', '', 'Evening of Discussion — Mark Twain Library'],
    [true, 7, 'YK8pH6yVBeI', 0, 'Florida Humanities', 'Talk', '', 'The Way Out with Dr. Peter Coleman', '', '', 'The Way Out — Florida Humanities'],
    [true, 8, 'dMDRJtJ6ExU', 0, 'ICCCR / AC4', 'Video', '', '[ICCCR/AC4] Complexity, Intractability, and Social Change - Peter Coleman', '', '', 'Complexity and Social Change — ICCCR/AC4'],
    [true, 9, 'P2C2QZ2kywE', 2, 'Teachers College, Columbia University', 'Talk', '', 'Peter T. Coleman: If Peace Could Talk', '', '', 'If Peace Could Talk — Teachers College'],
    [true, 10, 'C0diVyK4ZWc', 0, 'Teachers College, Columbia University', 'Lecture', '', 'Welcome Address', '', '', 'Welcome Address — Teachers College'],
    [true, 11, 'c6sT_s93vcI', 0, 'Fox Business', 'Interview', '', 'Making conflict in the office work', '', '', 'Making conflict in the office work — Fox Business'],
    [true, 12, 'KbIHclQAB7g', 4, 'CivicList', 'Interview', '', 'CivicList interview with Prof. Peter T. Coleman, part 1 of 2', '', '', 'CivicList interview part 1'],
    [true, 13, 'feCPYV1MN8E', 0, 'Teachers College, Columbia University', 'Talk', '', 'Perspectives on Peace 2016. Book talk with Sebastian Junger', '', '', 'Perspectives on Peace 2016 — Teachers College'],
    [true, 14, 'W7_SDB8f_3Y', 0, 'Teachers College, Columbia University', 'Video', '', 'The Conflict Intelligence (CIQ Lab) Executive Education Program', '', '', 'CIQ Lab Executive Education Program — Teachers College'],
  ];

  sheet.clear();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.setFrozenRows(1);
}
