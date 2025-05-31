import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCOUNTS = [
  {
    email: 'jane.smith@gmail.com',
    id: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    name: 'Jane Smith',
    plan: 'free',
    type: 'personal',
  },
  {
    email: 'jane.smith@work.com',
    id: '9e525f6f-b60e-4258-8c30-c289619525d6',
    name: 'Jane Doe Smith',
    plan: 'pro',
    type: 'business',
  },
  {
    email: 'janesmith85@hotmail.com',
    id: 'd71ab200-18ed-4384-a4a7-a907bf169c9f',
    inactive: true,
    name: 'Jane S.',
    plan: 'free',
    type: 'personal',
  },
];

const CONTACTS = [
  // Contacts for Jane Smith (personal account)
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    company: 'Tech Solutions Inc',
    email: 'john.doe@gmail.com',
    name: 'John Doe',
    phone: '+1-555-0123',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    company: 'Marketing Pro',
    email: 'sarah.w@outlook.com',
    name: 'Sarah Wilson',
    phone: '+1-555-0124',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    email: 'mike.johnson@yahoo.com',
    name: 'Mike Johnson',
    phone: '+1-555-0125',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    company: 'Design Studio',
    email: 'emily.chen@gmail.com',
    name: 'Emily Chen',
    phone: '+1-555-0126',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    company: 'Consulting Group',
    email: 'david.brown@hotmail.com',
    name: 'David Brown',
    phone: '+1-555-0127',
  },
  // Contacts for Jane Doe Smith (business account)
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Global Enterprises',
    email: 'r.anderson@corp.com',
    name: 'Robert Anderson',
    phone: '+1-555-0128',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Strategic Partners',
    email: 'lisa.taylor@business.com',
    name: 'Lisa Taylor',
    phone: '+1-555-0129',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Innovation Labs',
    email: 'james.miller@enterprise.org',
    name: 'James Miller',
    phone: '+1-555-0130',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Tech Innovations',
    email: 'maria.garcia@solutions.net',
    name: 'Maria Garcia',
    phone: '+1-555-0131',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Industrial Systems',
    email: 'alex.thompson@industry.com',
    name: 'Alex Thompson',
    phone: '+1-555-0132',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Corporate Solutions',
    email: 'jennifer.lee@corporate.biz',
    name: 'Jennifer Lee',
    phone: '+1-555-0133',
  },
];

async function seed() {
  await Promise.all(
    ACCOUNTS.map(account => {
      return prisma.account.create({
        data: {
          email: account.email,
          id: account.id,
          inactive: account.inactive,
          name: account.name,
          plan: account.plan,
          type: account.type,
        },
      });
    }),
  )
    .then(() => {
      return console.info('[SEED] Successfully create account records');
    })
    .catch(e => {
      return console.error('[SEED] Failed to create account records', e);
    });
  await Promise.all(
    CONTACTS.map(contact => {
      return prisma.contact.create({
        data: {
          accountId: contact.accountId,
          company: contact.company,
          email: contact.email,
          name: contact.name,
          phone: contact.phone,
        },
      });
    }),
  )
    .then(() => {
      return console.info('[SEED] Successfully create contact records');
    })
    .catch(e => {
      return console.error('[SEED] Failed to create contact records', e);
    });
}

seed();
