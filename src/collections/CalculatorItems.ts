import type { CollectionConfig } from 'payload'
import { contentTotpWrapperBypass, ownerEditorAccess } from '@/access/roles'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'
import { validateCalculatorRules } from '@/hooks/validate-calculator-rules'

const revalidation = revalidateCollectionTag('calculator')

const integerValue = (value: unknown) =>
  value == null ||
  (typeof value === 'number' && Number.isInteger(value) && value >= 0) ||
  'Masukkan bilangan bulat tidak negatif.'

export const CalculatorItems: CollectionConfig = {
  slug: 'calculator-items',
  labels: { singular: 'Item Kalkulator', plural: 'Item Kalkulator' },
  admin: {
    useAsTitle: 'label',
    group: 'Konten Website',
    defaultColumns: ['label', 'group', 'pricingType', 'isActive'],
  },
  access: ownerEditorAccess,
  custom: contentTotpWrapperBypass,
  orderable: true,
  hooks: {
    beforeChange: [validateCalculatorRules],
    afterChange: [auditCollectionChange('calculator-items'), revalidation.afterChange],
    afterDelete: [auditCollectionDelete('calculator-items'), revalidation.afterDelete],
  },
  fields: [
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'calculator-groups',
      required: true,
      index: true,
    },
    { name: 'label', type: 'text', required: true },
    { name: 'description', type: 'text' },
    {
      name: 'pricingType',
      type: 'select',
      required: true,
      defaultValue: 'flat',
      options: ['flat', 'per_unit'],
    },
    {
      name: 'unitLabel',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData?.pricingType === 'per_unit' },
    },
    {
      name: 'maxUnits',
      type: 'number',
      min: 1,
      validate: integerValue,
      admin: { condition: (_, siblingData) => siblingData?.pricingType === 'per_unit' },
    },
    {
      name: 'priceMin',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      validate: integerValue,
    },
    { name: 'priceMax', type: 'number', min: 0, validate: integerValue },
    {
      name: 'daysMin',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      validate: integerValue,
    },
    { name: 'daysMax', type: 'number', min: 0, validate: integerValue },
    { name: 'isDefault', type: 'checkbox', defaultValue: false },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    {
      name: 'rules',
      type: 'array',
      fields: [
        {
          name: 'relatedItem',
          type: 'relationship',
          relationTo: 'calculator-items',
          required: true,
        },
        { name: 'ruleType', type: 'select', required: true, options: ['requires', 'excludes'] },
      ],
    },
  ],
}
