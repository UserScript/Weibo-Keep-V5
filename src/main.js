void function () {
	'use strict'

	//cookie
	var cookieKey = 'wvr'
	var cookieKeyV6 = 'wvr6'
	var cookieDomain = '.weibo.com'
	function _setCookie(key, value, path, days, domain) {
		var str = key + '=' + encodeURIComponent(value) + ';'
		if (path) str += 'path=' + path + ';'
		if (days) str += 'max-age=' + (60 * 60 * days) + ';'
		if (domain) str += 'domain=' + domain + ';'
		document.cookie = str
	}

	//url
	var path = location.pathname
	var query = location.search
	var req = path + query
	var paramV6 = 'wvr=6'
	var paramV5 = 'wvr=5'
	function _isV6URL(url) {
		url = url || req
		return $.str.include(url, paramV6)
	}
	function _restoreParamV5(url) {
		url = url || req
		return _isV6URL(url) ? url.split(paramV6).join(paramV5) : url
	}
	function _getPageType(url) {
		url = url || req
		var type = ''
		if ($.str.include(url, '/mygroups')) {
			type = 'group'
		} else if (/\/\w+\/home\b/.test(url)) {
			type = 'home'
		} else if (/\/\w+\/profile\b/.test(url)) {
			type = 'profile'
		} else if (/\/at\/\w+/.test(url)) {
			type = 'at'
		} else if (/\/fav\b/.test(url)) {
			type = 'fav'
		} else if (/\/friends\b/.test(url)) {
			type = 'friends'
		} else if (/\/sorry\b/.test(url)) {
			type = '404'
		}
		return type
	}
	function _getLinkPosition(url) {
		var pos = ''
		if ($.str.include(url, 'leftnav=1')) {
			pos = 'leftNav'
		} else if ($.str.include(url, 'topnav=1')) {
			pos = 'topNav'
		}
		return pos
	}

	//dom
	function _isLink(elem) {
		return !!(
			elem &&
			elem.tagName &&
			elem.tagName.toLowerCase() === 'a' &&
			elem.getAttribute('href')
		)
	}
	function _getLink(elem) {
		if (_isLink(elem)) return elem
		var parent = elem.parentNode
		if (_isLink(parent)) return parent
		var parent2 = elem.parentNode
		if (_isLink(parent2)) return parent2
		return null
	}

	//weibo config
	function _getWeiboConfig() {
		return unsafeWindow.$CONFIG || {}
	}
	function _isDebugMode() {
		var config = _getWeiboConfig()
		return config.uid === '1645021302' || config.domain === 'cssmagic'
	}
	function _isV6Page() {
		var config = _getWeiboConfig()
		var result = false
		if (config.pageid) {
			result = $.str.startsWith(config.pageid, 'v6')
		} else {
			var path = config.jsPath || config.cssPath || config.imgPath || ''
			result = $.str.include(path, '/t6/')
		}
		return result
	}

	//fn
	function redir(url, srcLink) {
		var isProduction = true
		var debugInfo = []
		if (_isDebugMode()) {
			debugInfo.push('current: ' + location.href)
			if (srcLink) {
				debugInfo.push('click link: ' + srcLink.getAttribute('href'))
			}
			debugInfo.push('redir to: ' + _restoreParamV5(url))
			isProduction = false
		}
		if (isProduction || confirm(debugInfo.join('\n\n'))) {
			location.href = url
		}
	}
	function restoreCookie() {
		_setCookie(cookieKey, '5', '/', 1, cookieDomain)
		_setCookie(cookieKeyV6, '0', '/', 1, cookieDomain)
	}
	function handleLink(ev) {
		var elem = _getLink(ev.target)
		if (elem) {
			var href = elem.getAttribute('href')
			var linkPos = _getLinkPosition(href)
			//some links will be intercepted by "pjax", so enforce jumping
			if (
				linkPos === 'leftNav'
			) {
				ev.preventDefault()
				redir(_restoreParamV5(href), elem)
			}
		}
	}
	function bind() {
		$.on(document.documentElement, 'click', handleLink)
	}

	//debug
	var LOG_PREFIX = '[Weibo-Keep-V5] '
	function logInit() {
		console.log(LOG_PREFIX + 'I\'m working for you!')
	}
	function logPageInfo() {
		console.log(LOG_PREFIX + 'Current: ' + (_isV6Page() ? 'v6' : 'v5'))
		if (_isDebugMode()) {
			console.log(LOG_PREFIX + 'Page type: ' + _getPageType())
			console.log(LOG_PREFIX + '====== DEBUG MODE ======')
		}
	}

	//init
	logInit()
	restoreCookie()
	logPageInfo()
	if (_isV6Page()) {
		bind()
	}

}()
