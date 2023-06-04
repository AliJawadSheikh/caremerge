const generateHtmlResponse = (results) => {
    let html = '<html><head></head><body><h1>Following are the titles of given websites:</h1><ul>';

    for (const result of results) {
        html += `<li>${result.address} - ${result.title ? `"${result.title}"` : 'NO RESPONSE'}</li>`;
    }

    html += '</ul></body></html>';
    return html;
}

module.exports = generateHtmlResponse;