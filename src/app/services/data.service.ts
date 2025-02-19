import { Injectable } from '@angular/core';
import mockDataJson from 'src/app/data/data.json';

@Injectable({ providedIn: 'root' })
export class DataService {
  mockData = mockDataJson;

  constructor() {}

  getHistories() {
    return this.mockData.histories;
  }

  getSeenFirtsHistories() {
    return this.mockData.histories.sort((story1: any, story2: any) =>
      story1.seen > story2.seen ? 1 : story1.seen == story2.seen ? 0 : -1
    );
  }

  getArticles() {
    return this.mockData.articles;
  }

  getEvents() {
    return this.mockData.events;
  }

  getFollow() {
    return this.mockData.follow;
  }

  getFeed() {
    return this.mockData.feeds;
  }

  getStories() {
    return this.mockData.stories;
  }

  getGroups() {
    return this.mockData.groups;
  }

  getComments() {
    return this.mockData.comments;
  }

  getUsers() {
    return this.mockData.users;
  }

  getMessages() {
    return this.mockData.messages;
  }
  getNotifications() {
    return this.mockData.notifications;
  }
}
