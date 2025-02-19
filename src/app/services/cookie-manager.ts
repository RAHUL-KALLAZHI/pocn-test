import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class CookieManager {
	constructor() { }
	setCookie(name: string, val: string) {
		const date = new Date();
		const value = val;
		date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
		document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
	}

	getCookie(name: string) {
		const value = "; " + document.cookie;
		const parts = value.split("; " + name + "=");
		if (parts.length == 2) {
			return parts.pop().split(";").shift();
		}
	}

	deleteCookie(name: string) {
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";

	}
	getUrlVars() {
		const vars = []; 
		let hash = [];
		const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (let i = 0; i < hashes.length; i++) {
		  hash = hashes[i].split('=');
		  vars.push(hash[0]);
		  vars[hash[0]] = hash[1];
		  if (typeof (hash[1]) != 'string')
		    vars[hash[0]] = null;
		}
		return vars;
	      }
}