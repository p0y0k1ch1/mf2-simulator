import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ValidatorService } from 'src/app/service/validator.service';

export interface ResultRow
{
  vda: number;
  d:   number;
  dc:  number;
}

@Component({
  selector: 'app-damage-page',
  templateUrl: './damage-page.component.html',
  styleUrls: [
    './damage-page.component.scss',
  ],
})
export class DamagePageComponent implements OnInit
{
  thresholds: number[] = [];

  resultColumns: string[] = ['vda', 'd', 'dc'];
  resultRows: ResultRow[] = [];

  conditionForm = this.fb.group({
    vaa: [
      999,
      [
        Validators.required,
        (control: AbstractControl): { [key: string]: any } | null => {
          return this.validatorService.validateNumberString(control.value, 1, 999);
        },
      ],
    ],
    vdd: [
      1,
      [
        Validators.required,
        (control: AbstractControl): { [key: string]: any } | null => {
          return this.validatorService.validateNumberString(control.value, 1, 999);
        },
      ],
    ],
    ds:  [
      78, // 竜巻アタック
      [
        Validators.required,
        (control: AbstractControl): { [key: string]: any } | null => {
          return this.validatorService.validateNumberString(control.value, 1, 80);
        },
      ],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
  ) {}

  ngOnInit(): void
  {
    this.initThresholds();
    this.updateResult(this.vaa.value, this.vdd.value, this.ds.value);
  }

  private initThresholds(): void
  {
    this.thresholds = [];
    this.thresholds.push(1);
    for (let i = 10; i <= 990; i += 10) {
      this.thresholds.push(i);
    }
    this.thresholds.push(999);
  }

  private calculateDamage(vaa: number, vda: number, vdd: number, ds: number): number
  {
    const w = Math.min(78, Math.floor(3 * (1 + vaa / 50 ) - 5 * ((1 + vda / 50) / 2 + (1 + vdd / 50)) / 2 + 50));
    return Math.min(999, Math.floor((1 + vaa / 50) * (ds - 1) * w / 100) - Math.min(1, Math.floor((ds - 1) / 10)));
  }

  private calculateCriticalDamage(d: number): number
  {
    return Math.min(999, Math.floor(d * 1.5));
  }

  get vaa()
  {
    return this.conditionForm.get('vaa');
  }

  get vdd()
  {
    return this.conditionForm.get('vdd');
  }

  get ds()
  {
    return this.conditionForm.get('ds');
  }

  updateResult(vaa: number, vdd: number, ds: number): void
  {
    this.resultRows = [];
    for (let vda of this.thresholds) {
      const d  = this.calculateDamage(vaa, vda, vdd, ds);
      const dc = this.calculateCriticalDamage(d);
      this.resultRows.push({
        vda: vda,
        d:   d,
        dc:  dc,
      });
    }
  }

  submit(): void
  {
    if (!this.conditionForm.valid) {
      return;
    }

    const vaa = parseInt(this.vaa.value, 10);
    const vdd = parseInt(this.vdd.value, 10);
    const ds  = parseInt(this.ds.value, 10);

    this.updateResult(vaa, vdd, ds);
  }
}
