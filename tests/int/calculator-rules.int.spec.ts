import { describe, expect, it } from 'vitest'
import { assertCalculatorRuleGraph } from '../../src/hooks/validate-calculator-rules'

describe('calculator rule validation', () => {
  it('rejects a direct self-reference', () => {
    expect(() =>
      assertCalculatorRuleGraph([
        { id: 'a', rules: [{ relatedItemId: 'a', ruleType: 'requires' }] },
      ]),
    ).toThrow('tidak dapat memiliki aturan terhadap dirinya sendiri')
  })

  it('rejects transitive requires cycles', () => {
    expect(() =>
      assertCalculatorRuleGraph([
        { id: 'a', rules: [{ relatedItemId: 'b', ruleType: 'requires' }] },
        { id: 'b', rules: [{ relatedItemId: 'c', ruleType: 'requires' }] },
        { id: 'c', rules: [{ relatedItemId: 'a', ruleType: 'requires' }] },
      ]),
    ).toThrow('membentuk siklus')
  })

  it('rejects excludes that conflict with transitive requires', () => {
    expect(() =>
      assertCalculatorRuleGraph([
        {
          id: 'a',
          rules: [
            { relatedItemId: 'b', ruleType: 'requires' },
            { relatedItemId: 'c', ruleType: 'excludes' },
          ],
        },
        { id: 'b', rules: [{ relatedItemId: 'c', ruleType: 'requires' }] },
        { id: 'c', rules: [] },
      ]),
    ).toThrow('bertentangan')
  })

  it('allows an acyclic requires graph and compatible exclusions', () => {
    expect(() =>
      assertCalculatorRuleGraph([
        { id: 'a', rules: [{ relatedItemId: 'b', ruleType: 'requires' }] },
        { id: 'b', rules: [] },
        { id: 'c', rules: [{ relatedItemId: 'a', ruleType: 'excludes' }] },
      ]),
    ).not.toThrow()
  })
})
