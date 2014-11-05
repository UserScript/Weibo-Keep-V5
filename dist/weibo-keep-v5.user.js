// ==UserScript==
// @name            Weibo-Keep-V5
// @version         0.1.2
// @author          cssmagic
// @namespace       https://github.com/UserScript
// @homepage        https://github.com/UserScript/Weibo-Keep-V5
// @description     To keep Sina Weibo at V5.
// @description:zh  让新浪微博保持在 V5 界面。
// @downloadURL     https://rawgit.com/UserScript/Weibo-Keep-V5/master/dist/weibo-keep-v5.user.js
// @updateURL       https://rawgit.com/UserScript/Weibo-Keep-V5/master/src/meta.js
// @icon            http://weibo.com/favicon.ico
// @grant           unsafeWindow
// @noframes
// @include         http://weibo.com/*
// @include         http://www.weibo.com/*
// @exclude         http://weibo.com/
// @exclude         http://www.weibo.com/
// ==/UserScript==

/*!
 * Tiny.js v0.4.0
 * https://github.com/UserScript/tiny.js
 */

void function (root) {
	'use strict'

	//namespace
	var $ = function (s, eWrapper) {
		return (eWrapper || document).querySelectorAll(s)
	}

	//type
	$.isArray = function (arr) {
		return Array.isArray(arr)
	}

	//data collection
	//TODO
	//$.extend()
	$.each = function (arr, fn, context) {
		//todo: object
		for (var i = 0, l = arr.length; i < l; ++i) {
			fn.call(context || window, arr[i], i, arr)
		}
	}
	$.inArray = function (arr, item) {
		if (!$.isArray(arr)) return false
		return arr.indexOf(item) > -1
	}

	//str
	$.str = {}
	$.str.include = function (so, s) {
		return so.indexOf(s) > -1
	}
	//TODO
	//$.str.endsWith()
	$.str.startsWith = function (so, s) {
		return so.indexOf(s) === 0
	}

	//dom query
	$.id = function (s) {
		return document.getElementById(s)
	}
	$.cls = function (s, eWrapper) {
		return (eWrapper || document).getElementsByClassName(s)
	}
	$.tag = function (s, eWrapper) {
		return (eWrapper || document).getElementsByTagName(s)
	}

	//create
	$.createElem = function (s) {
		return document.createElement(s)
	}
	$.createText = function (s) {
		return document.createTextNode(s)
	}

	//mod dom
	//TODO
	//$.after()
	//$.insertAfter()
	$.insertBefore = function (e, eTarget) {
		eTarget.parentNode.insertBefore(e, eTarget)
	}
	$.before = function (eTarget, e) {
		eTarget.parentNode.insertBefore(e, eTarget)
	}
	//TODO
	//$.prepend()
	//$.prependTo()
	$.append = function (eWrapper, e) {
		eWrapper.appendChild(e)
	}
	$.appendTo = function (e, eWrapper) {
		eWrapper.appendChild(e)
	}
	$.remove = function (e) {
		e.parentNode.removeChild(e)
	}

	//class name
	$.hasClass = function (e, s) {
		return $.str.include(' ' + e.className + ' ', ' ' + s + ' ')
	}
	$.addClass = function (e, s) {
		if (!$.hasClass(e, s)) {
			e.className += (' ' + s)
		}
	}
	$.removeClass = function (e, s) {
		if ($.hasClass(e, s)) {
			e.className = (' ' + e.className + ' ').replace(' ' + s + ' ', ' ').trim()
		}
	}

	//style
	$.hide = function (e) {
		e.style.display = 'none'
	}
	$.show = function (e) {
		e.style.display = ''
	}
	$.css = function (e, prop, val) {
		if (arguments.length === 3) {
			e.style[prop] = val
		} else {
			e.style.cssText = prop
		}
	}
	$.insertCSS = function (s) {
		if (!s) return false
		var e = $.createElem('style')
		e.innerHTML = s
		$.tag('head')[0].appendChild(e)
		return e
	}

	//event
	$.on = function (e, sEvent, fn) {
		e.addEventListener(sEvent, fn, false)
	}
	$.off = function (e, sEvent, fn) {
		e.removeEventListener(sEvent, fn, false)
	}

	//exports
	root.$ = $

}(this)
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
