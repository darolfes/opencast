function showFailed(errorText) {
    console.log(errorText);
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
    let url_part_hash = window.location.hash;
    cred_xhr(origin + "/info/me.json").then(me_info_json => {
        let me_info = JSON.parse(me_info_json);
        if (me_info.roles.includes("ROLE_OAUTH_USER")) {
          showOk("Authenticated via OAUTH: Your roles are '" + me_info.roles +
            "' your user is '" + me_info.user + "' and your userrole is '" +
            me_info.userRole + "'\n" + "Url Hash Part: '" + url_part_hash + "'");
        }
        else {
          showFailed("OAUTH ROLE not set, not authenticated over OAUTH? me_info: " + me_info);
        }
    })
    .then(() => {}, err => {
      showFailed(err);
    })
}

main();
