import { TestBed } from '@angular/core/testing';
import { DomainService } from './domain.service';

describe('DomainService', () => {
  let service: DomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDomainInfo', () => {
    it('should detect main platform domain', () => {
      // Mock window.location.hostname
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'dokn.net'
        },
        writable: true
      });

      const info = service.getDomainInfo();
      
      expect(info.isMainPlatform).toBe(true);
      expect(info.isSubdomain).toBe(false);
      expect(info.isCustomDomain).toBe(false);
      expect(info.storeIdentifier).toBeNull();
    });

    it('should detect subdomain', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'store1.dokn.net'
        },
        writable: true
      });

      const info = service.getDomainInfo();
      
      expect(info.isMainPlatform).toBe(false);
      expect(info.isSubdomain).toBe(true);
      expect(info.isCustomDomain).toBe(false);
      expect(info.storeIdentifier).toBe('store1');
    });

    it('should detect custom domain', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'mystore.com'
        },
        writable: true
      });

      const info = service.getDomainInfo();
      
      expect(info.isMainPlatform).toBe(false);
      expect(info.isSubdomain).toBe(false);
      expect(info.isCustomDomain).toBe(true);
      expect(info.storeIdentifier).toBe('mystore.com');
    });

    it('should detect www subdomain as main platform', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'www.dokn.net'
        },
        writable: true
      });

      const info = service.getDomainInfo();
      
      expect(info.isMainPlatform).toBe(true);
      expect(info.isSubdomain).toBe(false);
    });
  });

  describe('getSubdomain', () => {
    it('should return subdomain if exists', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'store1.dokn.net'
        },
        writable: true
      });

      const subdomain = service.getSubdomain();
      expect(subdomain).toBe('store1');
    });

    it('should return null for main platform', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'dokn.net'
        },
        writable: true
      });

      const subdomain = service.getSubdomain();
      expect(subdomain).toBeNull();
    });
  });

  describe('isStoreView', () => {
    it('should return true for subdomain', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'store1.dokn.net'
        },
        writable: true
      });

      expect(service.isStoreView()).toBe(true);
    });

    it('should return true for custom domain', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'mystore.com'
        },
        writable: true
      });

      expect(service.isStoreView()).toBe(true);
    });

    it('should return false for main platform', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'dokn.net'
        },
        writable: true
      });

      expect(service.isStoreView()).toBe(false);
    });
  });

  describe('buildStoreUrl', () => {
    it('should build correct URL for production', () => {
      const url = service.buildStoreUrl('store1');
      expect(url).toContain('store1');
      expect(url).toContain('https://');
    });
  });
});
