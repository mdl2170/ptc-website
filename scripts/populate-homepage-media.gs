/**
 * Run once in your PTC Website spreadsheet:
 * Extensions → Apps Script → paste → Run populateHomepageMedia
 */
function populateHomepageMedia() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Homepage Media');
  if (!sheet) {
    sheet = ss.insertSheet('Homepage Media');
  }

  var rows = [
    ['active', 'outlet', 'date', 'title', 'link', 'cta_label', 'image', 'image_alt'],
    [
      true,
      'Hidden Brain',
      '2/13/2024',
      'US 2.0: Living With Our Differences',
      'https://www.hiddenbrain.org/podcast/us-2-0-living-with-our-differences/',
      'Listen here',
      'https://www.hiddenbrain.org/wp-content/uploads/2024/02/shake-hands-3139604_1280-1.jpg',
      'Hidden Brain podcast episode',
    ],
    [
      true,
      'Chasing Life',
      '1/11/2024',
      'How to have difficult conversations in a polarized world',
      'https://podcasts.apple.com/ni/podcast/how-to-have-difficult-conversations-in-a-polarized-world/id1501029683?i=1000675313326',
      'Listen here',
      'https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/82/c2/3c/82c23cf4-9aba-b4ff-694f-eb5b998b4488/mza_13613665598629228945.jpg/1200x1200bf-60.jpg',
      'Chasing Life with Dr. Sanjay Gupta',
    ],
    [
      true,
      'PBS NewsHour',
      '1/10/2022',
      'Political polarization prompts efforts to bridge the gap through shared experiences',
      'https://www.pbs.org/newshour/show/political-polarization-prompts-efforts-to-bridge-the-gap-through-shared-experiences',
      'Watch here',
      'https://d3i6fh83elv35t.cloudfront.net/static/2022/01/bridgingthedivide-1024x568.jpg',
      'PBS NewsHour segment',
    ],
  ];

  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}
