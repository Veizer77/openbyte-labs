import type { CollectionBeforeChangeHook } from 'payload'

export type CalculatorRule = { relatedItemId: string; ruleType: 'requires' | 'excludes' }
export type CalculatorRuleNode = { id: string; rules: CalculatorRule[] }

function reachable(graph: Map<string, string[]>, start: string, target: string): boolean {
  const visited = new Set<string>()
  const pending = [...(graph.get(start) ?? [])]

  while (pending.length) {
    const current = pending.pop()!
    if (current === target) return true
    if (visited.has(current)) continue
    visited.add(current)
    pending.push(...(graph.get(current) ?? []))
  }
  return false
}

export function assertCalculatorRuleGraph(nodes: CalculatorRuleNode[]): void {
  const requires = new Map<string, string[]>()
  const excludes: Array<[string, string]> = []

  for (const node of nodes) {
    const requiredItems: string[] = []
    for (const rule of node.rules) {
      if (rule.relatedItemId === node.id) {
        throw new Error('Item kalkulator tidak dapat memiliki aturan terhadap dirinya sendiri.')
      }
      if (rule.ruleType === 'requires') requiredItems.push(rule.relatedItemId)
      else excludes.push([node.id, rule.relatedItemId])
    }
    requires.set(node.id, requiredItems)
  }

  for (const start of requires.keys()) {
    if (reachable(requires, start, start)) {
      throw new Error('Aturan requires tidak boleh membentuk siklus.')
    }
  }

  for (const [left, right] of excludes) {
    if (reachable(requires, left, right) || reachable(requires, right, left)) {
      throw new Error('Aturan excludes bertentangan dengan aturan requires.')
    }
  }
}

function relationID(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'id' in value) {
    const id = value.id
    if (typeof id === 'string' || typeof id === 'number') return String(id)
  }
  return null
}

function rulesFrom(value: unknown): CalculatorRule[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return []
    const relatedItemId = relationID(entry.relatedItem)
    const ruleType = entry.ruleType
    if (!relatedItemId || (ruleType !== 'requires' && ruleType !== 'excludes')) return []
    return [{ relatedItemId, ruleType }]
  })
}

export const validateCalculatorRules: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (!data) return data
  const result = await req.payload.find({
    collection: 'calculator-items',
    limit: 1000,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  const currentID = originalDoc?.id == null ? '__new_calculator_item__' : String(originalDoc.id)
  const nodes: CalculatorRuleNode[] = result.docs
    .filter((item) => String(item.id) !== currentID)
    .map((item) => ({ id: String(item.id), rules: rulesFrom(item.rules) }))
  nodes.push({ id: currentID, rules: rulesFrom(data.rules ?? originalDoc?.rules) })

  assertCalculatorRuleGraph(nodes)
  return data
}
