/**
 * Browser environment type definitions for performance tests
 */

// Extend Window interface with performance APIs
declare global {
  interface Window {
    performance: Performance;
    requestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  // Performance Observer types for Web Vitals
  interface PerformanceObserverEntryList {
    getEntries(): PerformanceEntry[];
    getEntriesByType(type: string): PerformanceEntry[];
    getEntriesByName(name: string, type?: string): PerformanceEntry[];
  }

  interface PerformanceObserver {
    observe(options: { entryTypes: string[] } | { type: string }): void;
    disconnect(): void;
  }

  // Web Vitals specific entry types
  interface PerformancePaintTiming extends PerformanceEntry {
    readonly entryType: 'paint';
    readonly name: 'first-paint' | 'first-contentful-paint';
  }

  interface PerformanceLongTaskTiming extends PerformanceEntry {
    readonly entryType: 'longtask';
  }

  interface PerformanceLayoutShiftTiming extends PerformanceEntry {
    readonly entryType: 'layout-shift';
    readonly value: number;
    readonly hadRecentInput: boolean;
  }

  interface PerformanceFirstInputTiming extends PerformanceEntry {
    readonly entryType: 'first-input';
    readonly processingStart: number;
  }

  interface PerformanceLargestContentfulPaintTiming extends PerformanceEntry {
    readonly entryType: 'largest-contentful-paint';
    readonly renderTime: number;
    readonly loadTime: number;
    readonly size: number;
  }

  // Puppeteer page extensions
  namespace Puppeteer {
    interface Page {
      waitForTimeout?(timeout: number): Promise<void>;
    }
  }
}

// Network conditions for Puppeteer
export interface NetworkConditions {
  offline: boolean;
  latency: number;
  download: number;
  upload: number;
}

export {};