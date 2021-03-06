import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.get(LoadingService)
  });

  it('should be in loading state during loading', () => {
    service.begin('test-1');
    expect(service.status.getValue()).toBe(true)
  });

  it('should be in loading state loading stopped', () => {
    service.begin('test-1');
    service.finish('test-1');
    expect(service.status.getValue()).toBe(false)
  });

  it('should be robust on multiple loading starts', () => {
    service.begin('test-1');
    service.begin('test-1');
    service.finish('test-1');
    expect(service.status.getValue()).toBe(false);
  });

  it('should be robust on multiple loading finished', () => {
    service.begin('test-1');
    service.finish('test-1');
    service.finish('test-1');
    expect(service.status.getValue()).toBe(false);
  });

  it('should handle loading of several apps', () => {
    service.begin('test-1');
    service.begin('test-2');
    service.finish('test-1');
    service.finish('test-1');
    expect(service.status.getValue()).toBe(true);
  });

  it('should finish all apps', () => {
    service.begin('test-1');
    service.begin('test-2');
    service.finish();
    expect(service.status.getValue()).toBe(false);
  });

  it('should know if an app is loading', () => {
    service.begin('test-1');
    service.begin('test-2');
    service.finish('test-1');
    service.isLoading('test-1').subscribe((isLoading) => {
      expect(isLoading).toBe(false)
    });
    service.isLoading('test-2').subscribe((isLoading) => {
      expect(isLoading).toBe(true)
    });
  });

});
