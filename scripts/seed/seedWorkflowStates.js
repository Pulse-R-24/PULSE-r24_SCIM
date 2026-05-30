const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const states = [
    { key: 'DRAFT', label: 'Draft' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'CHANGES_REQUESTED', label: 'Changes Requested' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'PUBLISHED', label: 'Published' },
    { key: 'ARCHIVED', label: 'Archived' }
  ]

  for (const state of states) {
    await prisma.workflowState.upsert({
      where: { key: state.key },
      update: { label: state.label },
      create: { key: state.key, label: state.label }
    })
  }

  console.log('Seeded workflow states successfully.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
