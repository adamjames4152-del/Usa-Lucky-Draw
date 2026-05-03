export interface DrawApplication {
  id?: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  selfieUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  ticketId?: string;
  userId: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Draw {
  id: string;
  drawNo: string;
  drawDate: any;
  winningNumbers?: string[];
  bonusNumber?: string;
  status: 'upcoming' | 'completed';
  poolAmount?: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  drawNo: string;
  ownerEmail: string;
  ownerUid: string;
  createdAt: any;
}
