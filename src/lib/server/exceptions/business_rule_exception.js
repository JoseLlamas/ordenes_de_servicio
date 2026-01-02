import { ApplicationException } from './application_exception';

/**
 * Excepción para violaciones de reglas de negocio
 */
export class BusinessRuleException extends ApplicationException {

  /**
   * @type {string | null}
   */
  #rule;

  /**
   * @param {string} message
   * @param {string} [rule] - Nombre de la regla violada
   */
  constructor (message, rule = 'BUSINESS_RULE_VIOLATION') {
    super(message, 422);
    this.#rule = rule;
  }

  get rule () {
    return this.#rule;
  }


}
