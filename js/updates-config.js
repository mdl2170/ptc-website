/**
 * Google Sheet content — shared spreadsheet
 * https://docs.google.com/spreadsheets/d/1NXMeNw_1zF84rbmB3HEqSurhJhmOa78tMjszEgmeI4U/edit
 *
 * Share: Anyone with the link → Viewer
 *
 * Tab "Latest Updates" columns:
 *   active | headline | date | description | link | image | image_alt
 *
 * Tab "Homepage Media" columns:
 *   active | outlet | date | title | link | cta_label | image | image_alt
 *
 * Tab "Full Archive" columns:
 *   ID | Title | Link | Image URL | Outlet | Media Type | Audience | Topic(s) | Featured
 *   (Year is parsed from the title or link URL; date shown when the link includes /YYYY/MM/DD/.)
 *
 * Tab "Watch and Listen" columns (Speaking page playlist):
 *   active | sort_order | youtube_id | start_seconds | source | kind | duration | title | description | image | image_alt
 *   youtube_id = 11-character ID from the YouTube URL. start_seconds = optional (e.g. 17 for &t=17s). Leave image blank for YouTube thumbnail.
 *   Import template: data/watch-listen-import.csv
 *
 * Use *asterisks* in text fields for italics. For dates, Plain text works best for ranges.
 */
window.PTC_UPDATES = {
  sheetId: '1NXMeNw_1zF84rbmB3HEqSurhJhmOa78tMjszEgmeI4U',
  sheetName: 'Latest Updates',
  maxSlides: 10,
  ctaLabel: 'Learn More',
  rotateMs: 10000,
};

window.PTC_MEDIA = {
  sheetId: '1NXMeNw_1zF84rbmB3HEqSurhJhmOa78tMjszEgmeI4U',
  sheetName: 'Homepage Media',
  maxItems: 12,
};

window.PTC_ARCHIVE = {
  sheetId: '1NXMeNw_1zF84rbmB3HEqSurhJhmOa78tMjszEgmeI4U',
  sheetName: 'Full Archive',
  perPage: 10,
};

/** Publications page — Selected writing (Opinion Published rows from Full Archive) */
window.PTC_WRITING = {
  sheetId: '1NXMeNw_1zF84rbmB3HEqSurhJhmOa78tMjszEgmeI4U',
  sheetName: 'Full Archive',
  perPage: 10,
};
