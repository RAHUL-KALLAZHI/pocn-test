import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipeData implements PipeTransform {


  // transform(value: string, regexValue: string, replaceValue: string): any {
  //   let regex = new RegExp(regexValue, 'g');
  //   return value.replace(regex, replaceValue).replace('(','').replace(')','');
  // }
  transform(d: any): string {
  //   let date  = new Date();
  //  let hours = date.getHours();
  //  let minutes = date.getMinutes();
  //  let seconds = date.getSeconds();
  //  return seconds

    let currentDate = new Date(new Date().toUTCString());
    let date = new Date(d);

    let year = currentDate.getFullYear() - date.getFullYear();
    let month = currentDate.getMonth() - date.getMonth();
    let day = currentDate.getDate() - date.getDate();
    let hour = currentDate.getHours() - date.getHours();
    let minute = currentDate.getMinutes() - date.getMinutes();
    let second = currentDate.getSeconds() - date.getSeconds();
    let createdSecond = Math.floor(year * 31556926) + Math.floor(month * 2629746) + Math.floor(day * 86400) +  Math.floor(hour * 3600) + Math.floor(minute * 60) + Math.floor(second);
    if (createdSecond >= 31556926) {
      let yearAgo = Math.floor(createdSecond / 31556926);
      return yearAgo > 1 ? yearAgo + " years ago" : yearAgo + " year ago";
    } else if (createdSecond >= 2629746) {
      let monthAgo = Math.floor(createdSecond / 2629746);
      return monthAgo > 1 ? monthAgo + " months ago" : monthAgo + " month ago";
    } else if (createdSecond >= 86400) {
      let dayAgo = Math.floor(createdSecond / 86400);
      return dayAgo > 1 ? dayAgo + " days ago" : dayAgo + " day ago";
    } else if (createdSecond >= 3600) {
      let hourAgo = Math.floor(createdSecond / 3600);
      return hourAgo > 1 ? hourAgo + " hours ago" : hourAgo + " hour ago";
    } else if (createdSecond >= 60) {
      let minuteAgo = Math.floor(createdSecond / 60);
      return minuteAgo > 1 ? minuteAgo + " minutes ago" : minuteAgo + " minute ago";
    } else if (createdSecond < 60) {
      return createdSecond > 1 ? createdSecond + " seconds ago" : createdSecond + " second ago";
    } else if (createdSecond < 0) {
      return "0 second ago";
    }
  }
  }

