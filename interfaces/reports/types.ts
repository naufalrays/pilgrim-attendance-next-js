// types.ts atau interfaces.ts

export interface TripResponseData {
  id: string;
  pic_id: number;
  name: string;
  pic_name: string;
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
  id?: string;
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

export interface BusList {
  id?: string;
  name: string;
  bus: string;
}

export interface RequestUpdateAttendancePilgrim {
  checkIn: string;
  checkOut: string;
  reason: string | null;
}

export interface RequestChangeBus {
  current_trip_id: string;
  new_trip_id: string;
  pilgrim_id: string;
}

