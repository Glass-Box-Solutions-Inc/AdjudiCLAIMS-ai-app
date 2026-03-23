/**
 * California Workers' Compensation benefit calculator.
 *
 * Computes Temporary Disability (TD) indemnity rates based on the
 * employee's Average Weekly Earnings (AWE) and the statutory rate
 * table in effect on the date of injury.
 *
 * Reference: California Labor Code sections 4653-4654
 */

export interface TDRateResult {
  /** Computed weekly TD rate in dollars */
  rate: number;
  /** Statutory minimum weekly rate for the injury date */
  statutory_min: number;
  /** Statutory maximum weekly rate for the injury date */
  statutory_max: number;
  /** Human-readable formula used */
  formula: string;
}

export interface TDRateParams {
  /** Average Weekly Earnings in dollars */
  awe: number;
  /** Date of injury -- determines which rate table applies */
  dateOfInjury: Date;
}

// TODO: Implement with current DWC rate tables
// The production implementation will:
//   1. Look up the statutory min/max for the date-of-injury year
//   2. Apply the 2/3 AWE formula (LC 4653)
//   3. Clamp to statutory floor and ceiling
//   4. Return the formula string for explainability

/**
 * Calculate the Temporary Disability weekly indemnity rate.
 *
 * @param params - AWE and date of injury
 * @returns Computed rate with statutory bounds and formula explanation
 */
export function calculateTDRate(params: TDRateParams): TDRateResult {
  const { awe, dateOfInjury } = params;

  // --- 2026 stub values (DWC rates effective 1/1/2026) ---
  // These are placeholder values and MUST be replaced with the
  // actual DWC-published rate table before production use.
  const statutory_min = 242.86;
  const statutory_max = 1_619.15;

  const rawRate = awe * (2 / 3);
  const rate = Math.min(Math.max(rawRate, statutory_min), statutory_max);

  const isoDate = dateOfInjury.toISOString().split('T')[0] ?? 'unknown';

  return {
    rate: Math.round(rate * 100) / 100,
    statutory_min,
    statutory_max,
    formula: `TD rate = min(max(AWE * 2/3, ${String(statutory_min)}), ${String(statutory_max)}) for DOI ${isoDate}`,
  };
}
