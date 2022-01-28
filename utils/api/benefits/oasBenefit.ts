import { Translations } from '../../../i18n/api'
import {
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import { MAX_OAS_ENTITLEMENT, MAX_OAS_INCOME } from '../definitions/legalValues'
import {
  EligibilityResult,
  EntitlementResult,
  ProcessedInput,
} from '../definitions/types'
import { BaseBenefit } from './_base'

export class OasBenefit extends BaseBenefit {
  constructor(input: ProcessedInput, translations: Translations) {
    super(input, translations)
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqAge = this.input.age >= 65
    const meetsReqIncome = this.income < MAX_OAS_INCOME
    const requiredYearsInCanada = this.input.livingCountry.canada ? 10 : 20
    const meetsReqYears =
      this.input.yearsInCanadaSince18 >= requiredYearsInCanada
    const meetsReqLegal = this.input.legalStatus.canadian

    // main checks
    if (meetsReqIncome && meetsReqLegal && meetsReqYears) {
      if (meetsReqAge) {
        return {
          result: ResultKey.ELIGIBLE,
          reason: ResultReason.NONE,
          detail: this.translations.detail.eligible,
        }
      } else if (this.input.age == 64) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE,
          detail: this.translations.detail.eligibleWhen65ApplyNow,
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE,
          detail: this.translations.detail.eligibleWhen65,
        }
      }
    } else if (!meetsReqIncome) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.INCOME,
        detail: this.translations.detail.mustMeetIncomeReq,
      }
    } else if (!meetsReqYears) {
      if (
        this.input.livingCountry.agreement ||
        this.input.everLivedSocialCountry
      ) {
        if (meetsReqAge) {
          return {
            result: ResultKey.CONDITIONAL,
            reason: ResultReason.YEARS_IN_CANADA,
            detail: this.translations.detail.dependingOnAgreement,
          }
        } else {
          return {
            result: ResultKey.INELIGIBLE,
            reason: ResultReason.AGE,
            detail: this.translations.detail.dependingOnAgreementWhen65,
          }
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.YEARS_IN_CANADA,
          detail: this.translations.detail.mustMeetYearReq,
        }
      }
    } else if (!meetsReqLegal) {
      if (!meetsReqAge) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE,
          detail: this.translations.detail.dependingOnLegalWhen65,
        }
      } else if (this.input.legalStatus.sponsored) {
        return {
          result: ResultKey.CONDITIONAL,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegalSponsored,
        }
      } else {
        return {
          result: ResultKey.CONDITIONAL,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegal,
        }
      }
    } else if (this.input.livingCountry.noAgreement) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.SOCIAL_AGREEMENT,
        detail: this.translations.detail.ineligibleYearsOrCountry,
      }
    }
    // fallback
    throw new Error('should not be here')
  }

  protected getEntitlement(): EntitlementResult {
    if (this.eligibility.result !== ResultKey.ELIGIBLE)
      return { result: 0, type: EntitlementResultType.NONE }

    const result = this.getEntitlementAmount()
    const type =
      this.input.yearsInCanadaSince18 < 40
        ? EntitlementResultType.PARTIAL
        : EntitlementResultType.FULL
    const detailOverride =
      type === EntitlementResultType.PARTIAL
        ? this.translations.detail.eligiblePartialOas
        : undefined

    return { result, type, detailOverride }
  }

  private getEntitlementAmount(): number {
    return this.roundToTwo(
      Math.min(this.input.yearsInCanadaSince18 / 40, 1) * MAX_OAS_ENTITLEMENT
    )
  }
}
