'use strict';
import https from 'https';
import querystring from 'querystring';

export default function request({method, host, path, qs, form, headers}) {
  const options = {
    headers,
    host,
    method,
    path: `${path}?${querystring.stringify(qs)}`,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let chunk = '';

      const setCookie = res.headers['set-cookie'];

      res.on('data', (data) => {
        chunk += data;
      });

      res.on('end', () => {
        resolve({
          data: chunk.toString('utf8'),
          cookies: setCookie,
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (form) req.write(`data=${querystring.stringify(form)}`);
    req.end();
  });
};

export function login({email, password}) {
  const options = {
    host: 'accounts.google.com',
    method: 'GET',
    path: '/ServiceLogin',
  };

  const authOptions = {
    host: 'accounts.google.com',
    method: 'POST',
    path: '/ServiceLoginAuth',
  };

  return request(options)
  .then((results) => {
    const inputs = results.data.match(/<input\b[^>]*>(.*?)/g);
    const form = inputs.reduce((acc, curr) => {
      if (curr.match(/name="(.*?)"/g)) {
        acc[curr.match(/name="(.*?)"/g)[0].split('"')[1]] =
          curr.match(/value="(.*?)"/g)[0].split('"')[1];
      }
      return acc;
    }, {});

    form.Email = email;
    form.Passwd = password;
    authOptions.form = form;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(form),
    };

    authOptions.headers = headers;

    return request(authOptions);
  })
  .then((results) => {
    this.cookie = results.cookies[0].split(';')[0];
  });

};
