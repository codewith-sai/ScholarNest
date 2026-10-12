import bcrypt from 'bcryptjs';
import { db } from './db.js';

export async function seedDatabase() {
  console.log('[Seed] Seeding ScholarNest database with Maharashtra & Central schemes...');

  // Reset collections
  await db.notification.deleteMany();
  await db.applicationTracking.deleteMany();
  await db.savedScholarship.deleteMany();
  await db.scholarship.deleteMany();
  // Optional: create admin only if explicitly provided in environment variables
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    let envAdmin = await db.user.findUnique({ where: { email: process.env.ADMIN_EMAIL } });
    if (!envAdmin) {
      const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await db.user.create({
        data: {
          name: process.env.ADMIN_NAME || 'ScholarNest Admin',
          email: process.env.ADMIN_EMAIL,
          passwordHash: adminPassword,
          role: 'ADMIN',
          enabled: true
        }
      });
      console.log(`[Seed] Created admin account from environment: ${process.env.ADMIN_EMAIL}`);
    }
  }

  // Create or retrieve Demo Student
  let student = await db.user.findUnique({ where: { email: 'student@scholarnest.local' } });
  if (!student) {
    const studentPassword = await bcrypt.hash('Student@123', 10);
    student = await db.user.create({
      data: {
        name: 'Pooja Patil',
        email: 'student@scholarnest.local',
        passwordHash: studentPassword,
        role: 'STUDENT',
        enabled: true,
        profile: {
          create: {
            gender: 'Female',
            dateOfBirth: new Date('2004-06-15'),
            state: 'Maharashtra',
            district: 'Pune',
            taluka: 'Haveli',
            city: 'Pune',
            domicileState: 'Maharashtra',
            category: 'OBC',
            casteCommunity: 'Kunbi',
            minorityStatus: false,
            disabilityStatus: false,
            annualIncome: 220000,
            incomeCertificate: true,
            parentOccupation: 'Farmer / Agriculture',
            educationLevel: 'Undergraduate',
            college: 'Government College of Engineering, Pune (COEP)',
            course: 'B.Tech / Engineering',
            branch: 'Computer Science',
            academicYear: 2,
            percentage: 82.5,
            cgpa: 8.2,
            profileCompleted: true
          }
        }
      },
      include: { profile: true }
    });
  } else {
    const prof = await db.studentProfile.findUnique({ where: { userId: student.id } });
    student.profile = prof;
  }

  // Flagship Maharashtra & Central Schemes
  const scholarshipsData = [
    {
      name: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)',
      provider: 'Directorate of Higher Education',
      governmentDepartment: 'Higher and Technical Education Department, Govt of Maharashtra',
      schemeLevel: 'STATE',
      applicableStates: ['Maharashtra'],
      description: 'Provides 50% tuition fee and exam fee financial assistance to economically backward class (EBC) students admitted through the Centralized Admission Process (CAP) in approved higher education and professional degree courses.',
      scholarshipType: 'Need-cum-Merit',
      benefits: '50% Tuition Fee and Exam Fee reimbursement directly credited to the institution/student.',
      tuitionFee: '50% of approved Tuition Fee',
      maintenanceAllowance: 'Exam fee reimbursement as per university norms',
      hostelAllowance: 'Not applicable under this scheme',
      amount: 45000,
      openingDate: new Date('2026-08-01'),
      deadline: new Date('2026-11-30'),
      applicationUrl: 'https://mahadbt.maharashtra.gov.in/',
      officialInfoUrl: 'https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData?str=E9DDFA9707DA6C02',
      applicationInstructions: '1. Register on MahaDBT portal with Aadhaar.\n2. Complete your student profile.\n3. Navigate to Higher and Technical Education Department.\n4. Select Rajarshi Chhatrapati Shahu Maharaj EBC scheme.\n5. Upload CAP allotment letter, income certificate from Tehsildar, and previous year marksheet.\n6. Submit and take a printout for college verification.',
      sourceAuthority: 'MahaDBT 2.0 / Govt of Maharashtra',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'domicileState', operator: 'IN', values: ['Maharashtra'], required: true, label: 'Maharashtra Domicile' },
        { field: 'category', operator: 'IN', values: ['OPEN', 'General', 'EWS'], required: true, label: 'Category (Open/General/EWS)' },
        { field: 'annualIncome', maxValue: 800000, required: true, label: 'Family Annual Income <= ₹8 Lakh' },
        { field: 'educationLevel', operator: 'IN', values: ['Undergraduate', 'Postgraduate', 'Diploma', 'Professional'], required: true, label: 'Education Level' },
        { field: 'percentage', minValue: 50, required: true, label: 'Minimum 50% in previous exam' }
      ],
      documents: [
        { documentName: 'Maharashtra Domicile Certificate', mandatory: true },
        { documentName: 'Income Certificate from Tehsildar (valid for current FY)', mandatory: true },
        { documentName: 'CAP Allotment Letter', mandatory: true },
        { documentName: 'Previous Year Marksheet', mandatory: true },
        { documentName: 'Ration Card / Self Declaration', mandatory: false }
      ]
    },
    {
      name: 'Post-Matric Scholarship for Other Backward Classes (OBC) Students',
      provider: 'VJNT, OBC and SBC Welfare Department',
      governmentDepartment: 'VJNT, OBC and SBC Welfare Department, Govt of Maharashtra',
      schemeLevel: 'STATE',
      applicableStates: ['Maharashtra'],
      description: 'Provides fee concessions and maintenance allowance to students belonging to Other Backward Classes (OBC) pursuing post-matriculation studies in recognized institutions.',
      scholarshipType: 'Need-based',
      benefits: 'Up to 50% Tuition Fee & Exam Fee reimbursement plus monthly maintenance allowance according to course category.',
      tuitionFee: '50% of approved Tuition Fee',
      maintenanceAllowance: '₹190 to ₹425 per month for day scholars; ₹290 to ₹750 per month for hostellers',
      hostelAllowance: 'Included in maintenance allowance',
      amount: 40000,
      openingDate: new Date('2026-08-01'),
      deadline: new Date('2026-11-30'),
      applicationUrl: 'https://mahadbt.maharashtra.gov.in/',
      officialInfoUrl: 'https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData?str=E9DDFA9707DA6C02',
      applicationInstructions: '1. Log in to MahaDBT portal.\n2. Choose VJNT, OBC and SBC Welfare Department.\n3. Select Post-Matric Scholarship for OBC Students.\n4. Upload valid Caste Certificate and Non-Creamy Layer (NCL) certificate.\n5. Submit application and retain application acknowledgment ID.',
      sourceAuthority: 'MahaDBT 2.0 / Govt of Maharashtra',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'domicileState', operator: 'IN', values: ['Maharashtra'], required: true, label: 'Maharashtra Domicile' },
        { field: 'category', operator: 'IN', values: ['OBC'], required: true, label: 'OBC Category' },
        { field: 'annualIncome', maxValue: 800000, required: true, label: 'Family Annual Income <= ₹8 Lakh' },
        { field: 'educationLevel', operator: 'IN', values: ['Diploma', 'Undergraduate', 'Postgraduate', 'Professional Course'], required: true, label: 'Post-Matric Education' }
      ],
      documents: [
        { documentName: 'Caste Certificate (OBC)', mandatory: true },
        { documentName: 'Valid Non-Creamy Layer (NCL) Certificate', mandatory: true },
        { documentName: 'Income Certificate from Competent Authority', mandatory: true },
        { documentName: 'Maharashtra Domicile Certificate', mandatory: true },
        { documentName: 'Previous Year Marksheet', mandatory: true }
      ]
    },
    {
      name: 'Government of India Post-Matric Scholarship for SC Students (Maharashtra)',
      provider: 'Social Justice and Special Assistance Department',
      governmentDepartment: 'Social Justice and Special Assistance Department, Govt of Maharashtra',
      schemeLevel: 'STATE',
      applicableStates: ['Maharashtra'],
      description: 'Comprehensive financial support covering 100% of compulsory tuition and non-refundable fees along with maintenance allowance for Scheduled Caste (SC) students pursuing post-matric education.',
      scholarshipType: 'Need-based',
      benefits: '100% Tuition Fee, Examination Fee and Library Fee waiver plus maintenance allowance up to ₹13,500 per annum.',
      tuitionFee: '100% of approved Tuition and Examination Fee',
      maintenanceAllowance: 'Up to ₹1,200 per month (depending on course group and hostel status)',
      hostelAllowance: 'Additional hostel grant for hostellers',
      amount: 65000,
      openingDate: new Date('2026-08-01'),
      deadline: new Date('2026-11-30'),
      applicationUrl: 'https://mahadbt.maharashtra.gov.in/',
      officialInfoUrl: 'https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData?str=E9DDFA9707DA6C02',
      applicationInstructions: '1. Register on MahaDBT with Aadhaar authentication.\n2. Select Social Justice & Special Assistance Department.\n3. Fill in academic and category details.\n4. Upload Caste Certificate and Caste Validity Certificate.\n5. Submit online application.',
      sourceAuthority: 'MahaDBT 2.0 / Govt of Maharashtra',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'domicileState', operator: 'IN', values: ['Maharashtra'], required: true, label: 'Maharashtra Domicile' },
        { field: 'category', operator: 'IN', values: ['SC'], required: true, label: 'SC Category' },
        { field: 'annualIncome', maxValue: 250000, required: true, label: 'Family Annual Income <= ₹2.5 Lakh' }
      ],
      documents: [
        { documentName: 'Caste Certificate (SC)', mandatory: true },
        { documentName: 'Caste Validity Certificate (for degree/professional courses)', mandatory: true },
        { documentName: 'Income Certificate from Tehsildar', mandatory: true },
        { documentName: 'Maharashtra Domicile Certificate', mandatory: true },
        { documentName: 'Previous Year Marksheet', mandatory: true }
      ]
    },
    {
      name: 'Post-Matric Scholarship Scheme for ST Students',
      provider: 'Tribal Development Department',
      governmentDepartment: 'Tribal Development Department, Govt of Maharashtra',
      schemeLevel: 'STATE',
      applicableStates: ['Maharashtra'],
      description: 'Enables Scheduled Tribe students to pursue higher and technical education by providing complete fee reimbursement and substantial maintenance allowances.',
      scholarshipType: 'Need-based',
      benefits: '100% Tuition & Exam fee waiver, study tour allowance, book bank allowance, and maintenance allowance.',
      tuitionFee: '100% Fee Waiver',
      maintenanceAllowance: 'Up to ₹1,200/month for hostellers and ₹550/month for day scholars',
      hostelAllowance: 'Covered under DBT scheme',
      amount: 60000,
      openingDate: new Date('2026-08-01'),
      deadline: new Date('2026-11-30'),
      applicationUrl: 'https://mahadbt.maharashtra.gov.in/',
      officialInfoUrl: 'https://mahadbt.maharashtra.gov.in/',
      applicationInstructions: '1. Apply via MahaDBT Tribal Development portal.\n2. Submit Tribe Certificate and Tribe Validity Certificate.\n3. Ensure bank account is Aadhaar-seeded for DBT disbursement.',
      sourceAuthority: 'MahaDBT 2.0 / Tribal Development Department',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'domicileState', operator: 'IN', values: ['Maharashtra'], required: true, label: 'Maharashtra Domicile' },
        { field: 'category', operator: 'IN', values: ['ST'], required: true, label: 'ST Category' },
        { field: 'annualIncome', maxValue: 250000, required: true, label: 'Family Annual Income <= ₹2.5 Lakh' }
      ],
      documents: [
        { documentName: 'Scheduled Tribe Certificate', mandatory: true },
        { documentName: 'Tribe Validity Certificate', mandatory: true },
        { documentName: 'Income Certificate (Tehsildar)', mandatory: true },
        { documentName: 'Aadhaar Card with Bank Seeding Confirmation', mandatory: true }
      ]
    },
    {
      name: 'Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna',
      provider: 'Directorate of Technical Education / Higher Education',
      governmentDepartment: 'Higher & Technical Education Department, Govt of Maharashtra',
      schemeLevel: 'STATE',
      applicableStates: ['Maharashtra'],
      description: 'Hostel maintenance allowance for children of registered agricultural laborers and marginal landholders pursuing professional degree courses in Maharashtra.',
      scholarshipType: 'Need-based Hostel Assistance',
      benefits: '₹30,000 per academic year for students studying in MMRDA/Pune/Nagpur; ₹20,000 per year for other districts.',
      tuitionFee: 'Not covered (combine with EBC scheme)',
      maintenanceAllowance: '₹20,000 to ₹30,000 per academic year (10 months)',
      hostelAllowance: 'Up to ₹30,000 per year for private/rented hostel accommodation',
      amount: 30000,
      openingDate: new Date('2026-08-01'),
      deadline: new Date('2026-12-15'),
      applicationUrl: 'https://mahadbt.maharashtra.gov.in/',
      officialInfoUrl: 'https://mahadbt.maharashtra.gov.in/',
      applicationInstructions: '1. Submit proof of private hostel/room rent agreement.\n2. Provide Marginal Landholder certificate or Labor registration.\n3. Must be admitted via CAP.',
      sourceAuthority: 'MahaDBT 2.0 / Govt of Maharashtra',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'domicileState', operator: 'IN', values: ['Maharashtra'], required: true, label: 'Maharashtra Domicile' },
        { field: 'annualIncome', maxValue: 800000, required: true, label: 'Family Income <= ₹8 Lakh' },
        { field: 'educationLevel', operator: 'IN', values: ['Undergraduate', 'Postgraduate', 'Professional Course', 'Diploma'], required: true, label: 'Professional Degree/Diploma' }
      ],
      documents: [
        { documentName: 'Registered Laborer / Marginal Landholder (Alpa Bhudharak) Certificate', mandatory: true },
        { documentName: 'Hostel Admission Receipt / Rent Agreement', mandatory: true },
        { documentName: 'CAP Allotment Letter', mandatory: true },
        { documentName: 'Income Certificate', mandatory: true }
      ]
    },
    {
      name: 'State Minority Scholarship for Pursuing Higher and Professional Education',
      provider: 'Minority Development Department',
      governmentDepartment: 'Minority Development Department, Govt of Maharashtra',
      schemeLevel: 'STATE',
      applicableStates: ['Maharashtra'],
      description: 'Financial assistance for minority community students (Muslim, Buddhist, Christian, Jain, Parsi, Sikh, Jewish) pursuing graduate and postgraduate professional and technical courses.',
      scholarshipType: 'Need-based Minority Support',
      benefits: 'Up to ₹50,000 per annum or actual tuition fee, whichever is less.',
      tuitionFee: 'Up to ₹50,000 per year',
      maintenanceAllowance: 'Part of composite grant',
      hostelAllowance: 'Not separate',
      amount: 50000,
      openingDate: new Date('2026-08-01'),
      deadline: new Date('2026-11-30'),
      applicationUrl: 'https://mahadbt.maharashtra.gov.in/',
      officialInfoUrl: 'https://mahadbt.maharashtra.gov.in/',
      applicationInstructions: '1. Register under Minority Development Department on MahaDBT.\n2. Submit self-declaration of minority religion or minority certificate.\n3. Enter previous exam percentage (minimum 50%).',
      sourceAuthority: 'MahaDBT 2.0 / Minority Development Department',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'domicileState', operator: 'IN', values: ['Maharashtra'], required: true, label: 'Maharashtra Domicile' },
        { field: 'minorityStatus', values: true, required: true, label: 'Minority Community Status' },
        { field: 'annualIncome', maxValue: 800000, required: true, label: 'Annual Income <= ₹8 Lakh' },
        { field: 'percentage', minValue: 50, required: true, label: 'Minimum 50% in previous qualifying exam' }
      ],
      documents: [
        { documentName: 'Minority Community Self Declaration / Certificate', mandatory: true },
        { documentName: 'Maharashtra Domicile Certificate', mandatory: true },
        { documentName: 'Income Certificate from Tehsildar', mandatory: true },
        { documentName: 'Previous Exam Marksheet (50%+)', mandatory: true }
      ]
    },
    {
      name: 'Post-Matric Scholarship for VJNT Students',
      provider: 'VJNT, OBC and SBC Welfare Department',
      governmentDepartment: 'Govt of Maharashtra',
      schemeLevel: 'STATE',
      applicableStates: ['Maharashtra'],
      description: 'Full tuition fee reimbursement and maintenance allowance for Vimukta Jati and Nomadic Tribes (VJNT) students enrolled in recognized post-matric institutions.',
      scholarshipType: 'Need-based',
      benefits: '100% Tuition Fee & Exam Fee reimbursement plus monthly maintenance allowance.',
      tuitionFee: '100% Tuition Fee waiver',
      maintenanceAllowance: 'Up to ₹750/month according to course tier',
      hostelAllowance: 'Covered in maintenance allowance',
      amount: 50000,
      openingDate: new Date('2026-08-01'),
      deadline: new Date('2026-11-30'),
      applicationUrl: 'https://mahadbt.maharashtra.gov.in/',
      officialInfoUrl: 'https://mahadbt.maharashtra.gov.in/',
      applicationInstructions: '1. Select VJNT Department on MahaDBT.\n2. Upload VJNT Caste Certificate and valid Non-Creamy Layer (if income between 1.5L and 8L).\n3. Submit for principal/institute verification.',
      sourceAuthority: 'MahaDBT 2.0 / Govt of Maharashtra',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'domicileState', operator: 'IN', values: ['Maharashtra'], required: true, label: 'Maharashtra Domicile' },
        { field: 'category', operator: 'IN', values: ['VJNT', 'SBC'], required: true, label: 'VJNT or SBC Category' },
        { field: 'annualIncome', maxValue: 800000, required: true, label: 'Family Income <= ₹8 Lakh' }
      ],
      documents: [
        { documentName: 'VJNT / SBC Caste Certificate', mandatory: true },
        { documentName: 'Income Certificate', mandatory: true },
        { documentName: 'Non-Creamy Layer Certificate (if applicable)', mandatory: true },
        { documentName: 'Domicile Certificate', mandatory: true }
      ]
    },
    {
      name: 'Central Sector Scheme of Scholarships for College and University Students (PM-USP)',
      provider: 'Ministry of Education, Department of Higher Education',
      governmentDepartment: 'Government of India',
      schemeLevel: 'CENTRAL',
      applicableStates: ['ALL', 'Maharashtra'],
      description: 'Merit-cum-means scholarship awarded to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies in colleges and universities.',
      scholarshipType: 'Merit-cum-Means',
      benefits: '₹12,000 per annum for graduation (first 3 years) and ₹20,000 per annum at postgraduate level.',
      tuitionFee: 'Fixed direct scholarship disbursement',
      maintenanceAllowance: '₹12,000/yr (UG) / ₹20,000/yr (PG)',
      hostelAllowance: 'Included in grant',
      amount: 20000,
      openingDate: new Date('2026-07-15'),
      deadline: new Date('2026-10-31'),
      applicationUrl: 'https://scholarships.gov.in/',
      officialInfoUrl: 'https://scholarships.gov.in/',
      applicationInstructions: '1. Register via National Scholarship Portal (NSP).\n2. Authenticate with Aadhaar & OTR (One Time Registration).\n3. Submit Class 12 roll number and family income proof.\n4. Complete Institute level verification.',
      sourceAuthority: 'National Scholarship Portal (NSP) / Ministry of Education',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'annualIncome', maxValue: 450000, required: true, label: 'Family Annual Income <= ₹4.5 Lakh' },
        { field: 'percentage', minValue: 80, required: true, label: 'Above 80th percentile in Class 12 (approx. 80%+)' },
        { field: 'educationLevel', operator: 'IN', values: ['Undergraduate', 'Postgraduate'], required: true, label: 'College / University Degree' }
      ],
      documents: [
        { documentName: 'Class 12 Passing Certificate & Marksheet', mandatory: true },
        { documentName: 'Income Certificate issued by Competent Authority', mandatory: true },
        { documentName: 'Bonafide Certificate from Current College', mandatory: true },
        { documentName: 'Bank Passbook / Aadhaar Seeded Account', mandatory: true }
      ]
    },
    {
      name: 'AICTE Pragati Scholarship Scheme for Girl Students',
      provider: 'All India Council for Technical Education (AICTE)',
      governmentDepartment: 'Ministry of Education, Govt of India',
      schemeLevel: 'CENTRAL',
      applicableStates: ['ALL', 'Maharashtra'],
      description: 'Aimed at empowering young women to pursue technical education. Awards ₹50,000 per annum for every year of study in AICTE approved degree or diploma programs.',
      scholarshipType: 'Merit-cum-Gender Affirmative',
      benefits: '₹50,000 per annum towards college fee, computer purchase, stationery, books, and equipment.',
      tuitionFee: 'Up to ₹50,000 composite annual assistance',
      maintenanceAllowance: 'Part of ₹50,000 grant',
      hostelAllowance: 'Part of ₹50,000 grant',
      amount: 50000,
      openingDate: new Date('2026-08-01'),
      deadline: new Date('2026-11-15'),
      applicationUrl: 'https://scholarships.gov.in/',
      officialInfoUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati',
      applicationInstructions: '1. Apply through National Scholarship Portal (NSP).\n2. Enter AICTE approved institute student ID.\n3. Upload tuition fee receipt and family income certificate.\n4. Verify bank details for direct benefit transfer.',
      sourceAuthority: 'AICTE / National Scholarship Portal',
      lastVerifiedDate: new Date(),
      verificationStatus: 'VERIFIED',
      active: true,
      isDemo: false,
      eligibility: [
        { field: 'gender', operator: 'IN', values: ['Female'], required: true, label: 'Girl Students Only' },
        { field: 'annualIncome', maxValue: 800000, required: true, label: 'Family Annual Income <= ₹8 Lakh' },
        { field: 'educationLevel', operator: 'IN', values: ['Undergraduate', 'Diploma', 'Professional Course'], required: true, label: 'AICTE Approved Technical Course' }
      ],
      documents: [
        { documentName: '10th & 12th Marksheet', mandatory: true },
        { documentName: 'AICTE Institution Admission Proof / Fee Receipt', mandatory: true },
        { documentName: 'Family Income Certificate (<= ₹8 Lakh)', mandatory: true },
        { documentName: 'Aadhaar Seeded Bank Account Details', mandatory: true }
      ]
    }
  ];

  for (const s of scholarshipsData) {
    await db.scholarship.create({ data: s });
  }

  // Create initial demo saved item and notification for student
  const firstScholarship = (await db.scholarship.findMany())[1]; // Post-Matric OBC
  if (firstScholarship && student.profile) {
    await db.savedScholarship.upsert({
      where: {
        studentId_scholarshipId: {
          studentId: student.profile.id,
          scholarshipId: firstScholarship.id
        }
      },
      create: {}
    });

    await db.applicationTracking.upsert({
      where: {
        studentId_scholarshipId: {
          studentId: student.profile.id,
          scholarshipId: firstScholarship.id
        }
      },
      create: { status: 'PLANNING' }
    });

    await db.notification.create({
      data: {
        studentId: student.profile.id,
        title: 'Welcome to ScholarNest!',
        message: 'Your profile has been matched with 3 scholarships based on your OBC category and Maharashtra domicile. Check your dashboard.',
        type: 'MATCH'
      }
    });
  }

  console.log('[Seed] Database successfully populated with 9 Maharashtra & Central schemes and demo accounts!');
}

if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch(err => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}

