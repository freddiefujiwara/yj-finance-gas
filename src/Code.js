function doGet(e) {
  const res = UrlFetchApp.fetch('https://finance.yahoo.co.jp/quote/4755.T');
  Logger.log(res.getContentText());
}
