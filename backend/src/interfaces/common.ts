// [DEFINITION]
export interface IAddress {
  number?: string;
  street?: string;
  subdivision?: string;
  barangay: string;
  municipality: string;
  province: string;
  postalCode: number;
}

export interface IBaptismConfirmation {
  year?: number;
  minister?: string;
}

export interface IFamily {
  name: string;
  isMember: boolean;
}
