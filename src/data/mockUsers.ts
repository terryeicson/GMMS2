import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    full_name: 'Eric Kwizera Mugabo',
    email: 'kwizera.infrastructure@rwanda.rw',
    phone_number: '+250788112233',
    id_type: 'national_id',
    national_id_or_passport: '1198880044556677',
    role: 'vendor',
    has_vendor_profile: true,
    vendor_profile: {
      id: 1,
      user_id: 1,
      business_type: 'company',
      company_name: 'Kigali Civil Infrastructure & Engineering Ltd',
      rdb_registration_number: 'RDB-2018-B-4921',
      tin_number: '100482931',
      business_category: 'road_construction',
      years_of_experience: 11,
      province: 'Kigali City',
      district: 'Nyarugenge',
      sector: 'Nyamirambo',
      services_description: 'Class-A road construction, asphalt overlay, drainage storm sewers, and urban paving works.',
      has_rra_tax_clearance: true,
      has_rssb_clearance: true,
      is_profile_completed: true,
      updated_at: '2026-10-15'
    }
  },
  {
    id: 2,
    full_name: 'Marie Chantal Mukamana',
    email: 'chantal.mukamana@gmail.com',
    phone_number: '+250788987654',
    id_type: 'national_id',
    national_id_or_passport: '1199270098765432',
    role: 'vendor',
    has_vendor_profile: true,
    vendor_profile: {
      id: 2,
      user_id: 2,
      business_type: 'individual',
      company_name: 'Mukamana Agri-Trade & Distribution',
      tin_number: '108459201',
      business_category: 'school_feeding',
      years_of_experience: 6,
      province: 'Eastern Province',
      district: 'Bugesera',
      sector: 'Nyamata',
      services_description: 'Supply of certified fortified cereals, dry beans, maize flour, and fresh horticultural produce for schools.',
      has_rra_tax_clearance: true,
      has_rssb_clearance: true,
      is_profile_completed: true,
      updated_at: '2026-10-18'
    }
  },
  {
    id: 3,
    full_name: 'David Robert Smith',
    email: 'd.smith@eastafricaconstruct.com',
    phone_number: '+250791445566',
    id_type: 'passport',
    national_id_or_passport: 'PA9823412',
    role: 'vendor',
    has_vendor_profile: true,
    vendor_profile: {
      id: 3,
      user_id: 3,
      business_type: 'company',
      company_name: 'East Africa High-Speed Roads & Bridges Ltd',
      rdb_registration_number: 'RDB-2022-C-9821',
      tin_number: '105829301',
      business_category: 'road_construction',
      years_of_experience: 15,
      province: 'Kigali City',
      district: 'Gasabo',
      services_description: 'Regional highway contractor and bridge engineering consortium.',
      has_rra_tax_clearance: true,
      has_rssb_clearance: false,
      is_profile_completed: true,
      updated_at: '2026-10-20'
    }
  },
  {
    id: 4,
    full_name: 'Divine Uwase',
    email: 'divine.uwase@yahoo.com',
    phone_number: '+250783998877',
    id_type: 'national_id',
    national_id_or_passport: '1199980077665544',
    role: 'vendor',
    has_vendor_profile: false, // Intentionally FALSE to test pre-application gatekeeper!
    vendor_profile: undefined
  }
];
