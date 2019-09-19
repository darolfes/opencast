function showFailed(errorText) {
    let body = document.getElementsByTagName('body')[0];
    body.style.backgroundColor = "#903030";
    body.innerHTML = "Failed! Error: " + errorText;
}

function showOk(workingText) {
    let body = document.getElementsByTagName('body')[0];
    body.style.backgroundColor = "#40a040";
    body.innerHTML = "Working! Info: " + workingText;
}

function xhr(url, opts) { // stolen from oc-studio
    return new Promise((resolve, reject) => {
      if (!url) {
        reject('no url');
        return;
      }

      const req = new XMLHttpRequest();
      const reqType = (opts ? opts.type || 'GET' : 'GET').toUpperCase();
      req.open(reqType, url, true);
      if (opts && opts.hasOwnProperty('attributes')) {
        for (let key in opts.attributes) {
          req.setAttribute(key, opts.attributes[key]);
        }
      }

      if (opts && opts.hasOwnProperty('properties')) {
        for (let key in opts.properties) {
          req[key] = opts.properties[key];
        }
      }

      if (opts && opts.hasOwnProperty('requestHeaders')) {
        for (let key in opts.requestHeaders) {
          req.setRequestHeader(key, opts.requestHeaders[key]);
        }
      }

      req.onload = e => {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject(e);
        }
      };

      req.onerror = e => {
        reject(e);
      };

      req.send(opts && opts.data ? opts.data : null);
    });
  }

function cred_xhr(url, type, data, isUrlencoded) {
    let opts = {
      properties: {
        withCredentials: true,
        responseType: 'text'
      }
    };

    opts.type = type;
    opts.data = data;
    opts.requestHeaders = {};

    if (isUrlencoded) {
      opts.requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return xhr(url, opts);
  }

function main() {
    let origin = window.location.origin;
    cred_xhr(origin + "/info/me.json").then(me_info => {
        showOk(me_info);
    })
}

main();
