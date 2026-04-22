import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  shieldCheckmarkOutline,
  keyOutline,
  lockClosedOutline,
  phonePortraitOutline,
  cloudOutline,
  checkmarkCircleOutline,
  linkOutline,
  logoGithub,
} from 'ionicons/icons';

/**
 * Tab4 — Privacy & Security Analysis
 *
 * Covers mobile-specific security concerns including:
 * - HTTPS and secure API communication
 * - Secure storage patterns
 * - Android permission management
 * - Capacitor security considerations
 * - GenAI usage declaration
 */
@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page {
  /** Security topics with mobile-specific focus */
  securityTopics = [
    {
      title: 'HTTPS & Secure API Communication',
      icon: 'cloud-outline',
      color: 'primary',
      description: 'All API calls use HTTPS (TLS 1.2+) to encrypt data in transit, preventing man-in-the-middle attacks.',
      practices: [
        'Angular HttpClient enforces HTTPS URLs',
        'No mixed-content (HTTP) requests are permitted',
        'API endpoint uses SCU university domain with SSL certificate',
        'Network errors are caught and reported without exposing sensitive data',
      ],
    },
    {
      title: 'Input Validation & Sanitization',
      icon: 'key-outline',
      color: 'success',
      description: 'Client-side validation prevents malformed data from reaching the server, reducing attack surface.',
      practices: [
        'All form fields are validated before submission',
        'Numeric fields reject negative values and non-numeric input',
        'String inputs are trimmed to prevent whitespace injection',
        'Ionic components automatically sanitize rendered content',
      ],
    },
    {
      title: 'No Local Data Persistence',
      icon: 'lock-closed-outline',
      color: 'warning',
      description: 'The app does not store sensitive data locally, eliminating risks associated with device theft or loss.',
      practices: [
        'No localStorage or sessionStorage usage for API data',
        'Items are fetched fresh from the API on each page load',
        'No cached credentials or authentication tokens',
        'Pull-to-refresh ensures data consistency with server',
      ],
    },
    {
      title: 'Android Permission Model',
      icon: 'phone-portrait-outline',
      color: 'secondary',
      description: 'Capacitor manages Android permissions through a declarative manifest, requesting only what is needed.',
      practices: [
        'Only INTERNET permission is required for API access',
        'No location, camera, or contact permissions are requested',
        'Capacitor plugins (haptics, network) use minimal permissions',
        'Android manifest follows principle of least privilege',
      ],
    },
    {
      title: 'Capacitor Security',
      icon: 'shield-checkmark-outline',
      color: 'tertiary',
      description: 'Capacitor provides a secure bridge between web and native layers with controlled access.',
      practices: [
        'WebView is configured with secure defaults',
        'Native plugin access is scoped to declared plugins only',
        'No eval() or dynamic code execution in the web layer',
        'Capacitor CLI handles secure signing for release builds',
      ],
    },
    {
      title: 'Error Handling & Information Disclosure',
      icon: 'checkmark-circle-outline',
      color: 'danger',
      description: 'Errors are handled gracefully without exposing internal system details to end users.',
      practices: [
        'HTTP errors are mapped to user-friendly messages',
        'Server error details are logged but not displayed to users',
        'Network failures show generic retry prompts',
        'No stack traces or internal URLs leak to the UI',
      ],
    },
  ];

  /** Best practices specific to this app */
  bestPractices = [
    {
      title: 'REST API with Server-Side Validation',
      description: 'The server validates all inputs independently, ensuring defense-in-depth even if client validation is bypassed.',
    },
    {
      title: 'Protected Item Rule',
      description: 'The "Laptop" item cannot be deleted, enforcing a business rule at both client and server level to prevent accidental data loss.',
    },
    {
      title: 'Content Security via Angular',
      description: 'Angular\'s template system automatically escapes interpolated values, preventing Cross-Site Scripting (XSS) attacks.',
    },
    {
      title: 'Minimal Dependency Footprint',
      description: 'The app uses only essential dependencies (Ionic, Capacitor), reducing the attack surface from third-party vulnerabilities.',
    },
  ];

  /** References */
  references = [
    { title: 'OWASP Mobile Security', url: 'https://owasp.org/www-project-mobile-security/' },
    { title: 'Android Security Best Practices', url: 'https://developer.android.com/training/articles/security-tips' },
    { title: 'Capacitor Security Guide', url: 'https://capacitorjs.com/docs/guides/security' },
    { title: 'Angular Security', url: 'https://angular.dev/best-practices/security' },
    { title: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework' },
  ];

  constructor() {
    addIcons({
      shieldCheckmarkOutline,
      keyOutline,
      lockClosedOutline,
      phonePortraitOutline,
      cloudOutline,
      checkmarkCircleOutline,
      linkOutline,
      logoGithub,
    });
  }

  /** Open URL in system browser */
  openLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
