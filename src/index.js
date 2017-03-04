import api from './api';
import { login } from './login';

export default class GoogleTrends {
  constructor() {
    this.cookie = null;
    this.login = login;
  }

  interestByRegion(reqObj, cb) {
    return api('interest by region', this.cookie)(reqObj, cb);
  }

  interestOverTime(reqObj, cb) {
    return api('interest over time', this.cookie)(reqObj, cb);
  }

  relatedQueries(reqObj, cb) {
    return api('relatedQueries', this.cookie)(reqObj, cb);
  }

  relatedTopics(reqObj, cb) {
    return api('related Topics', this.cookie)(reqObj, cb);
  }

};
