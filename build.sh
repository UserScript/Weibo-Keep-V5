#!/bin/sh
cat \
	src/meta.js \
	bower_components/tiny.js/src/tiny.js \
	src/main.js \
	> \
	dist/weibo-keep-v5.user.js
