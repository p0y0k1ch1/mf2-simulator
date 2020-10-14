import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService
{
  constructor() {}

  validateNumberString(s: string, min: number, max: number): { [key: string]: any } | null
  {
    const parsed = parseInt(s, 10);
    if (isNaN(parsed)) {
      return { valid: { value: s } };
    }
    if (parsed < min || parsed > max) {
      return { valid: { value: s } };
    }
    return null;
  }
}
