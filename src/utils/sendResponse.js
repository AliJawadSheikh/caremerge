const sendResponse = (res, statusCode, content) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(content);
}

module.exports = sendResponse;