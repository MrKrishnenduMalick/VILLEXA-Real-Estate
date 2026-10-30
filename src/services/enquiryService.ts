import { EnquiryType } from '../types/enquiry';

/**
 * PUBLIC ENQUIRY SERVICE (Static Frontend Architecture)
 * Simulates immediate client-side success with zero backend dependency.
 */
export const enquiryService = {
  async submitEnquiry(_payload: {
    type: EnquiryType;
    fullName: string;
    email: string;
    phone?: string;
    preferredContact: 'email' | 'phone' | 'whatsapp';
    productId?: string;
    productName?: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    // Pure frontend simulation: instant successful verification
    return { success: true };
  }
};