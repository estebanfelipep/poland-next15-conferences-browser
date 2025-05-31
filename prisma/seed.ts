import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCOUNTS = [
  {
    email: 'jane.smith@gmail.com',
    id: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    name: 'Jane Smith',
    type: 'personal',
  },
  {
    email: 'jane.doe.smith@work.com',
    id: '9e525f6f-b60e-4258-8c30-c289619525d6',
    name: 'Jane Doe Smith',
    type: 'business',
  },
];

const CONTACTS = [
  // Contacts for Jane Smith (personal account) - casual/random contacts
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    company: 'Local Music Band',
    email: 'john.doe.guitarist@gmail.com',
    name: 'John Doe',
    phone: '+1-555-0123',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    email: 'sarah.yogalover@outlook.com',
    name: 'Sarah Wilson',
    phone: '+1-555-0124',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    company: 'Corner Café',
    email: 'mike.coffee.addict@yahoo.com',
    name: 'Mike Johnson',
    phone: '+1-555-0125',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    email: 'emily.bookclub@gmail.com',
    name: 'Emily Chen',
    phone: '+1-555-0126',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    company: 'Happy Paws Dog Walking',
    email: 'david.dogwalker@hotmail.com',
    name: 'David Brown',
    phone: '+1-555-0127',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    company: 'Rosas Pizza Corner',
    email: 'mama.rosa.pizza@gmail.com',
    name: 'Rosa Martinez',
    phone: '+1-555-0140',
  },
  {
    accountId: 'a833bc10-64dd-4069-8573-4bbb4b0065ed',
    email: 'fitnessjenny@yahoo.com',
    name: 'Jenny Fitness',
    phone: '+1-555-0141',
  },
  // Contacts for Jane Doe Smith (business account) - professional business contacts
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Global Enterprises LLC',
    email: 'robert.anderson@globalenterprises.com',
    name: 'Robert Anderson',
    phone: '+1-555-0128',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Strategic Business Partners',
    email: 'lisa.taylor@strategicpartners.biz',
    name: 'Lisa Taylor',
    phone: '+1-555-0129',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Innovation Labs Corporation',
    email: 'james.miller@innovationlabs.corp',
    name: 'James Miller',
    phone: '+1-555-0130',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Enterprise Tech Solutions',
    email: 'maria.garcia@techsolutions.net',
    name: 'Maria Garcia',
    phone: '+1-555-0131',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Industrial Systems Group',
    email: 'alex.thompson@industrialsystems.com',
    name: 'Alex Thompson',
    phone: '+1-555-0132',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Corporate Solutions International',
    email: 'jennifer.lee@corporatesolutions.biz',
    name: 'Jennifer Lee',
    phone: '+1-555-0133',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Premier Financial Group',
    email: 'michael.executive@financialgroup.com',
    name: 'Michael Executive',
    phone: '+1-555-0134',
  },
  {
    accountId: '9e525f6f-b60e-4258-8c30-c289619525d6',
    company: 'Executive Business Advisors',
    email: 'patricia.consultant@businessadvisors.net',
    name: 'Patricia Consultant',
    phone: '+1-555-0135',
  },
];

async function seed() {
  await Promise.all(
    ACCOUNTS.map(account => {
      return prisma.account.create({
        data: {
          email: account.email,
          id: account.id,
          name: account.name,
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
