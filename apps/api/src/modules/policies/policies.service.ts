import { Injectable } from '@nestjs/common';

@Injectable()
export class PoliciesService {
  getTermsOfService(): string {
    return `# Terms of Service

Welcome to Grossanzeigen. By using our services, you agree to these Terms.

- You must be at least 18 years old.
- You are responsible for the content you post.
- We may remove content that violates our policies.
- Payments are processed via Stripe; disputes follow our dispute process.

This MVP document will evolve.`;
  }

  getPrivacyPolicy(): string {
    return `# Privacy Policy

We collect minimal data to operate the marketplace:

- Account basics: email and password hash
- Listing and messaging metadata
- Logs for security and abuse prevention

We do not sell personal data. See our full policy updates here over time.`;
  }

  getProhibitedItems(): string {
    return `# Prohibited Items

The following are not allowed:

- Illegal drugs and paraphernalia
- Firearms, explosives, and related parts
- Stolen goods or government property
- Counterfeit items and unauthorized replicas
- Adult content and services

This list is non-exhaustive and may be updated.`;
  }

  getCommunityGuidelines(): string {
    return `# Community Guidelines

Help keep Grossanzeigen safe and useful:

- Be respectful; no harassment or hate speech
- Accurately describe items; avoid misleading content
- Report suspicious activity or policy violations
- Protect your privacy; avoid sharing sensitive info

Violations may result in content removal or account actions.`;
  }
}


