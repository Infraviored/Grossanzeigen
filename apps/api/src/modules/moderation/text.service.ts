import { Injectable } from '@nestjs/common';

const banned = [
  /\b(?:terror|bomb|explosive)\b/i,
  /\b(?:cocaine|heroin|meth)\b/i,
  /\b(?:fake passport|counterfeit)\b/i,
];

@Injectable()
export class TextModerationService {
  check(text: string): { flagged: boolean; reason?: string } {
    for (const re of banned) {
      if (re.test(text)) return { flagged: true, reason: `matches:${re.source}` };
    }
    return { flagged: false };
  }
}


