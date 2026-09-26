// AdaptiveOS Multi-Persona Master Configuration
// Supports: Student, Working Professional, Mother/Caregiver, Older Grandfather, and Kid

export const PERSONAS = {
  student: {
    id: 'student',
    name: 'Sathish',
    subtitle: 'Final-Year Engineering Student',
    roleTag: 'Student',
    ageRange: '20–24',
    avatarAccent: '#7c6cff',
    wakeTime: '06:00',
    sleepTime: '22:30',
    primaryFocus: 'Complete AI Project & Python ML Study',
    protectedCommitment: 'Sleep & Core Study Hours',
    protectPriority: 'Sleep & Study',
    goals: [
      'Master Python & PyTorch for AI Project',
      'Maintain 8.5+ CGPA in final semester',
      'Consistently protect 7.5 hours of sleep',
      'Daily 45-minute fitness & cardio'
    ],
    momClockSubtitle: 'Mom Wake-up & Study Reminders',
    voicePromptGreeting: "Good morning, Sathish! It's 6:00 AM. You wanted to study Python this morning. Come on, let's start.",
    alarms: [
      { id: 'al-st-1', title: 'Morning Study Wake-Up', time: '06:00', days: 'Mon, Tue, Wed, Thu, Fri', category: 'wake_up', isActive: true, voicePrompt: "Good morning Sathish! 6 AM study session starting soon." },
      { id: 'al-st-2', title: 'College Bus Departure', time: '08:30', days: 'Mon, Tue, Wed, Thu, Fri', category: 'commute', isActive: true, voicePrompt: "College bus arrives in 15 minutes, please pack your laptop." },
      { id: 'al-st-3', title: 'Project Deep Focus', time: '16:00', days: 'Everyday', category: 'focus', isActive: true, voicePrompt: "Time for your AI Project block. Let's make real progress today." },
      { id: 'al-st-4', title: 'Night Routine & Wind Down', time: '22:00', days: 'Everyday', category: 'sleep', isActive: true, voicePrompt: "It's 10 PM. Screens off, get ready for restful sleep." }
    ],
    scheduleBlocks: [
      { id: 'st-1', title: 'Wake Up & Hydration', category: 'routine', start_time: '06:00', end_time: '06:30', is_fixed: true, is_sleep: false, status: 'completed', color: '#7c6cff' },
      { id: 'st-2', title: 'Python & ML Systems Study', category: 'study', start_time: '06:30', end_time: '08:30', is_fixed: false, is_sleep: false, status: 'completed', color: '#3b82f6' },
      { id: 'st-3', title: 'College Lectures & Labs', category: 'work', start_time: '09:00', end_time: '13:00', is_fixed: true, is_sleep: false, status: 'completed', color: '#6366f1' },
      { id: 'st-4', title: 'Campus Lunch & Networking', category: 'break', start_time: '13:00', end_time: '14:00', is_fixed: false, is_sleep: false, status: 'completed', color: '#10b981' },
      { id: 'st-5', title: 'Computer Science Practical', category: 'work', start_time: '14:00', end_time: '16:00', is_fixed: true, is_sleep: false, status: 'in_progress', color: '#6366f1' },
      { id: 'st-6', title: 'AI Engineering Project', category: 'work', start_time: '16:00', end_time: '18:00', is_fixed: false, is_sleep: false, status: 'scheduled', color: '#ff5fa2' },
      { id: 'st-7', title: 'Cardio & Fitness Run', category: 'health', start_time: '18:30', end_time: '19:30', is_fixed: false, is_sleep: false, status: 'scheduled', color: '#00e0c8' },
      { id: 'st-8', title: 'Family Dinner & Chat', category: 'routine', start_time: '20:00', end_time: '21:30', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#f59e0b' },
      { id: 'st-9', title: 'Protected Night Sleep', category: 'sleep', start_time: '22:30', end_time: '06:00', is_fixed: true, is_sleep: true, status: 'scheduled', color: '#4f46e5' }
    ],
    learnedInsights: [
      { metric: 'Python Study Drift', value: '+18 min', note: 'Sessions average 18 minutes longer than planned. Adaptation Agent allocates buffers.' },
      { metric: 'Task Completion Rate', value: '88%', note: 'High compliance when tasks are scheduled before 8:00 PM.' },
      { metric: 'Mom Voice Lift', value: '+28%', note: 'Morning wake-up promptness improved significantly with approved voice.' }
    ]
  },

  professional: {
    id: 'professional',
    name: 'Priya',
    subtitle: 'Senior Tech Lead & Engineering Manager',
    roleTag: 'Job / Professional',
    ageRange: '30–38',
    avatarAccent: '#00e0c8',
    wakeTime: '06:30',
    sleepTime: '23:00',
    primaryFocus: 'Q3 Architectural Migration & Executive Review',
    protectedCommitment: 'Deep Work Focus & Family Dinner',
    protectPriority: 'Focus Time & Family',
    goals: [
      'Deliver Cloud Architecture V2 on schedule',
      'Conduct 1-on-1 team growth coaching',
      'Zero evening work emails past 7:30 PM',
      'Daily 30-min morning meditation & yoga'
    ],
    momClockSubtitle: 'Focus Guard & Life Balance Clock',
    voicePromptGreeting: "Good morning, Priya! 6:30 AM. Ready for your morning meditation before the standups begin?",
    alarms: [
      { id: 'al-pr-1', title: 'Mindful Morning Wake-Up', time: '06:30', days: 'Mon, Tue, Wed, Thu, Fri', category: 'wake_up', isActive: true, voicePrompt: "Good morning Priya, time to rise for yoga and calm preparation." },
      { id: 'al-pr-2', title: 'Pre-Standup Focus Prep', time: '09:15', days: 'Mon, Tue, Wed, Thu, Fri', category: 'focus', isActive: true, voicePrompt: "15 minutes until daily engineering standup. Reviewing pull requests." },
      { id: 'al-pr-3', title: 'Client Architecture Review', time: '14:00', days: 'Mon, Wed, Fri', category: 'work', isActive: true, voicePrompt: "Executive architectural sync in 10 minutes." },
      { id: 'al-pr-4', title: 'Work Shutdown & Family Guard', time: '19:00', days: 'Everyday', category: 'routine', isActive: true, voicePrompt: "Workday closing. Time to disconnect and enjoy dinner with family." }
    ],
    scheduleBlocks: [
      { id: 'pr-1', title: 'Morning Rise & Pranayama Yoga', category: 'health', start_time: '06:30', end_time: '07:30', is_fixed: true, is_sleep: false, status: 'completed', color: '#00e0c8' },
      { id: 'pr-2', title: 'Healthy Breakfast & Industry News', category: 'routine', start_time: '07:30', end_time: '08:30', is_fixed: false, is_sleep: false, status: 'completed', color: '#10b981' },
      { id: 'pr-3', title: 'Deep Work: Cloud Architecture Specs', category: 'work', start_time: '09:00', end_time: '11:30', is_fixed: false, is_sleep: false, status: 'completed', color: '#7c6cff' },
      { id: 'pr-4', title: 'Engineering Standup & Sync', category: 'work', start_time: '11:30', end_time: '12:30', is_fixed: true, is_sleep: false, status: 'completed', color: '#6366f1' },
      { id: 'pr-5', title: 'Nutritious Lunch & Walk', category: 'break', start_time: '12:30', end_time: '13:30', is_fixed: false, is_sleep: false, status: 'in_progress', color: '#10b981' },
      { id: 'pr-6', title: 'Client Architecture & Stakeholder Review', category: 'work', start_time: '14:00', end_time: '16:30', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#ff5fa2' },
      { id: 'pr-7', title: 'Code Reviews & Async Team Unblock', category: 'work', start_time: '16:45', end_time: '18:15', is_fixed: false, is_sleep: false, status: 'scheduled', color: '#3b82f6' },
      { id: 'pr-8', title: 'Protected Family Dinner & Unwind', category: 'routine', start_time: '19:30', end_time: '21:30', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#f59e0b' },
      { id: 'pr-9', title: 'Protected Recovery Sleep', category: 'sleep', start_time: '23:00', end_time: '06:30', is_fixed: true, is_sleep: true, status: 'scheduled', color: '#4f46e5' }
    ],
    learnedInsights: [
      { metric: 'Deep Work Protection', value: '94%', note: 'Focus blocks remain uninterrupted through automatic meeting conflict resolution.' },
      { metric: 'Evening Boundary Guard', value: '100%', note: 'Zero work blocks scheduled past 7:30 PM across the last 14 days.' },
      { metric: 'Energy Cycle Peak', value: '9:30 AM', note: 'Cognitive acuity highest before lunch; complex code reviews shifted here.' }
    ]
  },

  mother: {
    id: 'mother',
    name: 'Lakshmi',
    subtitle: 'Homemaker & Family Orchestrator',
    roleTag: 'Mother / Caregiver',
    ageRange: '45–55',
    avatarAccent: '#ff5fa2',
    wakeTime: '05:30',
    sleepTime: '22:00',
    primaryFocus: 'Family Health, Kids Routine & Personal Wellness',
    protectedCommitment: 'Morning Rhythm, Kids Pickup & Personal Rest',
    protectPriority: 'Family & Health',
    goals: [
      'Maintain balanced nutritious meals for family',
      'Daily 45-minute yoga and breathing practice',
      'Supervise kids homework and evening snacks',
      'Keep household budget and grocery schedule organized'
    ],
    momClockSubtitle: 'Family Harmony & Routine Clock',
    voicePromptGreeting: "Good morning, Lakshmi! 5:30 AM. Starting fresh with a peaceful tea and breakfast preparation.",
    alarms: [
      { id: 'al-mo-1', title: 'Dawn Awakening & Tea', time: '05:30', days: 'Everyday', category: 'wake_up', isActive: true, voicePrompt: "Good morning Lakshmi, tea water is ready. A quiet peaceful start." },
      { id: 'al-mo-2', title: 'Kids School Bus Alert', time: '07:15', days: 'Mon, Tue, Wed, Thu, Fri', category: 'kids', isActive: true, voicePrompt: "School bus in 15 minutes! Lunch boxes and water bottles ready." },
      { id: 'al-mo-3', title: 'Personal Yoga & Wellness', time: '09:00', days: 'Mon, Tue, Wed, Thu, Fri', category: 'health', isActive: true, voicePrompt: "Your quiet personal wellness time. Let's do 40 minutes of yoga." },
      { id: 'al-mo-4', title: 'Kids School Return & Evening Snacks', time: '16:00', days: 'Mon, Tue, Wed, Thu, Fri', category: 'kids', isActive: true, voicePrompt: "Children returning from school. Time for warm evening snacks." },
      { id: 'al-mo-5', title: 'Family Dinner & Rest Time', time: '20:00', days: 'Everyday', category: 'routine', isActive: true, voicePrompt: "Dinner is served. Warm family gathering time." }
    ],
    scheduleBlocks: [
      { id: 'mo-1', title: 'Morning Puja & Peaceful Tea', category: 'routine', start_time: '05:30', end_time: '06:15', is_fixed: true, is_sleep: false, status: 'completed', color: '#ff5fa2' },
      { id: 'mo-2', title: 'Breakfast Prep & Kids School Lunch Boxes', category: 'routine', start_time: '06:15', end_time: '07:30', is_fixed: true, is_sleep: false, status: 'completed', color: '#f59e0b' },
      { id: 'mo-3', title: 'Kids School Drop & Morning Walk', category: 'routine', start_time: '07:30', end_time: '08:30', is_fixed: true, is_sleep: false, status: 'completed', color: '#10b981' },
      { id: 'mo-4', title: 'Yoga & Guided Meditation', category: 'health', start_time: '09:00', end_time: '10:00', is_fixed: false, is_sleep: false, status: 'completed', color: '#00e0c8' },
      { id: 'mo-5', title: 'Household Management & Fresh Market', category: 'routine', start_time: '10:30', end_time: '12:30', is_fixed: false, is_sleep: false, status: 'in_progress', color: '#6366f1' },
      { id: 'mo-6', title: 'Healthy Lunch & Relaxed Reading', category: 'break', start_time: '13:00', end_time: '14:30', is_fixed: false, is_sleep: false, status: 'scheduled', color: '#10b981' },
      { id: 'mo-7', title: 'Kids Arrival, Snacks & Math Assistance', category: 'routine', start_time: '16:00', end_time: '18:00', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#ff5fa2' },
      { id: 'mo-8', title: 'Family Dinner Preparation & Evening Meal', category: 'routine', start_time: '19:30', end_time: '21:00', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#f59e0b' },
      { id: 'mo-9', title: 'Protected Night Sleep', category: 'sleep', start_time: '22:00', end_time: '05:30', is_fixed: true, is_sleep: true, status: 'scheduled', color: '#4f46e5' }
    ],
    learnedInsights: [
      { metric: 'Morning Stress Reduction', value: '-35%', note: 'Automated packing reminders eliminated rushed morning departures.' },
      { metric: 'Personal Rest Compliance', value: '92%', note: 'Afternoon reading/rest window protected even when errands shifted.' },
      { metric: 'Family Sync Index', value: '98%', note: 'All family members receive synchronized updates for meals and departures.' }
    ]
  },

  grandfather: {
    id: 'grandfather',
    name: 'Ramakrishna',
    subtitle: 'Retired School Principal & Grandfather',
    roleTag: 'Senior Elder / Grandfather',
    ageRange: '70–78',
    avatarAccent: '#f59e0b',
    wakeTime: '05:45',
    sleepTime: '21:30',
    primaryFocus: 'Health, Timely Medications & Daily Strolls',
    protectedCommitment: 'Medication Alarms & Afternoon Rest',
    protectPriority: 'Health & Medications',
    goals: [
      'Take morning Blood Pressure tablet on time at 8:30 AM',
      'Daily 40-minute gentle morning walk in garden',
      'Read regional newspaper and classical philosophy',
      'Afternoon restorative nap from 1:30 PM to 3:00 PM',
      'Evening family video call with grandchildren'
    ],
    momClockSubtitle: 'Mom Clock Medication & Health Guard',
    voicePromptGreeting: "Pranam, Ramakrishna-ji! It's 5:45 AM. The garden air is fresh for your morning walk.",
    alarms: [
      { id: 'al-gf-1', title: 'Gentle Morning Rise & Warm Water', time: '05:45', days: 'Everyday', category: 'wake_up', isActive: true, voicePrompt: "Good morning Ramakrishna-ji. Warm herbal water is ready. Have a gentle start." },
      { id: 'al-gf-2', title: 'CRITICAL: Morning BP & Heart Medicine', time: '08:30', days: 'Everyday', category: 'medication', isActive: true, voicePrompt: "Ramakrishna-ji, time for your morning Blood Pressure tablet after breakfast." },
      { id: 'al-gf-3', title: 'Doctor Tele-Checkup / Vitals Sync', time: '11:30', days: 'Tue, Thu', category: 'health', isActive: true, voicePrompt: "Dr. Sharma's routine vitals checkup is scheduled in 15 minutes." },
      { id: 'al-gf-4', title: 'Afternoon Rest & Recovery Nap', time: '13:30', days: 'Everyday', category: 'sleep', isActive: true, voicePrompt: "Time for your afternoon rest. The house will remain quiet." },
      { id: 'al-gf-5', title: 'Evening Diabetes Medicine', time: '19:45', days: 'Everyday', category: 'medication', isActive: true, voicePrompt: "Evening tablet reminder before light dinner, Ramakrishna-ji." }
    ],
    scheduleBlocks: [
      { id: 'gf-1', title: 'Gentle Awakening & Warm Herbal Water', category: 'routine', start_time: '05:45', end_time: '06:15', is_fixed: true, is_sleep: false, status: 'completed', color: '#f59e0b' },
      { id: 'gf-2', title: 'Garden Walk & Breathing Exercises', category: 'health', start_time: '06:15', end_time: '07:15', is_fixed: false, is_sleep: false, status: 'completed', color: '#10b981' },
      { id: 'gf-3', title: 'Morning Prayers & Classical Reading', category: 'routine', start_time: '07:15', end_time: '08:15', is_fixed: false, is_sleep: false, status: 'completed', color: '#6366f1' },
      { id: 'gf-4', title: 'CRITICAL: Morning BP Medication & Breakfast', category: 'health', start_time: '08:30', end_time: '09:15', is_fixed: true, is_sleep: false, status: 'completed', color: '#ef4444' },
      { id: 'gf-5', title: 'Newspaper, Letters & Crossword', category: 'break', start_time: '09:30', end_time: '11:00', is_fixed: false, is_sleep: false, status: 'in_progress', color: '#3b82f6' },
      { id: 'gf-6', title: 'Light Nutritious Lunch & Digestive Rest', category: 'routine', start_time: '12:30', end_time: '13:30', is_fixed: false, is_sleep: false, status: 'scheduled', color: '#10b981' },
      { id: 'gf-7', title: 'Protected Afternoon Rest Nap', category: 'sleep', start_time: '13:30', end_time: '15:30', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#4f46e5' },
      { id: 'gf-8', title: 'Tea & Video Call with Grandkids', category: 'routine', start_time: '16:30', end_time: '17:30', is_fixed: false, is_sleep: false, status: 'scheduled', color: '#ff5fa2' },
      { id: 'gf-9', title: 'CRITICAL: Evening Diabetes Medicine', category: 'health', start_time: '19:45', end_time: '20:15', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#ef4444' },
      { id: 'gf-10', title: 'Night Sleep (Restorative)', category: 'sleep', start_time: '21:30', end_time: '05:45', is_fixed: true, is_sleep: true, status: 'scheduled', color: '#4f46e5' }
    ],
    learnedInsights: [
      { metric: 'Medication Adherence', value: '100%', note: 'Zero missed pills since Mom Clock spoken voice alerts were activated.' },
      { metric: 'Blood Pressure Stability', value: 'Normal', note: 'Restful sleep + consistent morning walk normalized readings over 30 days.' },
      { metric: 'Rest Window Protection', value: '98%', note: 'Conflict agent deflects all noisy activities between 1:30 PM and 3:30 PM.' }
    ]
  },

  kid: {
    id: 'kid',
    name: 'Aarav',
    subtitle: '5th Grader & Football Captain',
    roleTag: 'Kid / Junior',
    ageRange: '8–12',
    avatarAccent: '#3b82f6',
    wakeTime: '06:45',
    sleepTime: '21:15',
    primaryFocus: 'School Success, Football Play & Bedtime Stories',
    protectedCommitment: 'Outdoor Play & 9 Hours of Sleep',
    protectPriority: 'Sleep & Play',
    goals: [
      'Complete Math & Science fun homework by 6:30 PM',
      'Football practice with friends 4:00 PM to 5:30 PM',
      'Screen time limited to max 30 minutes daily',
      'Listen to Mom bedtime story before 9:00 PM'
    ],
    momClockSubtitle: 'Fun Routine & Storytime Clock',
    voicePromptGreeting: "Good morning champion Aarav! 6:45 AM. School day awaits, let's brush teeth and get ready!",
    alarms: [
      { id: 'al-kd-1', title: 'Champion Rise & Shine', time: '06:45', days: 'Mon, Tue, Wed, Thu, Fri', category: 'wake_up', isActive: true, voicePrompt: "Good morning Aarav! Time to wake up and get ready for school." },
      { id: 'al-kd-2', title: 'School Bus Alert', time: '07:45', days: 'Mon, Tue, Wed, Thu, Fri', category: 'commute', isActive: true, voicePrompt: "Aarav, school bus is almost at the corner! Shoes and water bottle ready." },
      { id: 'al-kd-3', title: 'Homework & Drawing Fun', time: '17:30', days: 'Mon, Tue, Wed, Thu, Fri', category: 'study', isActive: true, voicePrompt: "Time for homework fun! Finish early to enjoy cartoon time." },
      { id: 'al-kd-4', title: 'Screen Time Ends', time: '19:30', days: 'Everyday', category: 'routine', isActive: true, voicePrompt: "30 minutes screen time complete. Great job! Time for dinner." },
      { id: 'al-kd-5', title: 'Mom Bedtime Story', time: '20:45', days: 'Everyday', category: 'sleep', isActive: true, voicePrompt: "Story time with Mom! Cozy up under the blankets." }
    ],
    scheduleBlocks: [
      { id: 'kd-1', title: 'Wake Up & Brush Teeth', category: 'routine', start_time: '06:45', end_time: '07:15', is_fixed: true, is_sleep: false, status: 'completed', color: '#3b82f6' },
      { id: 'kd-2', title: 'Breakfast & School Bag Check', category: 'routine', start_time: '07:15', end_time: '07:45', is_fixed: true, is_sleep: false, status: 'completed', color: '#f59e0b' },
      { id: 'kd-3', title: 'School Classes & Activities', category: 'study', start_time: '08:30', end_time: '15:00', is_fixed: true, is_sleep: false, status: 'completed', color: '#6366f1' },
      { id: 'kd-4', title: 'Healthy Snack & Chill', category: 'break', start_time: '15:15', end_time: '16:00', is_fixed: false, is_sleep: false, status: 'in_progress', color: '#10b981' },
      { id: 'kd-5', title: 'Football Practice & Outdoor Play', category: 'health', start_time: '16:00', end_time: '17:30', is_fixed: false, is_sleep: false, status: 'scheduled', color: '#00e0c8' },
      { id: 'kd-6', title: 'Homework & Science Project', category: 'study', start_time: '17:45', end_time: '18:45', is_fixed: false, is_sleep: false, status: 'scheduled', color: '#7c6cff' },
      { id: 'kd-7', title: 'Family Dinner & Chat', category: 'routine', start_time: '19:30', end_time: '20:30', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#f59e0b' },
      { id: 'kd-8', title: 'Mom Bedtime Story & Lullaby', category: 'routine', start_time: '20:45', end_time: '21:15', is_fixed: true, is_sleep: false, status: 'scheduled', color: '#ff5fa2' },
      { id: 'kd-9', title: 'Deep Healthy Sleep (9.5 Hrs)', category: 'sleep', start_time: '21:15', end_time: '06:45', is_fixed: true, is_sleep: true, status: 'scheduled', color: '#4f46e5' }
    ],
    learnedInsights: [
      { metric: 'Healthy Sleep Duration', value: '9.5 hrs', note: 'Consistently hitting paediatric recommendation for 10-year-olds.' },
      { metric: 'Screen Limit Compliance', value: '100%', note: 'Automated pleasant voice reminder prevents arguments at screen shutoff.' },
      { metric: 'Play vs Study Balance', value: 'Equally Met', note: 'Homework finished 20 minutes faster when outdoor football is guaranteed.' }
    ]
  }
};
