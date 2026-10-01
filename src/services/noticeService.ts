import api from './api';
import { Notice } from '../types';

export const MOCK_NOTICES: Notice[] = [
  {
    id: 'not_01',
    title: 'End Semester University Examinations Nov/Dec 2026 Timetable Released',
    category: 'Examinations',
    description: 'The tentative timetable for Anna University End Semester Theory and Practical Examinations (Nov/Dec 2026) has been published on the SEC Smart Campus Portal. Students are advised to verify their subject codes and session slots.',
    date: '2026-08-08',
    author: 'Controller of Examinations - SEC',
    importance: 'Urgent',
    hasAttachment: true,
    attachmentName: 'SEC_NovDec_2026_Exam_Timetable.pdf'
  },
  {
    id: 'not_02',
    title: 'On-Campus Placement Drive - Zoho Corporation & TCS Digital',
    category: 'Placements',
    description: 'Special placement drive for 2026 batch B.E. CSE, ECE, EEE, and IT students. Online coding round scheduled for August 15, 2026. Eligible CGPA criterion: 7.0 & above with no standing arrears.',
    date: '2026-08-06',
    author: 'Head of Training & Placement Cell',
    importance: 'High',
    hasAttachment: true,
    attachmentName: 'Placement_Drive_Eligibility_Details.pdf'
  },
  {
    id: 'not_03',
    title: 'Submission of Final Year Project Work Phase II Synopsis',
    category: 'Department',
    description: 'All 8th-semester B.E. CSE students must submit their hardcopy Phase II project synopsis duly signed by their respective project guides to Dr. M. Senthilkumar on or before August 20, 2026.',
    date: '2026-08-04',
    author: 'Head of Department - Computer Science',
    importance: 'High',
    hasAttachment: false
  },
  {
    id: 'not_04',
    title: 'CIRCULAR: National Level Technical Symposium "SENGUNTHAR TECHFEST 2026"',
    category: 'Events',
    description: 'Department of CSE & IT cordially invites all students to participate in SENGUNTHAR TECHFEST 2026 featuring Hackathon, Paper Presentation, Bug Hunt, and UI/UX Design contests.',
    date: '2026-08-02',
    author: 'Student Affairs Coordinator',
    importance: 'Normal',
    hasAttachment: true,
    attachmentName: 'Techfest_2026_Event_Poster.pdf'
  },
  {
    id: 'not_05',
    title: 'Semester Tuition Fee & Examination Fee Payment Notice',
    category: 'Fee Notice',
    description: 'Students who have not cleared the odd/even semester examination fee are requested to settle the dues through the SEC Online Portal or Accounts Section before August 18, 2026 to avoid late fees.',
    date: '2026-07-28',
    author: 'Finance & Accounts Department',
    importance: 'Urgent',
    hasAttachment: false
  }
];

export const noticeService = {
  /**
   * GET /api/notices
   */
  getNotices: async (): Promise<Notice[]> => {
    try {
      const response = await api.get('/notices');
      return response.data;
    } catch {
      return MOCK_NOTICES;
    }
  },

  /**
   * GET /api/notices/:id
   */
  getNoticeById: async (id: string): Promise<Notice | undefined> => {
    try {
      const response = await api.get(`/notices/${id}`);
      return response.data;
    } catch {
      return MOCK_NOTICES.find((n) => n.id === id);
    }
  }
};

export default noticeService;
