/* START OF FILE data.js */

const toYYYYMMDD = (d) => {
    if (!d || !(d instanceof Date)) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const initialData = {
    enquiries: [],
    notes: {},
    activityLog: {},
    clients: [
        { name: 'Quantum Solutions', type: 'company', contactPerson: 'Sarah Connor', contactPhone: '555-0101', contactEmail: 'sarah.c@quantum.com' },
        { name: 'Apex Industries', type: 'company', contactPerson: 'John Doe', contactPhone: '555-0202', contactEmail: 'john.d@apex.com' },
        { name: 'Stellar Services', type: 'company', contactPerson: 'Jane Smith', contactPhone: '555-0303', contactEmail: 'jane.s@stellar.com' },
        { name: 'Vertex Ventures', type: 'company', contactPerson: 'Peter Jones', contactPhone: '555-0404', contactEmail: 'peter.j@vertex.com' },
        { name: 'Pinnacle Group', type: 'company', contactPerson: 'Michael Brown', contactPhone: '555-0505', contactEmail: 'michael.b@pinnacle.com' },
        { name: 'Horizon Holdings', type: 'company', contactPerson: 'Emily Davis', contactPhone: '555-0606', contactEmail: 'emily.d@horizon.com' },
        { name: 'Global Innovations', type: 'company', contactPerson: 'Chris Wilson', contactPhone: '555-0707', contactEmail: 'chris.w@globalinnov.com' },
        { name: 'Data Corp', type: 'company', contactPerson: 'Jessica Miller', contactPhone: '555-0808', contactEmail: 'jessica.m@datacorp.com' },
        { name: 'Web Wizards', type: 'company', contactPerson: 'David Garcia', contactPhone: '555-0909', contactEmail: 'david.g@webwizards.com' },
        { name: 'Future Systems', type: 'company', contactPerson: 'Linda Martinez', contactPhone: '555-1010', contactEmail: 'linda.m@futuresys.com' },
        { name: 'Innovate Corp', type: 'company', contactPerson: 'Robert Rodriguez', contactPhone: '555-1111', contactEmail: 'robert.r@innovate.com' },
        { name: 'Sun Training Institute', type: 'company', contactPerson: 'Admin User', contactPhone: '555-0000', contactEmail: 'admin@suntraining.com' },
        { name: 'John Smith', type: 'individual', contactPerson: 'John Smith', contactPhone: '555-1234', contactEmail: 'john.smith@personal.com' }
    ],
    // ---------------------------------
    // --- NEW BATCH DATA STRUCTURE ---
    // ---------------------------------
    batches: [
        { 
          "batchId": "Batch-E-001",
          "courseName": "Electrical Safety", 
          "date": "2025-10-18",
          "session": "Morning",
          "classCapacity": 10, 
          "nominated": 2,
          "pending": 8, 
          "nominees": [ 
            { 
              "type": "Company", 
              "name": "Quantum Solutions", 
              "students": [ 
                { "name": "Amelia Yusuf", "civilId": "199012345678", "contactNumber": "+96890000001", "email": "student1@example.com", "language": "English" }, 
                { "name": "Benjamin Carter", "civilId": "198501019876", "contactNumber": "+96890000002", "email": "student2@example.com", "language": "Arabic" } 
              ] 
            }
          ] 
        },
        { 
          "batchId": "Batch-A-001", 
          "courseName": "AHA First Aid", 
          "date": "2025-10-20",
          "session": "Full", 
          "classCapacity": 15, 
          "nominated": 4,
          "pending": 11, 
          "nominees": [ 
            { 
              "type": "Company", 
              "name": "Stellar Services", 
              "students": [ 
                { "name": "Student 7", "civilId": "12345684", "contactNumber": "+96890000007", "email": "student7@example.com", "language": "English" },
                { "name": "Student 8", "civilId": "12345685", "contactNumber": "+96890000008", "email": "student8@example.com", "language": "Urdu" } 
              ] 
            }, 
            { 
              "type": "Individual", 
              "name": "Individual B", 
              "students": [ 
                { "name": "Student 9", "civilId": "12345686", "contactNumber": "+96890000009", "email": "student9@example.com", "language": "Malayalam" }, 
                { "name": "Student 10", "civilId": "12345687", "contactNumber": "+96890000010", "email": "student10@example.com", "language": "English" } 
              ] 
            } 
          ] 
        }
    ],
    schedules: [],
    trainers: [
        { id: 'TRN-1', name: 'Alice', phone: '555-1001', email: 'alice@suntraining.com', specialization: 'First Aid, HSE', status: 'Active', joinDate: '2022-01-15' },
        { id: 'TRN-2', name: 'Bob', phone: '555-1002', email: 'bob@suntraining.com', specialization: 'Electrical Safety', status: 'Active', joinDate: '2021-11-20' },
        { id: 'TRN-3', name: 'Charles', phone: '555-1003', email: 'charles@suntraining.com', specialization: 'Fire Safety', status: 'Active', joinDate: '2023-03-10' },
        { id: 'TRN-4', name: 'Diana', phone: '555-1004', email: 'diana@suntraining.com', specialization: 'Working at Height', status: 'Inactive', joinDate: '2022-05-01' },
        { id: 'TRN-5', name: 'John', phone: '555-1005', email: 'john@suntraining.com', specialization: 'Risk Assessment', status: 'Active', joinDate: '2022-08-22' },
        { id: 'TRN-6', name: 'Guru', phone: '555-1006', email: 'guru@suntraining.com', specialization: 'Leadership', status: 'Active', joinDate: '2020-02-18' },
        { id: 'TRN-7', name: 'Joe', phone: '555-1007', email: 'joe@suntraining.com', specialization: 'General Safety', status: 'Active', joinDate: '2023-06-05' },
    ],
    trainerLeaves: [
        { id: 'LVE-1', trainerName: 'Diana', startDate: '2025-09-28', endDate: '2025-09-29', reason: 'Personal', status: 'Approved' },
        { id: 'LVE-2', trainerName: 'Bob', startDate: '2025-10-05', endDate: '2025-10-05', reason: 'Sick Leave', status: 'Pending' }
    ],
    rooms: ['Room 1', 'Room 2', 'Room 3', 'Conference Hall'],
    students: [
        { civilId: '199012345678', name: 'Amelia Yusuf', phone: '555-0101', email: 'amelia.y@example.com', language: 'English' },
        { civilId: '198501019876', name: 'Benjamin Carter', phone: '555-0102', email: 'ben.c@example.com', language: 'English' },
        { civilId: '200111223344', name: 'khalid', phone: '555-0103', email: 'khalid.a@example.com', language: 'Arab' },
        { civilId: '199505051234', name: 'Priya Sharma', phone: '555-0104', email: 'priya.s@example.com', language: 'Tamil' },
        { civilId: '198523456789', name: 'Mohammed Al-Farsi', phone: '555-0102', email: 'm.alfarsi@example.com', language: 'Arab' },
        { civilId: '199234567890', name: 'Sophie Chen', phone: '555-0103', email: 'sophie.chen@example.com', language: 'Tamil' },
        { civilId: '198834567891', name: 'Carlos Rodriguez', phone: '555-0104', email: 'c.rodriguez@example.com', language: 'Tamil' },
        { civilId: '199345678901', name: 'Priya Sharma', phone: '555-0105', email: 'priya.sharma@example.com', language: 'Tamil' },
        { civilId: '198945678902', name: 'Kenji Tanaka', phone: '555-0106', email: 'k.tanaka@example.com', language: 'Tamil' },
        { civilId: '199456789012', name: 'Isabelle Dubois', phone: '555-0107', email: 'i.dubois@example.com', language: 'English' },
        { civilId: '199056789013', name: 'Marco Rossi', phone: '555-0108', email: 'm.rossi@example.com', language: 'English' },
        { civilId: '199567890123', name: 'Elena Petrova', phone: '555-0109', email: 'e.petrova@example.com', language: 'English' },
        { civilId: '198767890124', name: 'Fatima Al-Mansoori', phone: '555-0110', email: 'f.almansoori@example.com', language: 'Arab' },
        { civilId: '199678901234', name: 'David Kim', phone: '555-0111', email: 'd.kim@example.com', language: 'Hindi' },
        { civilId: '199278901235', name: 'Anna Schmidt', phone: '555-0112', email: 'a.schmidt@example.com', language: 'English' },
        { civilId: '198878901236', name: 'Ahmed Hassan', phone: '555-0113', email: 'a.hassan@example.com', language: 'Arab' },
        { civilId: '199789012345', name: 'Maria Silva', phone: '555-0114', email: 'm.silva@example.com', language: 'Hindi' },
        { civilId: '199389012346', name: 'James Wilson', phone: '555-0115', email: 'j.wilson@example.com', language: 'English' },
        { civilId: '198989012347', name: 'Ling Wong', phone: '555-0116', email: 'ling.wong@example.com', language: 'Tamil' },
        { civilId: '199890123456', name: 'Omar Khalid', phone: '555-0117', email: 'o.khalid@example.com', language: 'Arab' },
        { civilId: '199490123457', name: 'Sofia Garcia', phone: '555-0118', email: 's.garcia@example.com', language: 'Tamil' },
        { civilId: '199090123458', name: 'Wei Zhang', phone: '555-0119', email: 'w.zhang@example.com', language: 'Hindi' },
        { civilId: '199590123459', name: 'Thomas Müller', phone: '555-0120', email: 't.muller@example.com', language: 'Hindi' }
    ],
    courses: [
        { name: 'HSE Induction', cost: 45 }, { name: 'Electrical Safety', cost: 50 }, { name: 'Environmental Safety', cost: 48 },
        { name: 'Fire Warden', cost: 42 }, { name: 'AHA First Aid', cost: 50 }, { name: 'Incident Investigation', cost: 49 },
        { name: 'Lifting Awareness', cost: 40 }, { name: 'PPE Awareness', cost: 35 }, { name: 'Risk Assessment', cost: 47 },
        { name: 'Safety Leadership', cost: 50 }, { name: 'Supervising Safety', cost: 48 }, { name: 'Working at Height', cost: 46 }
    ],
    classCapacity: {
        'HSE Induction': 25, 'Electrical Safety': 20, 'Environmental Safety': 20,
        'Fire Warden': 25, 'AHA First Aid': 18, 'Incident Investigation': 15,
        'Lifting Awareness': 20, 'PPE Awareness': 12, 'Risk Assessment': 20,
        'Safety Leadership': 15, 'Supervising Safety': 15, 'Working at Height': 12
    },
    historicalPrices: {
        "Quantum Solutions": { "Electrical Safety": [{ date: "2024-08-15", price: 48.00 }] }
    },
    rateCards: {
        byClient: {
            "Quantum Solutions": {
                "Electrical Safety": { discount: 10 },
                "Lifting Awareness": { discount: 5 }
            },
            "Apex Industries": {
                "Risk Assessment": { discount: 15 }
            }
        }
    },
    batchCounters: { 'A': 1, 'F': 1, 'H': 1 },
    invoices: []
};


/* --- END OF FILE data.js --- */