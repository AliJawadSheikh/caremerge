const extractTitle = (html) => {
  const titleRegex = /<title>(.*?)<\/title>/;
  const match = titleRegex.exec(html);
  return match ? match[1] : '';
}
module.exports = extractTitle;