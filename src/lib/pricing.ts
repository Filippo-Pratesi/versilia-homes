import type { PricingRule } from '@/types';

export interface PriceCalculation {
  pricePerNight: number;
  nights: number;
  totalPrice: number;
  currency: 'EUR';
  minNights: number | null;
  ruleLabel: string;
}

/**
 * Calculates the number of nights between two date strings (YYYY-MM-DD).
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffMs = outDate.getTime() - inDate.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Determines whether a pricing rule's date range overlaps the requested period.
 * Rules without date_from / date_to are treated as "always applicable" date-range rules.
 */
function ruleOverlapsPeriod(
  rule: PricingRule,
  checkIn: string,
  checkOut: string
): boolean {
  if (!rule.date_from || !rule.date_to) return false;

  // Overlap when rule.date_from < checkOut AND rule.date_to > checkIn
  return rule.date_from < checkOut && rule.date_to > checkIn;
}

/**
 * Finds the best applicable pricing rule for a given period.
 *
 * Priority:
 * 1. Date-range rules that overlap the period — the one with the highest
 *    price_per_night wins (conservative / revenue-maximising approach).
 * 2. Default rule (is_default = true).
 * 3. null if no rules exist.
 */
export function findApplicableRule(
  rules: PricingRule[],
  checkIn: string,
  checkOut: string
): PricingRule | null {
  const dateRangeRules = rules.filter((r) =>
    ruleOverlapsPeriod(r, checkIn, checkOut)
  );

  if (dateRangeRules.length > 0) {
    // Pick the rule with the highest price per night among overlapping date-range rules
    return dateRangeRules.reduce((best, current) =>
      current.price_per_night > best.price_per_night ? current : best
    );
  }

  const defaultRule = rules.find((r) => r.is_default === true) ?? null;
  return defaultRule;
}

/**
 * Computes the full price breakdown for a stay.
 * Returns null if no applicable rule is found.
 */
export function calculatePrice(
  rules: PricingRule[],
  checkIn: string,
  checkOut: string
): PriceCalculation | null {
  const rule = findApplicableRule(rules, checkIn, checkOut);
  if (!rule) return null;

  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = rule.price_per_night * nights;

  return {
    pricePerNight: rule.price_per_night,
    nights,
    totalPrice,
    currency: 'EUR',
    minNights: rule.min_nights ?? null,
    ruleLabel: rule.label,
  };
}
