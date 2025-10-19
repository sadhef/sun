require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Client = require('./models/Client');
const Course = require('./models/Course');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDatabase();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Client.deleteMany({});
    await Course.deleteMany({});

    // Create default admin user
    console.log('Creating default admin user...');
    const adminUser = await User.create({
      name: 'Institute Admin',
      email: 'institute@gmail.com',
      password: 'client@123',
      role: 'Admin',
      isActive: true
    });
    console.log(`✓ Admin user created: ${adminUser.email}`);

    // Create sample clients
    console.log('Creating sample clients...');
    const clients = await Client.insertMany([
      {
        name: 'Apex Global Services',
        type: 'company',
        contact: {
          contactName: 'Jane Doe',
          contactPhone: '555-1001',
          contactEmail: 'jane.doe@apex.com'
        }
      },
      {
        name: 'Tech Solutions Inc',
        type: 'company',
        contact: {
          contactName: 'John Smith',
          contactPhone: '555-1002',
          contactEmail: 'john.smith@techsolutions.com'
        }
      },
      {
        name: 'Healthcare Professionals Ltd',
        type: 'company',
        contact: {
          contactName: 'Sarah Johnson',
          contactPhone: '555-1003',
          contactEmail: 'sarah.j@healthcare.com'
        }
      }
    ]);
    console.log(`✓ Created ${clients.length} sample clients`);

    // Create sample courses
    console.log('Creating sample courses...');
    const courses = await Course.insertMany([
      {
        name: 'Fire Warden Training',
        code: 'FW-001',
        description: 'Comprehensive fire safety and emergency evacuation training',
        cost: 45.00,
        duration: { hours: 4, days: 1 },
        classCapacity: 15,
        category: 'Safety',
        isActive: true
      },
      {
        name: 'First Aid Training',
        code: 'FA-001',
        description: 'Basic first aid and CPR certification course',
        cost: 60.00,
        duration: { hours: 8, days: 1 },
        classCapacity: 12,
        category: 'Health & Safety',
        isActive: true
      },
      {
        name: 'Health & Safety at Work',
        code: 'HS-001',
        description: 'Workplace health and safety regulations and best practices',
        cost: 55.00,
        duration: { hours: 6, days: 1 },
        classCapacity: 20,
        category: 'Safety',
        isActive: true
      },
      {
        name: 'Manual Handling Training',
        code: 'MH-001',
        description: 'Safe lifting and handling techniques',
        cost: 40.00,
        duration: { hours: 3, days: 1 },
        classCapacity: 15,
        category: 'Safety',
        isActive: true
      },
      {
        name: 'Food Hygiene Certificate',
        code: 'FH-001',
        description: 'Level 2 Food Safety and Hygiene certification',
        cost: 50.00,
        duration: { hours: 4, days: 1 },
        classCapacity: 18,
        category: 'Food Safety',
        isActive: true
      },
      {
        name: 'Confined Space Training',
        code: 'CS-001',
        description: 'Safety procedures for working in confined spaces',
        cost: 75.00,
        duration: { hours: 6, days: 1 },
        classCapacity: 10,
        category: 'Safety',
        isActive: true
      },
      {
        name: 'Working at Heights',
        code: 'WH-001',
        description: 'Safety training for working at elevated positions',
        cost: 65.00,
        duration: { hours: 5, days: 1 },
        classCapacity: 12,
        category: 'Safety',
        isActive: true
      },
      {
        name: 'COSHH Training',
        code: 'CH-001',
        description: 'Control of Substances Hazardous to Health',
        cost: 45.00,
        duration: { hours: 4, days: 1 },
        classCapacity: 15,
        category: 'Safety',
        isActive: true
      },
      {
        name: 'Electrical Safety Training',
        code: 'ES-001',
        description: 'Electrical safety awareness and procedures',
        cost: 55.00,
        duration: { hours: 4, days: 1 },
        classCapacity: 15,
        category: 'Safety',
        isActive: true
      },
      {
        name: 'Risk Assessment Training',
        code: 'RA-001',
        description: 'Identifying and managing workplace risks',
        cost: 50.00,
        duration: { hours: 5, days: 1 },
        classCapacity: 20,
        category: 'Safety',
        isActive: true
      }
    ]);
    console.log(`✓ Created ${courses.length} sample courses`);

    console.log('\n========================================');
    console.log('Database seeding completed successfully!');
    console.log('========================================');
    console.log('\nLogin Credentials:');
    console.log('Email: institute@gmail.com');
    console.log('Password: client@123');
    console.log('Role: Admin');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
