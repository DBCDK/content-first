module.exports = {
  constructHtml
};

function constructHtml(title, description, img, url, size, type) {
  // Create Meta content in HTML markup
  const pageTitle = '<title>' + title + '</title>';
  const ogTitle = '<meta property="og:title" content="' + title + '" />';
  const ogDescription =
    '<meta property="og:description" content="' + description + '" />';
  const ogImage = '<meta property="og:image" content="' + img + '" />';
  const ogURL = '<meta property="og:url" content="' + url + '" />';
  const ogImageWidth =
    '<meta property="og:image:width" content="' + size.width + '"/>';
  const ogImageHeight =
    '<meta property="og:image:height" content="' + size.height + '"/>';
  const ogType = '<meta property="og:type" content="' + type + '" />';

  // Build <head>
  const head =
    '<head>' +
    pageTitle +
    ogTitle +
    ogType +
    ogDescription +
    ogImage +
    ogImageWidth +
    ogImageHeight +
    ogURL +
    '</head>';

  const body = '<body>Hello Bot!</body>';

  // Build <html>
  const html = '<html>' + head + body + '</html>';

  return html;
}
