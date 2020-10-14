import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/service/validator.service';

export interface ResultRow
{
  vdd: number;
  h:   number;
}

@Component({
  selector: 'app-hit-rate-page',
  templateUrl: './hit-rate-page.component.html',
  styleUrls: [
    './hit-rate-page.component.scss',
  ],
})
export class HitRatePageComponent implements OnInit
{
  thresholds: number[] = [];

  resultColumns: string[] = ['vdd', 'h'];
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
    hs: [
      29, // ドクロビーム
      [
        Validators.required,
        (control: AbstractControl): { [key: string]: any } | null => {
          return this.validatorService.validateNumberString(control.value, -25, 30);
        }
      ]
    ],
  });

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
  ) {}

  ngOnInit(): void
  {
    this.initThresholds();
    this.updateResult(this.vaa.value, this.hs.value);
  }

  private initThresholds(): void
  {
    this.thresholds = [];
    this.thresholds.push(1);
    for (let i = 10; i <= 999; i += 10) {
      this.thresholds.push(i);
    }
    this.thresholds.push(999);
  }

  private calculateHitRate(vaa: number, vdd: number, hs: number): number
  {
    return Math.min(99, Math.max(1, Math.floor(4 * ((1 + vaa / 50) - (1 + vdd / 50)) + hs + 50)));
  }

  get vaa()
  {
    return this.conditionForm.get('vaa');
  }

  get hs()
  {
    return this.conditionForm.get('hs');
  }

  updateResult(vaa: number, hs: number): void
  {
    this.resultRows = [];
    for (let vdd of this.thresholds) {
      const h = this.calculateHitRate(vaa, vdd, hs);
      this.resultRows.push({
        vdd: vdd,
        h:   h,
      });
    }
  }

  submit(): void
  {
    if (!this.conditionForm.valid) {
      return;
    }

    const vaa = parseInt(this.vaa.value, 10);
    const hs  = parseInt(this.hs.value, 10);

    this.updateResult(vaa, hs);
  }
}
