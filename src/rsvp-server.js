const http = require('http');
const url = require('url');
const RSVP = require('rsvp');

const extractTitle = require('./utils/extractTitle');
const generateHtmlResponse = require('./utils/generateHtmlResponse');
const sendResponse = require('./utils/sendResponse');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (pathname === '/I/want/title' && req.method === 'GET') {
    const addresses = query.address;
    const addressArray = Array.isArray(addresses) ? addresses : [addresses];

    if (!addresses || addressArray.length === 0) {
      sendResponse(res, 400, 'Bad Request: No addresses provided');
    } else {
      fetchTitles(addressArray)
        .then((results) => {
          sendResponse(res, 200, generateHtmlResponse(results));
        })
        .catch((error) => {
          sendResponse(res, 500, 'Internal Server Error');
        });
    }
  } else {
    sendResponse(res, 404, 'Not Found');
  }
});

function fetchTitles(addresses) {
  const results = [];

  const promises = addresses.map((address) => {
    const requestOptions = {
      protocol: 'http:',
      hostname: address,
    };

    return new RSVP.Promise((resolve, reject) => {
      http
        .get(requestOptions, (response) => {
          let responseData = '';

          response.on('data', (chunk) => {
            responseData += chunk;
          });

          response.on('end', () => {
            const title = extractTitle(responseData);
            results.push({ address, title });
            resolve();
          });
        })
        .on('error', (error) => {
          results.push({ address, title: 'NO RESPONSE' });
          resolve();
        });
    });
  });

  return RSVP.all(promises).then(() => results);
}

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
