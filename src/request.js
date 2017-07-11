'use strict';
import https from 'https';
import querystring from 'querystring';

export default function request({method, host, path, qs, agent}) {
  const options = {
    host,
    method,
    path: `${path}?${querystring.stringify(qs)}`,
    agent: agent,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let chunk = '';

      res.on('data', (data) => {
        chunk += data;
      });

      res.on('end', () => {
        resolve(chunk.toString('utf8'));
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
};
