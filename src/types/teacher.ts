export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  qualifiedSubjectIds: number[]; // IDs of subjects teacher is qualified to teach
  active: boolean;
  joinDate?: string;
}

export interface TeachersResponse {
  teachers: Teacher[];
  total: number;
  currentPage: number;
  totalPages: number;
}
