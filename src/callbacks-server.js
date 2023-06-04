const http = require('http');
const https = require('https');
const url = require('url');

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
      fetchTitles(addressArray, (error, results) => {
        if (error) {
          sendResponse(res, 500, 'Internal Server Error');
        } else {
          sendResponse(res, 200, generateHtmlResponse(results));
        }
      });
    }
  } else {
    sendResponse(res, 404, 'Not Found');
  }
});

function fetchTitles(addresses, callback) {
  const results = [];
  let completedCount = 0;

  for (const address of addresses) {
    const requestOptions = {
      protocol: 'https:',
      hostname: address,
    };

    https
      .get(requestOptions, (response) => {
        let responseData = '';

        response.on('data', (chunk) => {
          responseData += chunk;
        });

        response.on('end', () => {
          const title = extractTitle(responseData);
          results.push({ address, title });
          completedCount++;

          if (completedCount === addresses.length) {
            callback(null, results);
          }
        });
      })
      .on('error', (error) => {
        results.push({ address, title: 'NO RESPONSE' });
        completedCount++;

        if (completedCount === addresses.length) {
          callback(null, results);
        }
      });
  }
}

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
