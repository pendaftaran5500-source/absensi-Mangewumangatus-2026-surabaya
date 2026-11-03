const SPREADSHEET_PENDAFTARAN_ID = 'https://docs.google.com/spreadsheets/d/17Tl1FM_LEdBbR7GqSIRNy-v3uqPIZ9ooEAmd6OETK6A/edit?usp=drivesdk';
const NAMA_SHEET_PENDAFTARAN = 'Pendaftaran'; // Sesuaikan dengan nama tab di spreadsheet pendaftaran

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Check-in Race Pack - Mangewumangatus 2026')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getParticipantList() {
  var ssUtama = SpreadsheetApp.openById(SPREADSHEET_PENDAFTARAN_ID);
  var sheet = ssUtama.getSheetByName(NAMA_SHEET_PENDAFTARAN);
  
  if (!sheet) return [];
  
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  var list = [];
  
  data.forEach(function(row) {
    // Sesuaikan indeks kolom dengan sheet Pendaftaran Anda:
    // row[1] = Nama, row[2] = Kategori, row[3] = Status Pembayaran, row[4] = Email
    var nama = row[1];
    var kategori = String(row[2]);
    var statusBayar = String(row[3]);
    var email = row[4];
    
    if (statusBayar.toLowerCase() === 'terverifikasi' && nama !== "") {
      list.push({
        nama: nama,
        kategori: kategori,
        email: email
      });
    }
  });
  
  return list;
}

function submitRacePack(formData) {
  var ssAbsensi = SpreadsheetApp.getActiveSpreadsheet();
  
  var targetSheetName = "";
  var kat = formData.kategori.toLowerCase();
  
  if (kat.indexOf('500') !== -1) {
    targetSheetName = "Absensi_500km";
  } else if (kat.indexOf('55') !== -1) {
    targetSheetName = "Absensi_55km";
  } else if (kat.indexOf('5') !== -1) {
    targetSheetName = "Absensi_5km";
  } else {
    targetSheetName = "Absensi_500km";
  }
  
  var sheet = ssAbsensi.getSheetByName(targetSheetName);
  if (!sheet) return { success: false, message: "Tab " + targetSheetName + " tidak ditemukan di Spreadsheet Absensi!" };
  
  var timestamp = new Date();
  sheet.appendRow([
    formData.bib,
    formData.nama,
    formData.email,
    formData.kategori,
    formData.gpsId || '-',
    'Ambil (Jumat)',
    timestamp
  ]);
  
  return { 
    success: true, 
    message: "Berhasil! Race Pack " + formData.nama + " (BIB: " + formData.bib + ") tercatat di " + targetSheetName
  };
}
