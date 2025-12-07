import 'dotenv/config'
import { db } from '../lib/db'
import { users, tasks, tags, taskTags } from '../lib/db/schema'
import { hashPassword } from '../lib/auth/password'

async function seed() {
  console.log('Seeding database...')

  // Create a sample user
  const hashedPassword = await hashPassword('password123')
  const [user] = await db.insert(users).values({
    email: 'admin@example.com',
    passwordHash: hashedPassword,
    fullName: 'Admin User',
  }).returning()

  console.log('Created user:', user.id)

  // Create some tags
  const [tag1] = await db.insert(tags).values({
    userId: user.id,
    name: 'Work',
    color: '#FF5733',
  }).returning()

  const [tag2] = await db.insert(tags).values({
    userId: user.id,
    name: 'Personal',
    color: '#33FF57',
  }).returning()

  const [tag3] = await db.insert(tags).values({
    userId: user.id,
    name: 'Urgent',
    color: '#3357FF',
  }).returning()

  console.log('Created tags:', tag1.id, tag2.id, tag3.id)

  // Create some tasks
  const [task1] = await db.insert(tasks).values({
    userId: user.id,
    title: 'Complete project proposal',
    description: 'Write and finalize the Q4 project proposal document.',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2025-12-15'),
  }).returning()

  const [task2] = await db.insert(tasks).values({
    userId: user.id,
    title: 'Buy groceries',
    description: 'Pick up milk, bread, and vegetables from the store.',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date('2025-12-10'),
  }).returning()

  const [task3] = await db.insert(tasks).values({
    userId: user.id,
    title: 'Schedule dentist appointment',
    description: 'Call the dentist office to book a check-up.',
    status: 'todo',
    priority: 'low',
  }).returning()

  const [task4] = await db.insert(tasks).values({
    userId: user.id,
    title: 'Review code changes',
    description: 'Review the pull request for the new feature.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2025-12-05'),
    completedAt: new Date('2025-12-06'),
  }).returning()

  console.log('Created tasks:', task1.id, task2.id, task3.id, task4.id)

  // Associate tags with tasks
  await db.insert(taskTags).values([
    { taskId: task1.id, tagId: tag1.id },
    { taskId: task1.id, tagId: tag3.id }, // Work and Urgent
    { taskId: task2.id, tagId: tag2.id }, // Personal
    { taskId: task4.id, tagId: tag1.id }, // Work
  ])

  console.log('Associated tags with tasks')

  console.log('Seeding completed successfully!')
}

seed().catch(console.error)