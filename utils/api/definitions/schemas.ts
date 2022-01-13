import Joi from 'joi'
import { Language } from '../../../i18n/api'
import { ALL_COUNTRY_CODES } from '../helpers/countryUtils'
import {
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from '../helpers/fieldClasses'
import { LegalStatus, MaritalStatus, PartnerBenefitStatus } from './enums'

/**
 * This is what the API expects to receive, with the below exceptions due to normalization:
 * - livingCountry accepts a string
 * - partnerIncome will be added to income if it is present
 *
 * When updating this, ensure you update:
 * - openapi.yaml
 * - insomnia.yaml (optional as it is infrequently used)
 * - fields.ts
 * - types.ts
 * - index.test.ts
 *
 * Note: Do not require fields here, do it in the benefit-specific schemas.
 */
export const RequestSchema = Joi.object({
  income: Joi.number().integer().min(0),
  age: Joi.number().integer().max(150),
  maritalStatus: Joi.string().valid(...Object.values(MaritalStatus)),
  livingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  legalStatus: Joi.string().valid(...Object.values(LegalStatus)),
  legalStatusOther: Joi.string().when('legalStatus', {
    not: Joi.exist().valid(LegalStatus.OTHER),
    then: Joi.forbidden(),
  }),
  yearsInCanadaSince18: Joi.number()
    .integer()
    .ruleset.max(Joi.ref('age', { adjust: (age) => age - 18 }))
    .message('Years in Canada should be no more than age minus 18'), // todo i18n
  everLivedSocialCountry: Joi.boolean(),
  partnerBenefitStatus: Joi.string()
    .valid(...Object.values(PartnerBenefitStatus))
    .when('maritalStatus', {
      not: Joi.exist().valid(MaritalStatus.MARRIED, MaritalStatus.COMMON_LAW),
      then: Joi.forbidden(),
    }),
  partnerIncome: Joi.number()
    .integer()
    .when('maritalStatus', {
      not: Joi.exist().valid(MaritalStatus.MARRIED, MaritalStatus.COMMON_LAW),
      then: Joi.forbidden(),
    }),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
  _maritalStatus: Joi.object().instance(MaritalStatusHelper),
  _partnerBenefitStatus: Joi.object().instance(PartnerBenefitStatusHelper),
})
