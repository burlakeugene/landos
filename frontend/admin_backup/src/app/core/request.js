class Request {
  constructor(props) {
    this.config = {
      url: props.url || '',
      commonData: props.hasOwnProperty('commonData') ? props.commonData : {},
      headers: props.hasOwnProperty('headers')
        ? props.headers
        : { 'Content-Type': 'application/json' },
    };
  }

  request(method, request) {
    let {
        commonData,
        headers,
        url,
      } = this.config,
      self = this;
    return new Promise((resolve, reject) => {
      if (!request) reject('Empty request');
      request.start && request.start();
      let xhr = new XMLHttpRequest(),
        requestUrl = this.buildUrl(url, request.url),
        async = request.async ? request.async : true,
        requestData = request.data || {},
        responseHeaders;
      requestData = { ...commonData, ...requestData };
      if (method === 'GET') {
        let getIterator = 0;
        for (let data in requestData) {
          if (!getIterator) {
            requestUrl += '?' + data + '=' + requestData[data];
          } else {
            requestUrl += '&' + data + '=' + requestData[data];
          }
          getIterator++;
        }
      }

      xhr.open(method, requestUrl, async);
      for (let header in headers) {
        xhr.setRequestHeader(header, headers[header]);
      }
      xhr.send(JSON.stringify(requestData));
      xhr.onreadystatechange = function () {
        if (this.readyState == this.HEADERS_RECEIVED) {
          responseHeaders = xhr
            .getAllResponseHeaders()
            .trim()
            .split(/[\r\n]+/);
          let headersMap = {};
          responseHeaders.forEach(function (line) {
            let parts = line.split(': '),
              header = parts.shift(),
              value = parts.join(': ');
            headersMap[header] = value;
          });
          responseHeaders = headersMap;
        }
        if (xhr.readyState != 4) return;
        let response = xhr;
        try {
          response = JSON.parse(response.response);
        } catch (e) {
          response = response.response;
        }
        request.end && request.end();
        if (xhr.status < 200 || xhr.status > 300) reject(response);
        else resolve(response);
      };
    });
  }

  buildUrl(base = '', relative = '') {
    if (base[base.length - 1] === '/' && relative[0] === '/') {
      base = base.slice(0, base.length - 1);
    }
    return base + relative;
  }

  post(data) {
    return this.request('POST', data);
  }

  get(data) {
    return this.request('GET', data);
  }

  put(data) {
    return this.request('PUT', data);
  }

  delete(data) {
    return this.request('DELETE', data);
  }

  patch(data) {
    return this.request('PATCH', data);
  }
}

export default Request;
