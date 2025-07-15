import { TestBed } from '@angular/core/testing';

import { BluetoothDataService } from './bluetooth-data.service';

describe('BluetoothDataService', () => {
  let service: BluetoothDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BluetoothDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
