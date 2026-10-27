export type Language = 'en' | 'rw';

export type UserRole = 'vendor' | 'procurement_officer' | 'admin';

export type IdType = 'national_id' | 'passport';

export type BusinessType = 'individual' | 'company';

export type TenderCategory = 
  | 'road_construction' 
  | 'school_feeding' 
  | 'school_uniforms' 
  | 'market_stalls';

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  id_type: IdType;
  national_id_or_passport: string;
  role: UserRole;
  has_vendor_profile: boolean;
  vendor_profile?: VendorProfile;
}

export interface VendorProfile {
  id?: number;
  user_id: number;
  business_type: BusinessType;
  company_name?: string;
  rdb_registration_number?: string;
  tin_number?: string; // 9 digits (mandatory for company, optional for individual)
  business_category: TenderCategory | 'general_supplies' | 'consultancy';
  years_of_experience: number;
  province: string;
  district: string;
  sector?: string;
  services_description: string;
  has_rra_tax_clearance: boolean;
  has_rssb_clearance: boolean;
  is_profile_completed: boolean;
  updated_at?: string;
}

export interface Tender {
  id: number;
  tender_reference: string;
  title_en: string;
  title_rw: string;
  procuring_entity_en: string;
  procuring_entity_rw: string;
  category: TenderCategory;
  location_district: string;
  location_province: string;
  estimated_budget_rwf: number;
  bid_security_rwf: number;
  description_en: string;
  description_rw: string;
  requirements_en: string[];
  requirements_rw: string[];
  published_at: string;
  submission_deadline: string;
  status: 'open' | 'evaluation' | 'closed' | 'awarded';
}

export type ApplicationStatus = 
  | 'submitted' 
  | 'administrative_review' 
  | 'technical_evaluation' 
  | 'financial_opening' 
  | 'awarded' 
  | 'rejected';

export interface Application {
  id: number;
  application_tracking_code: string;
  tender_id: number;
  tender: Tender;
  user_id: number;
  vendor_profile: VendorProfile;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  financial_offer_rwf: number;
  proposed_delivery_days: number;
  technical_proposal_summary: string;
  anti_corruption_pledge_signed: boolean;
  status: ApplicationStatus;
  evaluation_notes?: string;
  submitted_at: string;
}
