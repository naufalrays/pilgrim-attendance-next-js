// types.ts atau interfaces.ts

export interface TripResponseData {
    picId: number;
    name: string;
    picName: string;
    date: Date;
    meeting_point: string;
    stand_by: Date;
    start: Date;
    end: Date;
    destination: string;
    bus: string;
    pilgrims?: Pilgrim[];
  }

  export interface Pilgrim {
    id?: number;
    portion_number: string;
    name: string;
    gender: string;
    birth_date: string;
    phone_number: string;
    group: string;
    cloter: string;
    passport_number: string;
    check_in: string | null;
    check_out: string | null;
    reason: string | null;
  }

  export interface ResponseUpdateAttendancePilgrim {
    checkIn: string;
    checkOut: string;
    reason: string | null;
  }
