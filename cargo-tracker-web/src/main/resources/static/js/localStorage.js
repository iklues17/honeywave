
comm.localStorage = (function(){
	
	var self = this;
	var webStorage;
	this.prefix = 'ls';
	this.storageType = 'localStorage';
	this.cookie = {
		expiry: 30,
		path: '/'
	};

	// Setter for the prefix
	this.setPrefix = function(prefix) {
		this.prefix = prefix;
		return this;
	};

	// Setter for the storageType
	this.setStorageType = function(storageType) {
		this.storageType = storageType;
		return this;
	};

	// Setter for cookie config
	this.setStorageCookie = function(exp, path) {
		this.cookie = {
			expiry: exp,
			path: path
		};
	return this;
	};

	var deriveQualifiedKey = function(key) {
		return prefix + key;
	};

	var browserSupportsLocalStorage = (function () {
		try {
			var supported = (storageType in window && window[storageType] !== null);

			// When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
			// is available, but trying to call .setItem throws an exception.
			//
			// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage
			// that exceeded the quota."
			var key = deriveQualifiedKey('__' + Math.round(Math.random() * 1e7));
			if (supported) {
				webStorage = window[storageType];
				webStorage.setItem(key, '');
				webStorage.removeItem(key);
			}

			return supported;
		} catch (e) {
			storageType = 'cookie';
			return false;
		}
	}());

    // Checks the browser to see if cookies are supported
    var browserSupportsCookies = (function() {
      try {
        return window.navigator.cookieEnabled ||
          ("cookie" in document && (document.cookie.length > 0 ||
          (document.cookie = "test").indexOf.call(document.cookie, "test") > -1));
      } catch (e) {
          return false;
      }
    }());

	// Directly adds a value to local storage
	// If local storage is not available in the browser use cookies
	// Example use: localStorageService.add('library','angular');
	var addToLocalStorage = function (key, value) {
		// Let's convert undefined values to null to get the value consistent
		if (comm.isUndefined(value)) {
			value = null;
		} else if (comm.isObject(value) || comm.isArray(value) || comm.isNumber(+value || value)) {
			value = comm.toJson(value);
		}

		// If this browser does not support local storage use cookies
		if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
			return addToCookies(key, value);
		}

		try {
			if (comm.isObject(value) || comm.isArray(value)) {
				value = comm.toJson(value);
			}
			if (webStorage) {
				webStorage.setItem(deriveQualifiedKey(key), value)
			};
		} catch (e) {
			return addToCookies(key, value);
		}
		return true;
	};

	// Directly get a value from local storage
	// Example use: localStorageService.get('library'); // returns 'angular'
	var getFromLocalStorage = function (key) {

		if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
			return getFromCookies(key);
		}

		var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null;
		// angular.toJson will convert null to 'null', so a proper conversion is needed
		// FIXME not a perfect solution, since a valid 'null' string can't be stored
		if (!item || item === 'null') {
			return null;
		}

		if (item.charAt(0) === "{" || item.charAt(0) === "[" || comm.isStringNumber(item)) {
			return comm.fromJson(item);
		}

		return item;
	};

	// Remove an item from local storage
	// Example use: localStorageService.remove('library'); // removes the key/value pair of library='angular'
	var removeFromLocalStorage = function (key) {
		if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
			return removeFromCookies(key);
		}

		try {
			webStorage.removeItem(deriveQualifiedKey(key));
		} catch (e) {
			return removeFromCookies(key);
		}
		return true;
	};
	
	// Directly adds a value to cookies
	// Typically used as a fallback is local storage is not available in the browser
	// Example use: localStorageService.cookie.add('library','angular');
	var addToCookies = function (key, value) {

		if (comm.isUndefined(value)) {
			return false;
		} else if(comm.isArray(value) || comm.isObject(value)) {
			value = comm.toJson(value);
		}

		if (!browserSupportsCookies) {
			return false;
		}

		try {
			var expiry = '',
			expiryDate = new Date();

			if (value === null) {
				// Mark that the cookie has expired one day ago
				expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000));
				expiry = "; expires=" + expiryDate.toGMTString();
				value = '';
			} else if (cookie.expiry !== 0) {
				expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000));
				expiry = "; expires=" + expiryDate.toGMTString();
			}
			if (!!key) {
				var cookiePath = "; path=" + cookie.path;
				document.cookie = deriveQualifiedKey(key) + "=" + encodeURIComponent(value) + expiry + cookiePath;
			}
		} catch (e) {
			return false;
		}
		return true;
	};


	// Directly get a value from a cookie
	// Example use: localStorageService.cookie.get('library'); // returns 'angular'
	var getFromCookies = function (key) {
		if (!browserSupportsCookies) {
			return false;
		}

		var cookies = document.cookie && document.cookie.split(';') || [];
		for(var i=0; i < cookies.length; i++) {
			var thisCookie = cookies[i];
			while (thisCookie.charAt(0) === ' ') {
				thisCookie = thisCookie.substring(1,thisCookie.length);
			}
			if (thisCookie.indexOf(deriveQualifiedKey(key) + '=') === 0) {
				var storedValues = decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length))
				try{
					var obj = JSON.parse(storedValues);
					return comm.fromJson(obj)
				}catch(e){
					return storedValues
				}
			}
		}
		return null;
	};

	var removeFromCookies = function (key) {
		addToCookies(key,null);
	};

	var clearAllFromCookies = function () {
		var thisCookie = null, thisKey = null;
		var prefixLength = prefix.length;
		var cookies = document.cookie.split(';');
		for(var i = 0; i < cookies.length; i++) {
			thisCookie = cookies[i];

			while (thisCookie.charAt(0) === ' ') {
				thisCookie = thisCookie.substring(1, thisCookie.length);
			}

			var key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));
			removeFromCookies(key);
		}
	};
	
	return {
		isSupported: browserSupportsLocalStorage,
		set: addToLocalStorage,
		get: getFromLocalStorage,
		remove: removeFromLocalStorage,
		cookie: {
			isSupported: browserSupportsCookies,
			set: addToCookies,
			get: getFromCookies,
			remove: removeFromCookies,
			clearAll: clearAllFromCookies
		}
	};
})();