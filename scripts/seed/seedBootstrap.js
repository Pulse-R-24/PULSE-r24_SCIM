require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const workflowStates = [
  { key: 'DRAFT', label: 'Draft' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'CHANGES_REQUESTED', label: 'Changes Requested' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PUBLISHED', label: 'Published' },
  { key: 'ARCHIVED', label: 'Archived' }
]

const rolePermissions = {
  SUPER_ADMIN: [
    'can_publish',
    'can_delete',
    'can_manage_users',
    'can_upload_media',
    'can_manage_settings',
    'can_view_analytics',
    'can_view_reports',
    'can_view_evidence',
    'can_upload_evidence',
    'can_delete_evidence',
    'can_create_reports',
    'can_edit_reports',
    'can_publish_reports',
    'can_delete_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports',
    'can_archive_reports'
  ],
  ADMIN: [
    'can_manage_users',
    'can_manage_settings',
    'can_view_analytics',
    'can_view_reports',
    'can_view_evidence',
    'can_upload_evidence',
    'can_delete_evidence',
    'can_create_reports',
    'can_edit_reports',
    'can_delete_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports',
    'can_archive_reports'
  ],
  ANALYST: [
    'can_view_analytics',
    'can_view_reports',
    'can_view_evidence',
    'can_upload_evidence',
    'can_create_reports',
    'can_edit_reports',
    'can_submit_reports'
  ],
  EDITOR: [
    'can_publish',
    'can_upload_media',
    'can_view_reports',
    'can_view_evidence',
    'can_upload_evidence',
    'can_delete_evidence',
    'can_create_reports',
    'can_edit_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports'
  ],
  FACT_CHECKER: [
    'can_view_analytics',
    'can_view_reports',
    'can_view_evidence',
    'can_review_reports',
    'can_approve_reports'
  ],
  PUBLISHER: [
    'can_publish',
    'can_view_reports',
    'can_view_evidence',
    'can_publish_reports',
    'can_archive_reports'
  ],
  VIEWER: ['can_view_reports', 'can_view_evidence']
}

const demoUsers = [
  {
    email: process.env.ADMIN_EMAIL || 'admin@pulse-r24.local',
    password: process.env.ADMIN_PASSWORD || 'SuperSecret123!',
    name: process.env.ADMIN_NAME || 'Super Admin',
    role: 'SUPER_ADMIN'
  },
  {
    email: process.env.DEMO_ANALYST_EMAIL || 'analyst@pulse-r24.local',
    password: process.env.DEMO_PASSWORD || 'DemoPass123!',
    name: 'Demo Analyst',
    role: 'ANALYST'
  },
  {
    email: process.env.DEMO_EDITOR_EMAIL || 'editor@pulse-r24.local',
    password: process.env.DEMO_PASSWORD || 'DemoPass123!',
    name: 'Demo Editor',
    role: 'EDITOR'
  },
  {
    email: process.env.DEMO_REVIEWER_EMAIL || 'reviewer@pulse-r24.local',
    password: process.env.DEMO_PASSWORD || 'DemoPass123!',
    name: 'Demo Reviewer',
    role: 'FACT_CHECKER'
  },
  {
    email: process.env.DEMO_PUBLISHER_EMAIL || 'publisher@pulse-r24.local',
    password: process.env.DEMO_PASSWORD || 'DemoPass123!',
    name: 'Demo Publisher',
    role: 'PUBLISHER'
  }
]

async function seedWorkflowStates() {
  for (const state of workflowStates) {
    await prisma.workflowState.upsert({
      where: { key: state.key },
      update: { label: state.label },
      create: state
    })
  }
}

async function seedRolesAndPermissions() {
  const permissionNames = Array.from(new Set(Object.values(rolePermissions).flat()))
  const permissions = new Map()

  for (const name of permissionNames) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    permissions.set(name, permission)
  }

  const roles = new Map()
  for (const name of Object.keys(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    roles.set(name, role)
  }

  for (const [roleName, permissionList] of Object.entries(rolePermissions)) {
    const role = roles.get(roleName)
    for (const permissionName of permissionList) {
      const permission = permissions.get(permissionName)
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id }
      })
    }
  }

  return roles
}

async function seedDemoUsers(roles) {
  for (const demoUser of demoUsers) {
    const hashedPassword = await bcrypt.hash(demoUser.password, 10)
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: { hashed_password: hashedPassword, name: demoUser.name },
      create: {
        email: demoUser.email,
        name: demoUser.name,
        hashed_password: hashedPassword
      }
    })

    const role = roles.get(demoUser.role)
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id }
    })
  }
}

async function main() {
  await seedWorkflowStates()
  const roles = await seedRolesAndPermissions()
  await seedDemoUsers(roles)

  console.log('Bootstrapped workflow states, roles, permissions, and demo users.')
  console.log('Demo password:', process.env.DEMO_PASSWORD || 'DemoPass123!')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
