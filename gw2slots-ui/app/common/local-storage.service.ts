import { Injectable } from '@angular/core';

import * as moment from 'moment';

interface StoredValue<T> {
  expirationUnixMillis: number,
  key: string,
  value: T,
}

@Injectable()
export class LocalStorageService {
  private storage=window.localStorage;

  private getAndDeserialize<T>(key: string): StoredValue<T> {
    let serialized = this.storage.getItem(key);
    if (!serialized) {
      return undefined;
    }
    let deserialized: StoredValue<T> = JSON.parse(serialized);
    if (deserialized.expirationUnixMillis > 0 && deserialized.expirationUnixMillis < moment.now()) {
      this.removeItem(key);
      return undefined;
    }
    return deserialized;
  }

  setItem<T>(key: string, value: T, ttlMillis=0) {
    let storedValue: StoredValue<T> = {key, value, expirationUnixMillis: 0}
    if (ttlMillis > 0) {
      storedValue.expirationUnixMillis = moment.now() + ttlMillis;
    }
    let serialized = JSON.stringify(storedValue);
    this.storage.setItem(key, serialized);
  }

  hasItem(key: string): boolean {
    return this.getAndDeserialize<any>(key) != undefined;
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  getItem<T>(key: string): T {
    let storedValue = this.getAndDeserialize<T>(key);
    if (storedValue === undefined) {
      return undefined;
    }
    return storedValue.value;
 }

}
