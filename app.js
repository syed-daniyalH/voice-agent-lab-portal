// Voice Agent Portal - Executive Client-Facing Application Engine (v2.0)
document.addEventListener('DOMContentLoaded', () => {

  // --- COMPREHENSIVE STATE STORE ---
  const state = {
    activeSection: 'overview',
    selectedAgent: 'all',
    dateRange: '7d',
    theme: localStorage.getItem('vagent_theme') || 'dark',

    // Pagination & Selection
    callsPage: 1,
    callsPerPage: 5,
    selectedCallIds: new Set(),
    activeFilterPredicate: null,

    // Audio Player State
    currentAudioPlaying: false,
    audioProgress: 0,
    audioDuration: 20,
    audioTimer: null,
    audioSpeed: 1.0,
    currentCall: null,

    // Playground Simulation State
    playgroundActive: false,
    playgroundTimer: null,
    playgroundTurnIndex: 0,

    // Billing & Auto-Refill Settings
    creditBalance: 142.50,
    autoRefillEnabled: true,
    refillThreshold: 25.00,
    refillAmount: 100.00,

    // Trade Topics Cloud
    tradeTopics: [
      { name: 'Worcester Bosch Combi', count: 42, filterTerm: 'Boiler' },
      { name: 'Emergency Radiator Leak', count: 28, filterTerm: 'Leak' },
      { name: 'Air Conditioning Install', count: 21, filterTerm: 'Air Conditioning' },
      { name: 'Annual Boiler Service', count: 35, filterTerm: 'Service' },
      { name: 'Loss of Boiler Pressure', count: 19, filterTerm: 'Pressure' },
      { name: 'Combi Replacement Quote', count: 31, filterTerm: 'Replacement' },
      { name: 'Landlord Gas Safety (CP12)', count: 14, filterTerm: 'Gas' },
      { name: 'Heat Pump Inquiry', count: 9, filterTerm: 'Heat Pump' }
    ],

    // Comprehensive Production Dataset of Calls (16 Realistic Calls)
    calls: [
      {
        id: 'call_Voice_8921a',
        datetime: 'Sep 16, 2026, 08:37 AM',
        durationSec: 20,
        durationStr: '20s',
        cost: '£0.1722',
        from: '+447453140190',
        to: '+447414112588',
        contactName: 'Daniyal Haider',
        agent: 'Essex Heating Inbound',
        direction: 'Inbound',
        status: 'Answered',
        endReason: 'User Hung Up',
        outcome: 'Failed / Dropped',
        favourite: true,
        presetAnalysis: {
          callStatus: 'User Hung Up',
          callSuccess: 'Failed',
          sentiment: 'Neutral',
          disconnectionReason: 'User Hung Up',
          latency: '797.00ms'
        },
        customAnalysis: {
          callerName: 'John Collett',
          email: 'Not Established',
          postcode: 'LL29 7YW',
          propertyAddress: 'Not Established',
          jobType: 'Air Conditioning',
          boilerType: 'N/A',
          issueReported: 'Incomplete',
          emergency: 'No',
          fuelType: 'N/A',
          timeframe: 'Immediate',
          callerType: 'Domestic Customer',
          callOutcome: 'Enquiry - AC Installation',
          quoteFormStatus: 'Not Sent'
        },
        summary: 'John called to enquire about air conditioning installation and provided the postcode LL29 7YW. The agent began to confirm the postcode and area, but the call ended before further details could be established.',
        transcript: [
          { speaker: 'Agent', text: 'Hello, this is Olivia.', time: 0 },
          { speaker: 'User', text: 'Myself. Yeah.', time: 2 },
          { speaker: 'Agent', text: "I'm a receptionist at Essex Heating Experts. How can I help you today?", time: 4 },
          { speaker: 'User', text: 'Yeah. Actually, I want to, uh, you know, air conditioning installed...', time: 8 },
          { speaker: 'Agent', text: "I understand you're interested in air conditioning. Can I take your name, please?", time: 12 },
          { speaker: 'User', text: "Yeah. It's John.", time: 14 },
          { speaker: 'Agent', text: 'Thanks, John. Can I confirm the postcode of the property where you want it installed?', time: 16 },
          { speaker: 'User', text: 'The postcode is LL29 7YW.', time: 18 }
        ],
        reviewStatus: 'Not Reviewed',
        feedbackComment: ''
      },
      {
        id: 'call_Voice_8922b',
        datetime: 'Sep 16, 2026, 09:12 AM',
        durationSec: 105,
        durationStr: '1m 45s',
        cost: '£0.8750',
        from: '+447812938472',
        to: '+447414112588',
        contactName: 'David Miller',
        agent: 'Boiler Sure Inbound',
        direction: 'Inbound',
        status: 'Answered',
        endReason: 'Agent Hung Up',
        outcome: 'Booking Confirmed',
        favourite: true,
        presetAnalysis: {
          callStatus: 'Agent Hung Up',
          callSuccess: 'Success',
          sentiment: 'Positive',
          disconnectionReason: 'Completed Normally',
          latency: '715.00ms'
        },
        customAnalysis: {
          callerName: 'David Miller',
          email: 'david.miller@gmail.com',
          postcode: 'CM1 2AB',
          propertyAddress: '14 Elm Road, Chelmsford',
          jobType: 'Boiler Service',
          boilerType: 'Worcester Bosch Combi',
          issueReported: 'Annual preventative maintenance check',
          emergency: 'No',
          fuelType: 'Natural Gas',
          timeframe: 'Friday 10:00 AM',
          callerType: 'Domestic Customer',
          callOutcome: 'Booked Service Slot',
          quoteFormStatus: 'Confirmed & Sent'
        },
        summary: 'David called to arrange an annual service for his Worcester Bosch combi boiler. The agent confirmed address in Chelmsford, checked n8n live calendar availability, and booked an engineer appointment for Friday at 10:00 AM.',
        transcript: [
          { speaker: 'Agent', text: 'Good morning, Boiler Sure reception. Olivia speaking, how can I help you?', time: 0 },
          { speaker: 'User', text: 'Hi Olivia, I would like to book my annual boiler service for this week.', time: 5 },
          { speaker: 'Agent', text: 'Certainly! May I take your full name and property postcode?', time: 10 },
          { speaker: 'User', text: 'Yes, David Miller at CM1 2AB.', time: 16 },
          { speaker: 'Agent', text: 'Thank you David. We have an engineer available this Friday morning at 10:00 AM. Does that work?', time: 24 },
          { speaker: 'User', text: 'That is perfect, please book it.', time: 29 },
          { speaker: 'Agent', text: "All confirmed! You'll receive an SMS confirmation shortly. Have a great day!", time: 35 }
        ],
        reviewStatus: 'Reviewed - Good',
        feedbackComment: 'Flawless calendar check and friendly UK accent delivery.'
      },
      {
        id: 'call_Voice_8923c',
        datetime: 'Sep 16, 2026, 10:04 AM',
        durationSec: 130,
        durationStr: '2m 10s',
        cost: '£1.0833',
        from: '+447932148291',
        to: '+447414112588',
        contactName: 'Emma Watson',
        agent: 'Essex Heating Inbound',
        direction: 'Inbound',
        status: 'Answered',
        endReason: 'Agent Hung Up',
        outcome: 'Quote Requested',
        favourite: false,
        presetAnalysis: {
          callStatus: 'Agent Hung Up',
          callSuccess: 'Success',
          sentiment: 'Positive',
          disconnectionReason: 'Completed Normally',
          latency: '745.00ms'
        },
        customAnalysis: {
          callerName: 'Emma Watson',
          email: 'emma.watson@outlook.com',
          postcode: 'SS9 3ET',
          propertyAddress: '88 High Street, Leigh-on-Sea',
          jobType: 'Boiler Replacement',
          boilerType: 'Old Ideal Conventional',
          issueReported: 'Boiler losing pressure and making banging noise',
          emergency: 'No',
          fuelType: 'Gas',
          timeframe: 'Next 2 Weeks',
          callerType: 'Homeowner',
          callOutcome: 'Quote Assessment Scheduled',
          quoteFormStatus: 'Quote Form Dispatched'
        },
        summary: 'Emma enquired about replacing an aging 15-year-old boiler that makes loud banging noises. Agent qualified the job as a domestic gas replacement and collected photos via SMS link for a fixed quote.',
        transcript: [
          { speaker: 'Agent', text: 'Welcome to Essex Heating Experts. How can we help you today?', time: 0 },
          { speaker: 'User', text: 'Hi, my boiler is making terrible banging noises and losing pressure constantly.', time: 6 },
          { speaker: 'Agent', text: 'Sorry to hear that! Is it completely out of heating or hot water currently?', time: 14 },
          { speaker: 'User', text: 'We have some hot water but we want a full replacement quote.', time: 20 },
          { speaker: 'Agent', text: 'Understood. Let me gather your details so our surveyor can review your setup.', time: 26 }
        ],
        reviewStatus: 'Not Reviewed',
        feedbackComment: ''
      },
      {
        id: 'call_Voice_8924d',
        datetime: 'Sep 15, 2026, 04:22 PM',
        durationSec: 35,
        durationStr: '35s',
        cost: '£0.2916',
        from: '+447712398410',
        to: '+447414112588',
        contactName: 'Robert Clarke',
        agent: 'Valley Gas Setter',
        direction: 'Outbound',
        status: 'Answered',
        endReason: 'User Hung Up',
        outcome: 'Callback Scheduled',
        favourite: false,
        presetAnalysis: {
          callStatus: 'User Hung Up',
          callSuccess: 'Failed',
          sentiment: 'Neutral',
          disconnectionReason: 'User Hung Up',
          latency: '820.00ms'
        },
        customAnalysis: {
          callerName: 'Robert Clarke',
          email: 'Not Established',
          postcode: 'RM1 4QA',
          propertyAddress: 'Not Established',
          jobType: 'Heating Survey Follow-up',
          boilerType: 'N/A',
          issueReported: 'Busy in a meeting',
          emergency: 'No',
          fuelType: 'N/A',
          timeframe: 'Call Back Tomorrow',
          callerType: 'Prospect',
          callOutcome: 'Callback Requested',
          quoteFormStatus: 'Pending'
        },
        summary: 'Outbound follow up on website heating survey. Contact answered and stated they were in a meeting, asking for a callback tomorrow morning.',
        transcript: [
          { speaker: 'Agent', text: 'Hi Robert, this is Jack calling from Valley Gas following your heating survey request.', time: 0 },
          { speaker: 'User', text: "Hey mate, I'm actually in a meeting right now. Can you call me back tomorrow morning?", time: 8 },
          { speaker: 'Agent', text: 'No problem at all Robert, will try you tomorrow at 10 AM. Have a good evening!', time: 16 }
        ],
        reviewStatus: 'Reviewed - Good',
        feedbackComment: 'Responded politely and quickly gracefully exiting call.'
      },
      {
        id: 'call_Voice_8925e',
        datetime: 'Sep 15, 2026, 02:15 PM',
        durationSec: 80,
        durationStr: '1m 20s',
        cost: '£0.6667',
        from: '+447543219800',
        to: '+447414112588',
        contactName: 'Sophie Turner',
        agent: 'Essex Heating Inbound',
        direction: 'Inbound',
        status: 'Answered',
        endReason: 'Agent Hung Up',
        outcome: 'Booking Confirmed',
        favourite: true,
        presetAnalysis: {
          callStatus: 'Agent Hung Up',
          callSuccess: 'Success',
          sentiment: 'Positive',
          disconnectionReason: 'Completed Normally',
          latency: '690.00ms'
        },
        customAnalysis: {
          callerName: 'Sophie Turner',
          email: 'sophie.turner@yahoo.co.uk',
          postcode: 'CM2 7HQ',
          propertyAddress: '24 Baddow Road, Chelmsford',
          jobType: 'Emergency Radiator Leak',
          boilerType: 'N/A',
          issueReported: 'Radiator valve leaking water onto bedroom floor',
          emergency: 'Yes',
          fuelType: 'N/A',
          timeframe: 'Same Day Emergency',
          callerType: 'Domestic Tenant',
          callOutcome: 'Emergency Dispatch Booked',
          quoteFormStatus: 'Approved'
        },
        summary: 'Urgent call regarding an active radiator leak. Agent recognized emergency branch, provided immediate isolation advice, and booked an emergency callout engineer within the 2-hour window.',
        transcript: [
          { speaker: 'Agent', text: 'Essex Heating Experts, Olivia speaking. How can I help you?', time: 0 },
          { speaker: 'User', text: 'Hi! I have water leaking out of my radiator valve onto the floor right now!', time: 5 },
          { speaker: 'Agent', text: 'Please place a towel or bucket underneath right away. Where are you located so I can get an engineer to you?', time: 12 },
          { speaker: 'User', text: "I'm in Chelmsford, CM2 7HQ.", time: 18 },
          { speaker: 'Agent', text: 'Thank you Sophie. We have an emergency slot available in 90 minutes. I have dispatched this directly to our on-call team.', time: 26 }
        ],
        reviewStatus: 'Reviewed - Good',
        feedbackComment: 'Excellent emergency triage recognition!'
      },
      {
        id: 'call_Voice_8926f',
        datetime: 'Sep 15, 2026, 11:30 AM',
        durationSec: 92,
        durationStr: '1m 32s',
        cost: '£0.7667',
        from: '+447890123456',
        to: '+447414112588',
        contactName: 'Graham Norton',
        agent: 'Boiler Sure Inbound',
        direction: 'Inbound',
        status: 'Answered',
        endReason: 'Agent Hung Up',
        outcome: 'Booking Confirmed',
        favourite: false,
        presetAnalysis: {
          callStatus: 'Agent Hung Up',
          callSuccess: 'Success',
          sentiment: 'Positive',
          disconnectionReason: 'Completed Normally',
          latency: '720.00ms'
        },
        customAnalysis: {
          callerName: 'Graham Norton',
          email: 'graham.n@btconnect.com',
          postcode: 'CM7 1TG',
          propertyAddress: '12 Church Lane, Braintree',
          jobType: 'Landlord CP12 Gas Safety',
          boilerType: 'Baxi Combi 105E',
          issueReported: 'Annual safety certificate inspection for 2 rental flats',
          emergency: 'No',
          fuelType: 'Natural Gas',
          timeframe: 'Next Thursday',
          callerType: 'Landlord',
          callOutcome: 'CP12 Inspection Booked',
          quoteFormStatus: 'Dispatched'
        },
        summary: 'Landlord Graham booked an annual CP12 Gas Safety Certificate inspection for rental property in Braintree. Slot confirmed for next Thursday at 2:00 PM.',
        transcript: [
          { speaker: 'Agent', text: 'Boiler Sure reception, Olivia speaking. How can I assist you today?', time: 0 },
          { speaker: 'User', text: 'Hello, I am a landlord with a property in Braintree and I need a Gas Safety CP12 certificate done.', time: 5 },
          { speaker: 'Agent', text: 'Certainly! How many gas appliances are installed at the property?', time: 11 },
          { speaker: 'User', text: 'Just one gas boiler and a gas hob.', time: 15 },
          { speaker: 'Agent', text: 'Perfect. We charge £95 plus VAT for both appliances. We can attend Thursday at 2pm.', time: 22 }
        ],
        reviewStatus: 'Not Reviewed',
        feedbackComment: ''
      },
      {
        id: 'call_Voice_8927g',
        datetime: 'Sep 14, 2026, 03:45 PM',
        durationSec: 15,
        durationStr: '15s',
        cost: '£0.1250',
        from: '+447999888777',
        to: '+447414112588',
        contactName: 'Unknown Caller',
        agent: 'Essex Heating Inbound',
        direction: 'Inbound',
        status: 'Voicemail',
        endReason: 'Caller Disconnected',
        outcome: 'Voicemail Detected',
        favourite: false,
        presetAnalysis: {
          callStatus: 'Voicemail',
          callSuccess: 'Failed',
          sentiment: 'Neutral',
          disconnectionReason: 'Caller Inactivity',
          latency: '810.00ms'
        },
        customAnalysis: {
          callerName: 'Not Established',
          email: 'Not Established',
          postcode: 'Not Established',
          propertyAddress: 'Not Established',
          jobType: 'Not Established',
          boilerType: 'N/A',
          issueReported: 'Silent line / Background noise only',
          emergency: 'No',
          fuelType: 'N/A',
          timeframe: 'N/A',
          callerType: 'Unknown',
          callOutcome: 'No Interaction',
          quoteFormStatus: 'Not Sent'
        },
        summary: 'Caller connected with background noise but hung up before speaking.',
        transcript: [
          { speaker: 'Agent', text: 'Hello, Essex Heating Experts. How can I help you today?', time: 0 }
        ],
        reviewStatus: 'Not Reviewed',
        feedbackComment: ''
      },
      {
        id: 'call_Voice_8928h',
        datetime: 'Sep 14, 2026, 01:20 PM',
        durationSec: 145,
        durationStr: '2m 25s',
        cost: '£1.2083',
        from: '+447654321098',
        to: '+447414112588',
        contactName: 'Clara Oswald',
        agent: 'Essex Heating Inbound',
        direction: 'Inbound',
        status: 'Answered',
        endReason: 'Agent Hung Up',
        outcome: 'Quote Requested',
        favourite: true,
        presetAnalysis: {
          callStatus: 'Agent Hung Up',
          callSuccess: 'Success',
          sentiment: 'Positive',
          disconnectionReason: 'Completed Normally',
          latency: '730.00ms'
        },
        customAnalysis: {
          callerName: 'Clara Oswald',
          email: 'clara.o@schools.co.uk',
          postcode: 'E17 4QR',
          propertyAddress: '55 Forest Road, Walthamstow',
          jobType: 'Heat Pump Inquiry',
          boilerType: 'Switching from Gas to Air Source',
          issueReported: 'Seeking Boiler Upgrade Scheme (£7,500 government grant)',
          emergency: 'No',
          fuelType: 'Renewable Electric',
          timeframe: 'October 2026',
          callerType: 'Homeowner',
          callOutcome: 'Grant Eligibility Survey Arranged',
          quoteFormStatus: 'Dispatched'
        },
        summary: 'Clara called regarding air source heat pump installation under the UK Boiler Upgrade Scheme. Agent confirmed property type and booked a free technical heat loss survey.',
        transcript: [
          { speaker: 'Agent', text: 'Thanks for calling Essex Heating Experts. Olivia here, how can I help?', time: 0 },
          { speaker: 'User', text: 'Hi! Do you install air source heat pumps and do you qualify for the £7,500 government grant?', time: 6 },
          { speaker: 'Agent', text: 'Yes, absolutely! We are MCS certified and handle the full £7,500 grant application on your behalf.', time: 14 },
          { speaker: 'User', text: 'Wonderful! Can someone come out to inspect my radiators and insulation?', time: 22 },
          { speaker: 'Agent', text: 'Certainly Clara, we can schedule our renewable energy surveyor for next Tuesday.', time: 30 }
        ],
        reviewStatus: 'Reviewed - Good',
        feedbackComment: 'Superb knowledge retrieval on MCS heat pump grant rules!'
      },
      {
        id: 'call_Voice_8929i',
        datetime: 'Sep 13, 2026, 05:10 PM',
        durationSec: 75,
        durationStr: '1m 15s',
        cost: '£0.6250',
        from: '+447333222111',
        to: '+447414112588',
        contactName: 'Peter Capaldi',
        agent: 'Valley Gas Setter',
        direction: 'Outbound',
        status: 'Answered',
        endReason: 'Agent Hung Up',
        outcome: 'Booking Confirmed',
        favourite: false,
        presetAnalysis: {
          callStatus: 'Agent Hung Up',
          callSuccess: 'Success',
          sentiment: 'Positive',
          disconnectionReason: 'Completed Normally',
          latency: '740.00ms'
        },
        customAnalysis: {
          callerName: 'Peter Capaldi',
          email: 'peter.c@tardis.org',
          postcode: 'CM3 5WP',
          propertyAddress: 'Old Farmhouse, Danbury',
          jobType: 'Oil Boiler Replacement',
          boilerType: 'Grant Vortex Oil Combi',
          issueReported: 'Oil boiler over 20 years old, highly inefficient',
          emergency: 'No',
          fuelType: 'Kerosene Oil',
          timeframe: 'Next Month',
          callerType: 'Rural Homeowner',
          callOutcome: 'Surveyor Visit Booked',
          quoteFormStatus: 'Approved'
        },
        summary: 'Outbound setter qualified rural oil boiler prospect. Confirmed tank location and booked surveyor visit for Wednesday afternoon.',
        transcript: [
          { speaker: 'Agent', text: 'Hi Peter, Jack calling from Valley Gas. You recently requested info on oil boiler upgrades?', time: 0 },
          { speaker: 'User', text: 'Yes Jack, our Grant Vortex is drinking oil like crazy.', time: 6 },
          { speaker: 'Agent', text: 'Modern condensing oil boilers can reduce consumption by up to 30%. Would Wednesday at 3pm suit for our surveyor?', time: 14 },
          { speaker: 'User', text: 'Yes, that works fine for me.', time: 20 }
        ],
        reviewStatus: 'Reviewed - Good',
        feedbackComment: ''
      },
      {
        id: 'call_Voice_8930j',
        datetime: 'Sep 13, 2026, 10:15 AM',
        durationSec: 110,
        durationStr: '1m 50s',
        cost: '£0.9167',
        from: '+447444555666',
        to: '+447414112588',
        contactName: 'Arthur Dent',
        agent: 'Essex Heating Inbound',
        direction: 'Inbound',
        status: 'Answered',
        endReason: 'Agent Hung Up',
        outcome: 'Enquiry Captured',
        favourite: false,
        presetAnalysis: {
          callStatus: 'Agent Hung Up',
          callSuccess: 'Success',
          sentiment: 'Neutral',
          disconnectionReason: 'Completed Normally',
          latency: '760.00ms'
        },
        customAnalysis: {
          callerName: 'Arthur Dent',
          email: 'arthur.dent@galaxy.co.uk',
          postcode: 'CM9 8TR',
          propertyAddress: 'Country Cottage, Maldon',
          jobType: 'Power Flushing Service',
          boilerType: 'Potterton Profile',
          issueReported: 'Radiators cold at the bottom due to magnetite sludge',
          emergency: 'No',
          fuelType: 'Gas',
          timeframe: 'Within 2 weeks',
          callerType: 'Homeowner',
          callOutcome: 'Quoted £450 + VAT for 8 Radiators',
          quoteFormStatus: 'Dispatched'
        },
        summary: 'Arthur enquired about power flushing system. Agent explained magnetic filter installation and sent fixed quote of £450 + VAT.',
        transcript: [
          { speaker: 'Agent', text: 'Essex Heating Experts, Olivia speaking. How can I help today?', time: 0 },
          { speaker: 'User', text: 'Hello, my radiators take forever to heat up and they are freezing cold at the bottom.', time: 5 },
          { speaker: 'Agent', text: 'That sounds like central heating sludge buildup. A MagnaCleanse power flush usually resolves that completely.', time: 14 }
        ],
        reviewStatus: 'Not Reviewed',
        feedbackComment: ''
      }
    ],

    // 10 Detailed Customer Contacts
    contacts: [
      { id: 'cnt_1', name: 'Daniyal Haider', phone: '+447453140190', email: 'zain@voiceagent.com', postcode: 'LL29 7YW', callsCount: 6, lastCall: 'Sep 16, 2026', notes: 'AC Installation enquiry; needs call back with sizing chart.', favourite: true },
      { id: 'cnt_2', name: 'David Miller', phone: '+447812938472', email: 'david.miller@gmail.com', postcode: 'CM1 2AB', callsCount: 3, lastCall: 'Sep 16, 2026', notes: 'Boiler service booked for Friday 10:00 AM.', favourite: true },
      { id: 'cnt_3', name: 'Emma Watson', phone: '+447932148291', email: 'emma.watson@outlook.com', postcode: 'SS9 3ET', callsCount: 2, lastCall: 'Sep 16, 2026', notes: 'Combi boiler replacement quote dispatched.', favourite: false },
      { id: 'cnt_4', name: 'Robert Clarke', phone: '+447712398410', email: 'robert.clarke@btinternet.com', postcode: 'RM1 4QA', callsCount: 4, lastCall: 'Sep 15, 2026', notes: 'Outbound survey callback scheduled for tomorrow.', favourite: false },
      { id: 'cnt_5', name: 'Sophie Turner', phone: '+447543219800', email: 'sophie.turner@yahoo.co.uk', postcode: 'CM2 7HQ', callsCount: 2, lastCall: 'Sep 15, 2026', notes: 'Emergency radiator leak repair completed.', favourite: true },
      { id: 'cnt_6', name: 'Graham Norton', phone: '+447890123456', email: 'graham.n@btconnect.com', postcode: 'CM7 1TG', callsCount: 1, lastCall: 'Sep 15, 2026', notes: 'Landlord CP12 inspection booked for Thursday 2pm.', favourite: false },
      { id: 'cnt_7', name: 'Clara Oswald', phone: '+447654321098', email: 'clara.o@schools.co.uk', postcode: 'E17 4QR', callsCount: 3, lastCall: 'Sep 14, 2026', notes: 'Heat Pump £7,500 BUS grant survey arranged.', favourite: true },
      { id: 'cnt_8', name: 'Peter Capaldi', phone: '+447333222111', email: 'peter.c@tardis.org', postcode: 'CM3 5WP', callsCount: 1, lastCall: 'Sep 13, 2026', notes: 'Oil boiler survey visit arranged.', favourite: false },
      { id: 'cnt_9', name: 'Arthur Dent', phone: '+447444555666', email: 'arthur.dent@galaxy.co.uk', postcode: 'CM9 8TR', callsCount: 2, lastCall: 'Sep 13, 2026', notes: 'Power flush quote sent for 8 radiators.', favourite: false },
      { id: 'cnt_10', name: 'Martha Jones', phone: '+447111222333', email: 'martha@nhs.net', postcode: 'SS1 2AB', callsCount: 1, lastCall: 'Sep 12, 2026', notes: 'Emergency no hot water triage.', favourite: false }
    ],

    // Team Users & Access
    users: [
      { name: 'Daniyal Haider', email: 'admin@voiceagent.com', agent: 'All Agents', role: 'Super Admin', company: 'We Build Trades', access: 'Full Agency', costPerMin: '£0.55', joined: 'Apr 8, 2026' },
      { name: 'Mark Stevenson', email: 'mark@essexheating.co.uk', agent: 'Essex Heating Inbound', role: 'Business Owner', company: 'Essex Heating Experts', access: 'Client Portal', costPerMin: '£0.50', joined: 'Feb 12, 2026' },
      { name: 'Liam Patel', email: 'liam@valleygas.co.uk', agent: 'Valley Gas Setter', role: 'Operations Lead', company: 'Valley Gas', access: 'Client Portal', costPerMin: '£0.50', joined: 'Jan 28, 2026' },
      { name: 'Chloe Taylor', email: 'chloe@boilersure.co.uk', agent: 'Boiler Sure Inbound', role: 'Lead Dispatcher', company: 'Boiler Sure', access: 'Read & Triage', costPerMin: '£0.50', joined: 'Jan 5, 2026' },
      { name: 'James Wilson', email: 'james@webuildtrades.com', agent: 'All Agents', role: 'Account Manager', company: 'We Build Trades', access: 'Support Admin', costPerMin: '£0.50', joined: 'Mar 1, 2026' }
    ],

    invitations: [
      { email: 'sarah@boilerrepair.co.uk', name: 'Sarah Jenkins', agent: 'Essex Heating Inbound', role: 'Manager', company: 'Essex Heating Experts', sent: 'Sep 14, 2026', expires: 'Sep 21, 2026', status: 'Pending' },
      { email: 'technical@valleygas.co.uk', name: 'Tom Hardy', agent: 'Valley Gas Setter', role: 'Dispatcher', company: 'Valley Gas', sent: 'Sep 16, 2026', expires: 'Sep 23, 2026', status: 'Pending' }
    ],

    // Knowledge Bases with Vector Document Chunks
    knowledgeBases: [
      {
        id: 'kb_1',
        name: 'Essex Heating Triage & Service Postcodes',
        docsCount: 12,
        status: 'Indexed',
        size: '14.2 MB',
        updated: 'Sep 12, 2026',
        desc: 'Coverage areas in Essex (CM & SS postcodes), emergency triage protocols, out-of-hours rate cards.',
        files: [
          { name: 'Service_Areas_Postcodes_2026.pdf', size: '2.4 MB', chunks: 48, status: 'Indexed' },
          { name: 'Emergency_Triage_Rate_Card.pdf', size: '1.1 MB', chunks: 22, status: 'Indexed' },
          { name: 'Gas_Safe_Registered_Certificates.pdf', size: '3.8 MB', chunks: 64, status: 'Indexed' },
          { name: 'Boiler_Diagnostics_Fee_Structure.docx', size: '850 KB', chunks: 18, status: 'Indexed' }
        ]
      },
      {
        id: 'kb_2',
        name: 'Boiler Repair Guides & Diagnostic Tree',
        docsCount: 7,
        status: 'Indexed',
        size: '28.5 MB',
        updated: 'Aug 29, 2026',
        desc: 'Fault codes for Worcester Bosch, Ideal Logic, Vaillant ecoTEC, and emergency gas safety protocols.',
        files: [
          { name: 'Worcester_Bosch_Greenstar_Error_Codes.pdf', size: '8.2 MB', chunks: 112, status: 'Indexed' },
          { name: 'Ideal_Logic_F1_L2_Diagnostics.pdf', size: '5.4 MB', chunks: 76, status: 'Indexed' },
          { name: 'Gas_Leak_Immediate_Isolation_Steps.pdf', size: '940 KB', chunks: 14, status: 'Indexed' }
        ]
      },
      {
        id: 'kb_3',
        name: 'Valley Gas Pricing & Survey FAQs',
        docsCount: 4,
        status: 'Indexed',
        size: '5.1 MB',
        updated: 'Sep 02, 2026',
        desc: 'Standard combi replacement packages, 0% finance options, and rural oil heating criteria.',
        files: [
          { name: 'Combi_Replacement_Price_Matrix.pdf', size: '1.8 MB', chunks: 32, status: 'Indexed' },
          { name: 'Zero_Percent_Finance_Disclosures.pdf', size: '2.1 MB', chunks: 40, status: 'Indexed' }
        ]
      },
      {
        id: 'kb_4',
        name: 'J&C Plumbing General Knowledge',
        docsCount: 3,
        status: 'Indexed',
        size: '3.8 MB',
        updated: 'Jul 19, 2026',
        desc: 'Commercial vs domestic policies, accepted credit card types, and bathroom installation guarantees.',
        files: [
          { name: 'Domestic_Plumbing_TandC.pdf', size: '1.5 MB', chunks: 28, status: 'Indexed' },
          { name: 'Bathroom_Fitting_Payment_Schedule.pdf', size: '1.2 MB', chunks: 20, status: 'Indexed' }
        ]
      }
    ],

    // Invoices Ledger
    invoices: [
      { id: 'INV-2026-009', date: 'Sep 01, 2026', desc: 'Voice Agent Usage - August 2026 (620 mins)', amount: '£310.00', tax: '£62.00', status: 'Paid' },
      { id: 'INV-2026-008', date: 'Aug 01, 2026', desc: 'Voice Agent Usage - July 2026 (580 mins)', amount: '£290.00', tax: '£58.00', status: 'Paid' },
      { id: 'INV-2026-007', date: 'Jul 01, 2026', desc: 'Credit Top-Up (Auto-Refill)', amount: '£100.00', tax: '£20.00', status: 'Paid' },
      { id: 'INV-2026-006', date: 'Jun 01, 2026', desc: 'Voice Agent Setup & Telephony Provisioning', amount: '£250.00', tax: '£50.00', status: 'Paid' }
    ],

    // Audit Trail
    auditLogs: [
      { datetime: 'Sep 16, 2026, 09:30 AM', user: 'Daniyal Haider', action: 'Call Review Saved', entity: 'Call', entityName: 'call_Voice_8922b', details: 'Marked as Reviewed - Good; added feedback on UK calendar check.' },
      { datetime: 'Sep 16, 2026, 08:45 AM', user: 'Daniyal Haider', action: 'Filter Preset Saved', entity: 'Preset', entityName: 'Failed Inbound Triage', details: 'Saved filter with direction=Inbound, status=Failed' },
      { datetime: 'Sep 15, 2026, 02:45 PM', user: 'Mark Stevenson', action: 'Call Review Saved', entity: 'Call', entityName: 'call_Voice_8925e', details: 'Emergency leak protocol praised.' },
      { datetime: 'Sep 14, 2026, 02:10 PM', user: 'Daniyal Haider', action: 'User Invited', entity: 'User', entityName: 'sarah@boilerrepair.co.uk', details: 'Sent Manager invite for Essex Heating Inbound' },
      { datetime: 'Sep 12, 2026, 11:15 AM', user: 'Mark Stevenson', action: 'Knowledge Base Created', entity: 'Knowledge Base', entityName: 'Essex Heating Triage', details: 'Uploaded 12 files for Voice vector indexing' },
      { datetime: 'Sep 10, 2026, 09:00 AM', user: 'System', action: 'Credits Added', entity: 'Billing', entityName: 'Top-Up £100.00', details: 'Auto-refill triggered below £25 threshold' }
    ]
  };

  // --- INITIALIZATION ---
  applyTheme(state.theme);
  initThemeToggle();
  initNavigation();
  initDashboardHeatmap();
  initDashboardCharts();
  renderTopicCloud();
  renderCallsTable();
  renderContactsTable();
  renderUsersAndInvites();
  renderKnowledgeBases();
  renderInvoicesTable();
  renderAuditLogsTable();
  renderFavourites();
  renderFeedbackTable();
  initCallDrawer();
  initVoicePlayground();
  initSemanticKbTester();
  initModals();
  initFilters();
  initBulkActions();

  // --- THEME ENGINE ---
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    state.theme = t;
    localStorage.setItem('vagent_theme', t);
  }

  function initThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        const next = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast(`Switched to ${next === 'dark' ? 'Executive Dark Navy' : 'Clean Daylight'} mode.`);
      });
    }
  }

  // --- NAVIGATION CONTROLLER ---
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.portal-section');
    const pageTitle = document.getElementById('pageTitle');

    const titleMap = {
      overview: 'Dashboard',
      users: 'User Management',
      calls: 'Call Center & History',
      contacts: 'Customer Contacts',
      favourites: 'Favourites',
      feedback: 'Voice Agent QA & Feedback',
      audit: 'Audit & System Logs',
      knowledge: 'AI Knowledge Base',
      billing: 'Billing & Minutes Balance',
      settings: 'Account & Regional Settings'
    };

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-section');
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        sections.forEach(s => s.classList.remove('active'));
        const activeSec = document.getElementById(`sec-${target}`);
        if (activeSec) {
          activeSec.classList.add('active');
        }

        state.activeSection = target;
        if (pageTitle && titleMap[target]) {
          pageTitle.textContent = titleMap[target];
        }
      });
    });

    // Global Refresh Simulator
    const refreshBtn = document.getElementById('globalRefreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spin-anim');
        setTimeout(() => {
          refreshBtn.classList.remove('spin-anim');
          showToast('Live Voice AI calls, latency, and GoHighLevel CRM status refreshed.');
        }, 500);
      });
    }

    // Sign out button
    document.getElementById('signOutBtn')?.addEventListener('click', () => {
      showToast('Signed out of Voice Agent Portal.');
    });

    // Topbar Voice Agent Filter Dynamic Update
    const agentFilterSelect = document.getElementById('agentFilterSelect');
    if (agentFilterSelect) {
      agentFilterSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        state.selectedAgent = val;
        updateOverviewMetricsByAgent(val);
        showToast(`Dashboard filtered for: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Topbar Date Range Selector
    const dateRangeSelect = document.getElementById('dateRangeSelect');
    if (dateRangeSelect) {
      dateRangeSelect.addEventListener('change', (e) => {
        state.dateRange = e.target.value;
        updateOverviewMetricsByDateRange(e.target.value);
        showToast(`Date range updated to: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }
  }

  function updateOverviewMetricsByAgent(agentKey) {
    const totalCalls = document.getElementById('valTotalCalls');
    const totalContacts = document.getElementById('valTotalContacts');
    const successRate = document.getElementById('valSuccessRate');
    const latency = document.getElementById('valLatency');

    if (agentKey === 'boiler_sure') {
      if (totalCalls) totalCalls.textContent = '68';
      if (totalContacts) totalContacts.textContent = '51';
      if (successRate) successRate.textContent = '82%';
      if (latency) latency.textContent = '715 ms';
    } else if (agentKey === 'essex_heating') {
      if (totalCalls) totalCalls.textContent = '72';
      if (totalContacts) totalContacts.textContent = '44';
      if (successRate) successRate.textContent = '76%';
      if (latency) latency.textContent = '742 ms';
    } else if (agentKey === 'valley_gas') {
      if (totalCalls) totalCalls.textContent = '19';
      if (totalContacts) totalContacts.textContent = '8';
      if (successRate) successRate.textContent = '64%';
      if (latency) latency.textContent = '780 ms';
    } else {
      if (totalCalls) totalCalls.textContent = '159';
      if (totalContacts) totalContacts.textContent = '103';
      if (successRate) successRate.textContent = '73%';
      if (latency) latency.textContent = '742 ms';
    }
  }

  function updateOverviewMetricsByDateRange(rangeKey) {
    const totalCalls = document.getElementById('valTotalCalls');
    if (rangeKey === 'today') {
      if (totalCalls) totalCalls.textContent = '14';
    } else if (rangeKey === '4w') {
      if (totalCalls) totalCalls.textContent = '612';
    } else if (rangeKey === '3m') {
      if (totalCalls) totalCalls.textContent = '1,840';
    } else {
      updateOverviewMetricsByAgent(state.selectedAgent);
    }
  }

  // --- TOPIC CLOUD ---
  function renderTopicCloud() {
    const container = document.getElementById('topicCloudContainer');
    if (!container) return;

    container.innerHTML = state.tradeTopics.map(topic => `
      <div class="topic-pill" data-filter="${topic.filterTerm}">
        <span>${topic.name}</span>
        <span class="topic-count">${topic.count} calls</span>
      </div>
    `).join('');

    container.querySelectorAll('.topic-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const term = pill.getAttribute('data-filter');
        document.getElementById('nav-calls')?.click();
        const phoneInput = document.getElementById('filterPhoneInput');
        if (phoneInput) {
          phoneInput.value = term;
          phoneInput.dispatchEvent(new Event('input'));
        }
        showToast(`Filtered calls discussing: "${term}"`);
      });
    });
  }

  // --- HEATMAP: PEAK CALL TIMES ---
  function initDashboardHeatmap() {
    const container = document.getElementById('heatmapContainer');
    const tooltip = document.getElementById('heatmapTooltip');
    if (!container) return;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = ['12a', '2a', '4a', '6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];

    let html = '<div class="heatmap-grid">';
    html += '<div class="heatmap-col-header"></div>';
    hours.forEach(h => {
      html += `<div class="heatmap-col-header">${h}</div>`;
    });

    days.forEach((day, dIdx) => {
      html += `<div class="heatmap-row-label">${day}</div>`;
      hours.forEach((h, hIdx) => {
        let count = 0;
        const isWeekday = dIdx >= 1 && dIdx <= 5;
        if (isWeekday) {
          if (hIdx >= 4 && hIdx <= 7) {
            count = Math.floor(Math.random() * 12) + 8;
          } else if (hIdx >= 3 && hIdx <= 9) {
            count = Math.floor(Math.random() * 6) + 3;
          } else {
            count = Math.floor(Math.random() * 3);
          }
        } else {
          if (hIdx >= 4 && hIdx <= 6) {
            count = Math.floor(Math.random() * 4) + 2;
          } else {
            count = Math.floor(Math.random() * 2);
          }
        }

        let lvl = 0;
        if (count >= 15) lvl = 4;
        else if (count >= 10) lvl = 3;
        else if (count >= 5) lvl = 2;
        else if (count >= 2) lvl = 1;

        html += `<div class="heatmap-cell lvl-${lvl}" data-day="${day}" data-time="${h}" data-count="${count}"></div>`;
      });
    });

    html += '</div>';
    container.innerHTML = html;

    const cells = container.querySelectorAll('.heatmap-cell');
    cells.forEach(cell => {
      cell.addEventListener('mouseenter', (e) => {
        const d = cell.getAttribute('data-day');
        const t = cell.getAttribute('data-time');
        const c = cell.getAttribute('data-count');
        tooltip.textContent = `${d} at ${t}: ${c} calls`;
        tooltip.style.display = 'block';
        const rect = cell.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX - 20}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 36}px`;
      });
      cell.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  // --- DASHBOARD CHARTS ---
  function initDashboardCharts() {
    const days = ['Sep 10', 'Sep 11', 'Sep 12', 'Sep 13', 'Sep 14', 'Sep 15', 'Sep 16'];
    const callCounts = [22, 28, 14, 12, 32, 26, 25];
    const durations = [1.2, 1.4, 0.9, 0.8, 1.3, 1.1, 1.25];

    const callsLine = document.getElementById('callsLinePath');
    const callsArea = document.getElementById('callsAreaPath');
    const callsDots = document.getElementById('callsDotsGroup');
    const callsLabels = document.getElementById('callsLabelsGroup');

    if (callsLine && callsArea) {
      const w = 540;
      const x0 = 40;
      const step = w / (days.length - 1);
      const maxVal = 40;

      let dLine = '';
      let dArea = '';
      let dotsHtml = '';
      let labelsHtml = '';

      callCounts.forEach((val, i) => {
        const x = x0 + i * step;
        const y = 170 - (val / maxVal) * 140;

        if (i === 0) {
          dLine += `M ${x} ${y}`;
          dArea += `M ${x} 170 L ${x} ${y}`;
        } else {
          const prevX = x0 + (i - 1) * step;
          const prevY = 170 - (callCounts[i - 1] / maxVal) * 140;
          const cpX1 = prevX + step / 2;
          const cpX2 = x - step / 2;
          dLine += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
          dArea += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
        }

        dotsHtml += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--bg-card)" stroke="#0ea5e9" stroke-width="2.5"><title>${days[i]}: ${val} calls</title></circle>`;
        labelsHtml += `<text x="${x}" y="190" text-anchor="middle">${days[i]}</text>`;
      });

      dArea += ` L ${x0 + (days.length - 1) * step} 170 Z`;
      callsLine.setAttribute('d', dLine);
      callsArea.setAttribute('d', dArea);
      callsDots.innerHTML = dotsHtml;
      callsLabels.innerHTML = labelsHtml;
    }

    const durLine = document.getElementById('durationLinePath');
    const durArea = document.getElementById('durationAreaPath');
    const durDots = document.getElementById('durationDotsGroup');
    const durLabels = document.getElementById('durationLabelsGroup');

    if (durLine && durArea) {
      const w = 540;
      const x0 = 40;
      const step = w / (days.length - 1);
      const maxVal = 2.0;

      let dLine = '';
      let dArea = '';
      let dotsHtml = '';
      let labelsHtml = '';

      durations.forEach((val, i) => {
        const x = x0 + i * step;
        const y = 170 - (val / maxVal) * 140;

        if (i === 0) {
          dLine += `M ${x} ${y}`;
          dArea += `M ${x} 170 L ${x} ${y}`;
        } else {
          const prevX = x0 + (i - 1) * step;
          const prevY = 170 - (durations[i - 1] / maxVal) * 140;
          const cpX1 = prevX + step / 2;
          const cpX2 = x - step / 2;
          dLine += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
          dArea += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
        }

        dotsHtml += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--bg-card)" stroke="#14b8a6" stroke-width="2.5"><title>${days[i]}: ${val} mins</title></circle>`;
        labelsHtml += `<text x="${x}" y="190" text-anchor="middle">${days[i]}</text>`;
      });

      dArea += ` L ${x0 + (days.length - 1) * step} 170 Z`;
      durLine.setAttribute('d', dLine);
      durArea.setAttribute('d', dArea);
      durDots.innerHTML = dotsHtml;
      durLabels.innerHTML = labelsHtml;
    }
  }

  // --- CALLS TABLE WITH CLIENT-SIDE PAGINATION & SELECTION ---
  function renderCallsTable(filterPredicate = null) {
    const tbody = document.getElementById('callsTableBody');
    if (!tbody) return;

    if (filterPredicate !== null) {
      state.activeFilterPredicate = filterPredicate;
      state.callsPage = 1;
    }

    let items = state.calls;
    if (state.activeFilterPredicate) {
      items = items.filter(state.activeFilterPredicate);
    }

    const total = items.length;
    const startIndex = (state.callsPage - 1) * state.callsPerPage;
    const pageItems = items.slice(startIndex, startIndex + state.callsPerPage);

    if (total === 0) {
      tbody.innerHTML = `<tr><td colspan="13" class="text-center text-muted" style="padding: 24px; text-align:center;">No calls match the selected filter criteria.</td></tr>`;
      updatePaginationControls(0, 0, 0);
      return;
    }

    tbody.innerHTML = pageItems.map(call => {
      const isFailed = call.outcome.includes('Failed');
      const isBooked = call.outcome.includes('Booked');
      let outcomeClass = 'badge-neutral';
      if (isFailed) outcomeClass = 'badge-danger';
      else if (isBooked) outcomeClass = 'badge-success';
      else outcomeClass = 'badge-info';

      const dirClass = call.direction === 'Inbound' ? 'badge-info' : 'badge-neutral';
      const statusClass = call.status === 'Answered' ? 'badge-success' : 'badge-warning';
      const isChecked = state.selectedCallIds.has(call.id);

      return `
        <tr class="clickable-row" data-call-id="${call.id}">
          <td onclick="event.stopPropagation()">
            <input type="checkbox" class="call-row-check" data-call-id="${call.id}" ${isChecked ? 'checked' : ''}>
          </td>
          <td class="font-mono">${call.datetime}</td>
          <td class="font-mono">${call.durationStr}</td>
          <td class="font-mono">${call.cost}</td>
          <td class="font-mono" title="Click to copy" onclick="event.stopPropagation(); window.copyPhone('${call.from}')" style="cursor:copy;">
            ${call.from}
          </td>
          <td class="font-mono">${call.to}</td>
          <td><strong>${call.contactName}</strong></td>
          <td>${call.agent}</td>
          <td><span class="badge-pill ${dirClass}">${call.direction}</span></td>
          <td><span class="badge-pill ${statusClass}">${call.status}</span></td>
          <td>${call.endReason}</td>
          <td><span class="badge-pill ${outcomeClass}">${call.outcome}</span></td>
          <td onclick="event.stopPropagation()">
            <button class="btn btn-ghost btn-sm" onclick="window.openCallDrawerById('${call.id}')" title="Inspect Call">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Row Click Handlers
    tbody.querySelectorAll('.clickable-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-call-id');
        openCallDrawer(id);
      });
    });

    // Checkbox Listeners
    tbody.querySelectorAll('.call-row-check').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = chk.getAttribute('data-call-id');
        if (chk.checked) {
          state.selectedCallIds.add(id);
        } else {
          state.selectedCallIds.delete(id);
        }
        updateBulkActionBar();
      });
    });

    updatePaginationControls(startIndex + 1, Math.min(startIndex + state.callsPerPage, total), total);
  }

  function updatePaginationControls(start, end, total) {
    const info = document.getElementById('callsPaginationInfo');
    const prevBtn = document.getElementById('btnPrevCalls');
    const nextBtn = document.getElementById('btnNextCalls');

    if (info) {
      if (total === 0) {
        info.textContent = 'Showing 0 calls';
      } else {
        info.textContent = `Showing ${start} to ${end} of ${total} calls`;
      }
    }

    if (prevBtn) {
      prevBtn.disabled = state.callsPage <= 1;
    }
    if (nextBtn) {
      nextBtn.disabled = end >= total;
    }
  }

  // --- BULK ACTION BAR LOGIC ---
  function initBulkActions() {
    const checkAll = document.getElementById('checkAllCalls');
    const bar = document.getElementById('bulkActionBar');
    const countText = document.getElementById('bulkCountText');
    const btnExport = document.getElementById('btnBulkExport');
    const btnReview = document.getElementById('btnBulkReview');
    const btnClear = document.getElementById('btnBulkClear');

    const prevBtn = document.getElementById('btnPrevCalls');
    const nextBtn = document.getElementById('btnNextCalls');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (state.callsPage > 1) {
          state.callsPage--;
          renderCallsTable();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.callsPage++;
        renderCallsTable();
      });
    }

    if (checkAll) {
      checkAll.addEventListener('change', () => {
        const visibleChecks = document.querySelectorAll('.call-row-check');
        visibleChecks.forEach(chk => {
          chk.checked = checkAll.checked;
          const id = chk.getAttribute('data-call-id');
          if (checkAll.checked) {
            state.selectedCallIds.add(id);
          } else {
            state.selectedCallIds.delete(id);
          }
        });
        updateBulkActionBar();
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        state.selectedCallIds.clear();
        if (checkAll) checkAll.checked = false;
        renderCallsTable();
        updateBulkActionBar();
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const selected = state.calls.filter(c => state.selectedCallIds.has(c.id));
        if (selected.length === 0) return;
        const headers = ['CallID', 'DateTime', 'Duration', 'Cost', 'From', 'To', 'Contact', 'Agent', 'Direction', 'Status', 'Outcome'];
        const rows = selected.map(c => [
          c.id, `"${c.datetime}"`, c.durationStr, c.cost, c.from, c.to, `"${c.contactName}"`, `"${c.agent}"`, c.direction, c.status, `"${c.outcome}"`
        ]);
        downloadCsv('selected_voice_agent_calls.csv', [headers, ...rows]);
        showToast(`Exported ${selected.length} calls to CSV.`);
      });
    }

    if (btnReview) {
      btnReview.addEventListener('click', () => {
        state.calls.forEach(c => {
          if (state.selectedCallIds.has(c.id)) {
            c.reviewStatus = 'Reviewed - Good';
          }
        });
        showToast(`Marked ${state.selectedCallIds.size} calls as Reviewed.`);
        state.selectedCallIds.clear();
        if (checkAll) checkAll.checked = false;
        renderCallsTable();
        renderFeedbackTable();
        updateBulkActionBar();
      });
    }
  }

  function updateBulkActionBar() {
    const bar = document.getElementById('bulkActionBar');
    const countText = document.getElementById('bulkCountText');
    const count = state.selectedCallIds.size;

    if (!bar) return;
    if (count > 0) {
      bar.classList.add('visible');
      if (countText) countText.textContent = `${count} call${count > 1 ? 's' : ''} selected`;
    } else {
      bar.classList.remove('visible');
    }
  }

  // --- CONTACTS TABLE ---
  function renderContactsTable(searchQuery = '') {
    const tbody = document.getElementById('contactsTableBody');
    if (!tbody) return;

    let items = state.contacts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.postcode.toLowerCase().includes(q));
    }

    tbody.innerHTML = items.map(c => `
      <tr>
        <td>
          <button class="btn btn-ghost btn-sm fav-toggle-btn" data-contact-id="${c.id}" style="color:${c.favourite ? '#f59e0b' : 'var(--text-muted)'}; font-size:16px;">
            ${c.favourite ? '★' : '☆'}
          </button>
        </td>
        <td><strong>${c.name}</strong></td>
        <td class="font-mono" title="Click to copy" onclick="window.copyPhone('${c.phone}')" style="cursor:copy;">
          ${c.phone}
        </td>
        <td>${c.email}</td>
        <td><span class="badge-pill badge-neutral font-mono">${c.postcode}</span></td>
        <td><span class="badge-pill badge-info font-bold">${c.callsCount} calls</span></td>
        <td class="font-mono">${c.lastCall}</td>
        <td style="max-width:240px; font-size:12px; color:var(--text-secondary); cursor:pointer;" onclick="window.editContactNote('${c.id}')" title="Click to edit notes">
          ${c.notes} ✏️
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.viewContactCalls('${c.phone}')">View Calls</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.fav-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.getAttribute('data-contact-id');
        const contact = state.contacts.find(c => c.id === cid);
        if (contact) {
          contact.favourite = !contact.favourite;
          renderContactsTable(searchQuery);
          renderFavourites();
          showToast(`${contact.name} ${contact.favourite ? 'added to' : 'removed from'} favourites.`);
        }
      });
    });
  }

  // --- USERS & INVITATIONS ---
  function renderUsersAndInvites() {
    const invitesTbody = document.getElementById('invitationsTableBody');
    if (invitesTbody) {
      invitesTbody.innerHTML = state.invitations.map(inv => `
        <tr>
          <td><strong>${inv.email}</strong></td>
          <td>${inv.name}</td>
          <td>${inv.agent}</td>
          <td><span class="badge-pill badge-neutral">${inv.role}</span></td>
          <td>${inv.company}</td>
          <td class="font-mono">${inv.sent}</td>
          <td class="font-mono">${inv.expires}</td>
          <td><span class="badge-pill badge-warning">${inv.status}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.resendInvite('${inv.email}')">Resend</button>
          </td>
        </tr>
      `).join('');
    }

    const usersTbody = document.getElementById('usersTableBody');
    if (usersTbody) {
      usersTbody.innerHTML = state.users.map(u => `
        <tr>
          <td><input type="checkbox"></td>
          <td><strong>${u.name}</strong></td>
          <td>${u.email}</td>
          <td>${u.agent}</td>
          <td><span class="badge-pill badge-info">${u.role}</span></td>
          <td>${u.company}</td>
          <td><span class="badge-pill badge-neutral">${u.access}</span></td>
          <td class="font-mono">${u.costPerMin}</td>
          <td class="font-mono">${u.joined}</td>
        </tr>
      `).join('');
    }

    const uBadge = document.getElementById('userCountBadge');
    if (uBadge) uBadge.textContent = state.users.length;
    const iBadge = document.getElementById('inviteCountBadge');
    if (iBadge) iBadge.textContent = state.invitations.length;
  }

  // --- KNOWLEDGE BASE ---
  function renderKnowledgeBases() {
    const container = document.getElementById('kbGridContainer');
    if (!container) return;

    container.innerHTML = state.knowledgeBases.map(kb => `
      <div class="kb-card">
        <div>
          <div class="kb-card-header">
            <h4 class="kb-title">${kb.name}</h4>
            <span class="badge-pill badge-success">${kb.status}</span>
          </div>
          <p style="font-size:12.5px; color:var(--text-secondary); margin-bottom:12px;">${kb.desc}</p>
          <div class="kb-meta">
            <span><strong>${kb.docsCount}</strong> documents</span>
            <span>&bull;</span>
            <span class="font-mono">${kb.size}</span>
            <span>&bull;</span>
            <span>Updated ${kb.updated}</span>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--border-color); padding-top:14px; margin-top:12px;">
          <button class="btn btn-secondary btn-sm" onclick="window.openDocExplorer('${kb.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Manage Documents (${kb.docsCount})
          </button>
        </div>
      </div>
    `).join('');
  }

  // --- KNOWLEDGE BASE SEMANTIC TESTER ---
  function initSemanticKbTester() {
    const btn = document.getElementById('btnTestKbQuery');
    const input = document.getElementById('kbQueryInput');
    const box = document.getElementById('kbTestResultBox');

    if (btn && input && box) {
      btn.addEventListener('click', () => {
        const q = input.value.trim();
        if (!q) {
          input.focus();
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Searching vectors...';

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> <span>Test Retrieval</span>`;

          box.style.display = 'block';
          box.innerHTML = `
            <div class="retrieval-header">
              <span class="retrieval-score">96.4% Semantic Match Score</span>
              <span class="retrieval-source font-mono">Source: Essex Heating Triage & Service Postcodes.pdf (Chunk #4)</span>
            </div>
            <div class="retrieval-chunk">
              "We provide boiler breakdown, diagnostic, and servicing across all CM (Chelmsford) and SS (Southend) postcodes. Standard diagnostics are charged at £85 + VAT. Emergency callouts have guaranteed 2-hour arrival windows between 8am and 8pm Monday to Saturday."
            </div>
            <div style="font-size:11.5px; color:#10b981; margin-top:8px; font-weight:600;">
              &check; Validated: Voice AI will use this exact verified text to formulate spoken answers.
            </div>
          `;
        }, 450);
      });
    }
  }

  // --- INVOICES & BILLING ---
  function renderInvoicesTable() {
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;

    tbody.innerHTML = state.invoices.map(inv => `
      <tr>
        <td class="font-mono"><strong>${inv.id}</strong></td>
        <td class="font-mono">${inv.date}</td>
        <td>${inv.desc}</td>
        <td class="font-mono font-bold">${inv.amount}</td>
        <td class="font-mono">${inv.tax}</td>
        <td><span class="badge-pill badge-success">${inv.status}</span></td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="window.downloadInvoice('${inv.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Receipt
          </button>
        </td>
      </tr>
    `).join('');
  }

  // --- AUDIT LOGS ---
  function renderAuditLogsTable(actionFilter = 'all') {
    const tbody = document.getElementById('auditLogsTableBody');
    if (!tbody) return;

    let items = state.auditLogs;
    if (actionFilter !== 'all') {
      items = items.filter(a => a.action === actionFilter);
    }

    tbody.innerHTML = items.map(log => `
      <tr>
        <td class="font-mono">${log.datetime}</td>
        <td><strong>${log.user}</strong></td>
        <td><span class="badge-pill badge-info font-bold">${log.action}</span></td>
        <td><span class="badge-pill badge-neutral">${log.entity}</span></td>
        <td class="font-mono">${log.entityName}</td>
        <td style="font-size:12px; color:var(--text-secondary);">${log.details}</td>
      </tr>
    `).join('');
  }

  // --- FAVOURITES ---
  function renderFavourites() {
    const favCallsTbody = document.getElementById('favCallsTableBody');
    const favContactsTbody = document.getElementById('favContactsTableBody');
    const favBadge = document.getElementById('sidebarFavCount');

    const starredCalls = state.calls.filter(c => c.favourite);
    const starredContacts = state.contacts.filter(c => c.favourite);

    if (favBadge) {
      favBadge.textContent = starredCalls.length + starredContacts.length;
    }

    if (favCallsTbody) {
      favCallsTbody.innerHTML = starredCalls.map(c => `
        <tr>
          <td class="font-mono">${c.datetime}</td>
          <td><strong>${c.contactName}</strong> (${c.from})</td>
          <td>${c.agent}</td>
          <td class="font-mono">${c.durationStr}</td>
          <td><span class="badge-pill badge-info">${c.outcome}</span></td>
          <td style="font-size:12px; max-width:200px;">${c.summary.substring(0, 70)}...</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.openCallDrawerById('${c.id}')">Inspect</button>
          </td>
        </tr>
      `).join('');
    }

    if (favContactsTbody) {
      favContactsTbody.innerHTML = starredContacts.map(c => `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td class="font-mono">${c.phone}</td>
          <td class="font-mono">${c.postcode}</td>
          <td><span class="badge-pill badge-info">${c.callsCount} calls</span></td>
          <td class="font-mono">${c.lastCall}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.viewContactCalls('${c.phone}')">View Calls</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // --- FEEDBACK & QA TABLE ---
  function renderFeedbackTable() {
    const tbody = document.getElementById('feedbackTableBody');
    if (!tbody) return;

    const reviewedCalls = state.calls.filter(c => c.reviewStatus && c.reviewStatus !== 'Not Reviewed');
    
    tbody.innerHTML = reviewedCalls.map(c => `
      <tr>
        <td class="font-mono">${c.datetime}</td>
        <td class="font-mono"><strong>${c.id}</strong></td>
        <td>Daniyal Haider</td>
        <td><span class="badge-pill badge-success">${c.reviewStatus}</span></td>
        <td style="font-size:12.5px; max-width:280px;">${c.feedbackComment || 'No feedback logged.'}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.openCallDrawerById('${c.id}')">Open Call</button>
        </td>
      </tr>
    `).join('');
  }

  // --- CALL REVIEW DRAWER & AUDIO ENGINE ---
  function initCallDrawer() {
    const overlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('callDrawer');
    const closeBtn = document.getElementById('btnCloseDrawer');
    const playBtn = document.getElementById('drawerPlayBtn');
    const scrubber = document.getElementById('audioScrubber');
    const speedBtn = document.getElementById('audioSpeedBtn');
    const btnSaveQa = document.getElementById('btnSaveCallQa');
    const btnToggleStar = document.getElementById('btnToggleStarCall');
    const btnSyncGhl = document.getElementById('btnSyncGhlCall');

    if (closeBtn) closeBtn.addEventListener('click', closeCallDrawer);
    if (overlay) overlay.addEventListener('click', closeCallDrawer);

    if (playBtn) playBtn.addEventListener('click', toggleAudioPlayback);

    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        state.audioProgress = parseInt(e.target.value, 10);
        updateAudioTimeUI();
        drawWaveformCanvas();
      });
    }

    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        if (state.audioSpeed === 1.0) state.audioSpeed = 1.25;
        else if (state.audioSpeed === 1.25) state.audioSpeed = 1.5;
        else state.audioSpeed = 1.0;
        speedBtn.textContent = `${state.audioSpeed}x`;
      });
    }

    if (btnSaveQa) {
      btnSaveQa.addEventListener('click', () => {
        if (!state.currentCall) return;
        const status = document.getElementById('qaStatusSelect').value;
        const comment = document.getElementById('qaCommentInput').value;

        state.currentCall.reviewStatus = status;
        state.currentCall.feedbackComment = comment;

        state.auditLogs.unshift({
          datetime: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          user: 'Daniyal Haider',
          action: 'Call Review Saved',
          entity: 'Call',
          entityName: state.currentCall.id,
          details: `Status: ${status}; Feedback: ${comment.substring(0, 45)}`
        });

        renderFeedbackTable();
        renderAuditLogsTable();
        showToast('Call review & continuous improvement feedback saved.');
      });
    }

    if (btnSyncGhl) {
      btnSyncGhl.addEventListener('click', () => {
        btnSyncGhl.innerHTML = `<span>Syncing...</span>`;
        setTimeout(() => {
          btnSyncGhl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> <span>Synced to GHL</span>`;
          showToast('Call analysis and CRM fields synced to GoHighLevel location.');
        }, 400);
      });
    }

    if (btnToggleStar) {
      btnToggleStar.addEventListener('click', () => {
        if (!state.currentCall) return;
        state.currentCall.favourite = !state.currentCall.favourite;
        document.getElementById('starCallIcon').textContent = state.currentCall.favourite ? '★' : '☆';
        renderFavourites();
        renderCallsTable();
        showToast(state.currentCall.favourite ? 'Call added to favourites.' : 'Call removed from favourites.');
      });
    }
  }

  function openCallDrawer(callId) {
    const call = state.calls.find(c => c.id === callId);
    if (!call) return;
    state.currentCall = call;

    const overlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('callDrawer');

    document.getElementById('drawerCallTitle').textContent = `Call Review &bull; ${call.contactName}`;
    document.getElementById('drawerCallTime').textContent = call.datetime;
    document.getElementById('drawerCallBadge').textContent = `${call.direction} &bull; ${call.status}`;
    document.getElementById('drawerMetaAgent').textContent = call.agent;
    document.getElementById('drawerMetaPhone').textContent = call.from;
    document.getElementById('drawerMetaDuration').textContent = call.durationStr;
    document.getElementById('drawerMetaCost').textContent = call.cost;

    document.getElementById('anaCallStatus').textContent = call.presetAnalysis.callStatus;
    const successBadge = document.getElementById('anaCallSuccess');
    successBadge.textContent = call.presetAnalysis.callSuccess;
    successBadge.className = `analysis-badge ${call.presetAnalysis.callSuccess === 'Success' ? 'badge-success' : 'badge-danger'}`;

    const sentBadge = document.getElementById('anaUserSentiment');
    sentBadge.textContent = call.presetAnalysis.sentiment;
    sentBadge.className = `analysis-badge ${call.presetAnalysis.sentiment === 'Positive' ? 'badge-success' : (call.presetAnalysis.sentiment === 'Negative' ? 'badge-danger' : 'badge-warning')}`;

    document.getElementById('anaDisconnectReason').textContent = call.presetAnalysis.disconnectionReason;
    document.getElementById('anaLatency').textContent = call.presetAnalysis.latency;

    // Custom Analysis Fields with "Not Established" states
    const customContainer = document.getElementById('customAnalysisFields');
    const custom = call.customAnalysis;
    const fieldDefinitions = [
      { key: 'Caller Name', val: custom.callerName },
      { key: 'Email', val: custom.email },
      { key: 'Postcode', val: custom.postcode },
      { key: 'Property Address', val: custom.propertyAddress },
      { key: 'Service/Job Type', val: custom.jobType },
      { key: 'Boiler Type', val: custom.boilerType },
      { key: 'Issue Reported', val: custom.issueReported },
      { key: 'Emergency Status', val: custom.emergency },
      { key: 'Fuel Type', val: custom.fuelType },
      { key: 'Timeframe', val: custom.timeframe },
      { key: 'Caller Type', val: custom.callerType },
      { key: 'Call Outcome', val: custom.callOutcome },
      { key: 'Quote-Form Status', val: custom.quoteFormStatus }
    ];

    customContainer.innerHTML = fieldDefinitions.map(f => {
      const isNotEst = f.val === 'Not Established' || f.val === 'N/A';
      return `
        <div class="custom-field-row">
          <span class="custom-field-key">${f.key}</span>
          <span class="custom-field-val ${isNotEst ? 'not-established' : ''}">${f.val}</span>
        </div>
      `;
    }).join('');

    document.getElementById('drawerCallSummary').textContent = call.summary;

    const transcriptFlow = document.getElementById('drawerTranscriptFlow');
    transcriptFlow.innerHTML = call.transcript.map(turn => {
      const isAgent = turn.speaker === 'Agent';
      return `
        <div class="turn-bubble ${isAgent ? 'turn-agent' : 'turn-user'}" onclick="window.seekAudioTo(${turn.time})">
          <div class="turn-speaker">${turn.speaker} <span style="font-weight:400; color:var(--text-muted); font-size:10px;">${formatSeconds(turn.time)}</span></div>
          <div class="turn-text">${turn.text}</div>
        </div>
      `;
    }).join('');

    document.getElementById('qaStatusSelect').value = call.reviewStatus || 'Not Reviewed';
    document.getElementById('qaCommentInput').value = call.feedbackComment || '';
    document.getElementById('starCallIcon').textContent = call.favourite ? '★' : '☆';

    state.audioProgress = 0;
    state.audioDuration = call.durationSec;
    stopAudioPlayback();
    updateAudioTimeUI();
    drawWaveformCanvas();

    overlay.classList.add('active');
    drawer.classList.add('open');
  }

  function closeCallDrawer() {
    document.getElementById('drawerOverlay')?.classList.remove('active');
    document.getElementById('callDrawer')?.classList.remove('open');
    stopAudioPlayback();
  }

  function toggleAudioPlayback() {
    if (state.currentAudioPlaying) {
      stopAudioPlayback();
    } else {
      startAudioPlayback();
    }
  }

  function startAudioPlayback() {
    state.currentAudioPlaying = true;
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
      playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    }

    state.audioTimer = setInterval(() => {
      if (state.audioProgress < state.audioDuration) {
        state.audioProgress += 1;
        updateAudioTimeUI();
        drawWaveformCanvas();
      } else {
        stopAudioPlayback();
        state.audioProgress = 0;
        updateAudioTimeUI();
        drawWaveformCanvas();
      }
    }, 1000 / state.audioSpeed);
  }

  function stopAudioPlayback() {
    state.currentAudioPlaying = false;
    if (state.audioTimer) {
      clearInterval(state.audioTimer);
      state.audioTimer = null;
    }
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
      playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    }
  }

  function updateAudioTimeUI() {
    const scrubber = document.getElementById('audioScrubber');
    const timeReadout = document.getElementById('audioTimeReadout');
    if (scrubber) {
      scrubber.max = state.audioDuration;
      scrubber.value = state.audioProgress;
    }
    if (timeReadout) {
      timeReadout.textContent = `${formatSeconds(state.audioProgress)} / ${formatSeconds(state.audioDuration)}`;
    }
  }

  function drawWaveformCanvas() {
    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const bars = 50;
    const barWidth = 3;
    const gap = (w - bars * barWidth) / (bars - 1);
    const progressPct = state.audioDuration > 0 ? (state.audioProgress / state.audioDuration) : 0;

    for (let i = 0; i < bars; i++) {
      const seed = Math.sin(i * 0.35) * Math.cos(i * 0.15);
      const barHeight = Math.max(6, Math.abs(seed) * (h - 8) + 6);
      const x = i * (barWidth + gap);
      const y = (h - barHeight) / 2;

      if (i / bars <= progressPct) {
        ctx.fillStyle = '#0ea5e9';
      } else {
        ctx.fillStyle = '#334155';
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  }

  function formatSeconds(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // --- LIVE VOICE AGENT PLAYGROUND SIMULATION ---
  function initVoicePlayground() {
    const modal = document.getElementById('voicePlaygroundModal');
    const btnOpen1 = document.getElementById('btnHeaderTestAgent');
    const btnOpen2 = document.getElementById('btnSidebarTestAgent');
    const btnClose = document.getElementById('btnClosePlaygroundModal');
    const btnStart = document.getElementById('btnStartPlaygroundCall');
    const btnEnd = document.getElementById('btnEndPlaygroundCall');
    const chatStream = document.getElementById('playgroundChatStream');
    const orbCore = document.querySelector('.orb-core');
    const statusText = document.getElementById('playgroundStatusText');

    function openPlayground() {
      modal.classList.add('open');
      resetPlayground();
    }

    if (btnOpen1) btnOpen1.addEventListener('click', openPlayground);
    if (btnOpen2) btnOpen2.addEventListener('click', openPlayground);
    if (btnClose) btnClose.addEventListener('click', () => {
      endPlaygroundCall();
      modal.classList.remove('open');
    });

    const playgroundScript = [
      {
        type: 'agent',
        text: "Good morning! Thanks for calling Essex Heating Experts. My name is Olivia, how can I help you today?",
        delay: 800
      },
      {
        type: 'user',
        text: "Hi Olivia, my combi boiler is making loud banging noises and losing pressure constantly.",
        delay: 2200
      },
      {
        type: 'tool',
        text: "⚡ Voice Custom Function: check_knowledge_base('banging boiler noise') &rarr; Matched: Kettling / Lime scale diagnostic tree.",
        delay: 1200
      },
      {
        type: 'agent',
        text: "I completely understand. That typically indicates air or deposit buildup in the heat exchanger. May I take your full name and postcode to check our nearest engineer?",
        delay: 2000
      },
      {
        type: 'user',
        text: "Yes, it's David Miller, and my postcode is CM1 2AB in Chelmsford.",
        delay: 2200
      },
      {
        type: 'tool',
        text: "⚡ n8n GHL Calendar Tool: check_availability(service='Boiler Diagnostics', postcode='CM1 2AB') &rarr; Found 3 engineer slots.",
        delay: 1400
      },
      {
        type: 'agent',
        text: "Thank you David! We have an engineer in Chelmsford this Friday morning at 10:00 AM. Would you like me to book that in for you?",
        delay: 2000
      },
      {
        type: 'user',
        text: "That is perfect! Please book it in.",
        delay: 1800
      },
      {
        type: 'tool',
        text: "⚡ n8n GHL Appointment Tool: book(calendar='Boiler Repairs', contact_id='ghl_cnt_david') &rarr; Confirmed Slot #9812.",
        delay: 1200
      },
      {
        type: 'agent',
        text: "All booked for Friday at 10:00 AM! I've sent an SMS confirmation to your number. Is there anything else I can help with today?",
        delay: 1800
      }
    ];

    function startPlaygroundCall() {
      state.playgroundActive = true;
      state.playgroundTurnIndex = 0;
      btnStart.style.display = 'none';
      btnEnd.style.display = 'inline-flex';
      statusText.textContent = "Call connected &bull; Real-time voice stream active";
      chatStream.innerHTML = '';

      runPlaygroundStep();
    }

    function runPlaygroundStep() {
      if (!state.playgroundActive || state.playgroundTurnIndex >= playgroundScript.length) {
        if (state.playgroundActive) {
          statusText.textContent = "Call concluded &bull; Post-call analysis dispatched to GHL CRM";
          orbCore.classList.remove('speaking');
        }
        return;
      }

      const turn = playgroundScript[state.playgroundTurnIndex];
      state.playgroundTimer = setTimeout(() => {
        if (!state.playgroundActive) return;

        if (turn.type === 'agent') {
          orbCore.classList.add('speaking');
          const bubble = document.createElement('div');
          bubble.className = 'stream-bubble agent';
          bubble.innerHTML = `<strong>Olivia (Agent):</strong> ${turn.text}`;
          chatStream.appendChild(bubble);
          chatStream.scrollTop = chatStream.scrollHeight;

          if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(turn.text);
            utter.rate = 1.05;
            window.speechSynthesis.speak(utter);
          }
        } else if (turn.type === 'user') {
          orbCore.classList.remove('speaking');
          const bubble = document.createElement('div');
          bubble.className = 'stream-bubble user';
          bubble.innerHTML = `<strong>You (Caller):</strong> ${turn.text}`;
          chatStream.appendChild(bubble);
          chatStream.scrollTop = chatStream.scrollHeight;
        } else if (turn.type === 'tool') {
          orbCore.classList.remove('speaking');
          const chip = document.createElement('div');
          chip.className = 'stream-tool-call';
          chip.innerHTML = turn.text;
          chatStream.appendChild(chip);
          chatStream.scrollTop = chatStream.scrollHeight;
        }

        state.playgroundTurnIndex++;
        runPlaygroundStep();
      }, turn.delay);
    }

    function endPlaygroundCall() {
      state.playgroundActive = false;
      if (state.playgroundTimer) {
        clearTimeout(state.playgroundTimer);
        state.playgroundTimer = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      orbCore.classList.remove('speaking');
      btnStart.style.display = 'inline-flex';
      btnEnd.style.display = 'none';
      statusText.textContent = "Call ended &bull; Ready for next test";

      if (state.playgroundTurnIndex >= 3) {
        const newCall = {
          id: `call_test_${Date.now()}`,
          datetime: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          durationSec: 65,
          durationStr: '1m 05s',
          cost: '£0.5416',
          from: '+447911928374',
          to: '+447414112588',
          contactName: 'David Miller (Playground Test)',
          agent: 'Essex Heating Inbound',
          direction: 'Inbound',
          status: 'Answered',
          endReason: 'Agent Hung Up',
          outcome: 'Booking Confirmed',
          favourite: false,
          presetAnalysis: {
            callStatus: 'Agent Hung Up',
            callSuccess: 'Success',
            sentiment: 'Positive',
            disconnectionReason: 'Completed Normally',
            latency: '712.00ms'
          },
          customAnalysis: {
            callerName: 'David Miller',
            email: 'david.miller@gmail.com',
            postcode: 'CM1 2AB',
            propertyAddress: 'Chelmsford',
            jobType: 'Boiler Diagnostics',
            boilerType: 'Combi Boiler',
            issueReported: 'Loud banging noise & loss of pressure',
            emergency: 'No',
            fuelType: 'Natural Gas',
            timeframe: 'Friday 10:00 AM',
            callerType: 'Domestic Customer',
            callOutcome: 'Booked Engineer Slot',
            quoteFormStatus: 'Confirmed & Dispatched'
          },
          summary: 'Live playground test: Customer David Miller called regarding a banging boiler issue. Voice agent Olivia qualified the issue and booked an engineer appointment for Friday 10:00 AM via live n8n tool execution.',
          transcript: [
            { speaker: 'Agent', text: 'Good morning! Thanks for calling Essex Heating Experts. My name is Olivia, how can I help you today?', time: 0 },
            { speaker: 'User', text: 'Hi Olivia, my combi boiler is making loud banging noises and losing pressure constantly.', time: 6 },
            { speaker: 'Agent', text: 'May I take your full name and postcode to check our nearest engineer?', time: 14 },
            { speaker: 'User', text: "Yes, it's David Miller, and my postcode is CM1 2AB in Chelmsford.", time: 20 },
            { speaker: 'Agent', text: 'We have an engineer in Chelmsford this Friday at 10:00 AM. Would you like me to book that in for you?', time: 28 },
            { speaker: 'User', text: 'That is perfect! Please book it in.', time: 35 }
          ],
          reviewStatus: 'Not Reviewed',
          feedbackComment: ''
        };

        state.calls.unshift(newCall);
        renderCallsTable();
        const callCountBadge = document.getElementById('sidebarCallCount');
        if (callCountBadge) callCountBadge.textContent = state.calls.length;
        const totalCallsVal = document.getElementById('valTotalCalls');
        if (totalCallsVal) totalCallsVal.textContent = state.calls.length;

        showToast('Playground call completed! Added to call history with analysis.');
      }
    }

    function resetPlayground() {
      if (state.playgroundTimer) clearTimeout(state.playgroundTimer);
      state.playgroundActive = false;
      state.playgroundTurnIndex = 0;
      btnStart.style.display = 'inline-flex';
      btnEnd.style.display = 'none';
      orbCore.classList.remove('speaking');
      chatStream.innerHTML = `<div class="stream-placeholder">The live conversation turns, dynamic prompt injection, and n8n tool calls will stream here during the call...</div>`;
      statusText.textContent = "Agent ready &bull; Click 'Start Test Call' to simulate live conversation";
    }

    if (btnStart) btnStart.addEventListener('click', startPlaygroundCall);
    if (btnEnd) btnEnd.addEventListener('click', endPlaygroundCall);
  }

  // --- MODALS & FORMS ---
  function initModals() {
    // KB Modal
    const btnOpenKb = document.getElementById('btnOpenCreateKbModal');
    const modalKb = document.getElementById('createKbModal');
    const btnCloseKb = document.getElementById('btnCloseKbModal');
    const btnCancelKb = document.getElementById('btnCancelKb');
    const formKb = document.getElementById('createKbForm');
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('kbFileInput');
    const selectedFilesList = document.getElementById('selectedFilesList');

    if (btnOpenKb) btnOpenKb.addEventListener('click', () => modalKb.classList.add('open'));
    if (btnCloseKb) btnCloseKb.addEventListener('click', () => modalKb.classList.remove('open'));
    if (btnCancelKb) btnCancelKb.addEventListener('click', () => modalKb.classList.remove('open'));

    if (fileDropZone && fileInput) {
      fileDropZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          const names = Array.from(fileInput.files).map(f => f.name).join(', ');
          selectedFilesList.textContent = `Selected: ${names} (${fileInput.files.length} files)`;
        }
      });
    }

    if (formKb) {
      formKb.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('kbNameInput').value;
        if (!name) return;

        state.knowledgeBases.unshift({
          id: `kb_${Date.now()}`,
          name: name,
          docsCount: fileInput.files.length || 1,
          status: 'Indexing',
          size: '1.2 MB',
          updated: 'Just now',
          desc: 'Client uploaded trade documentation for semantic retrieval.',
          files: [
            { name: fileInput.files[0]?.name || 'Uploaded_Document.pdf', size: '1.2 MB', chunks: 24, status: 'Indexed' }
          ]
        });

        state.auditLogs.unshift({
          datetime: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          user: 'Daniyal Haider',
          action: 'Knowledge Base Created',
          entity: 'Knowledge Base',
          entityName: name,
          details: `Vector indexing initiated for ${fileInput.files.length || 1} file(s).`
        });

        renderKnowledgeBases();
        renderAuditLogsTable();
        modalKb.classList.remove('open');
        formKb.reset();
        selectedFilesList.textContent = '';
        showToast(`Knowledge base "${name}" created and sent for vector indexing.`);
      });
    }

    // Document Explorer Modal
    const docModal = document.getElementById('docExplorerModal');
    const btnCloseDocModal = document.getElementById('btnCloseDocExplorerModal');
    const btnCloseDoc = document.getElementById('btnCloseDocExplorer');
    if (btnCloseDocModal) btnCloseDocModal.addEventListener('click', () => docModal.classList.remove('open'));
    if (btnCloseDoc) btnCloseDoc.addEventListener('click', () => docModal.classList.remove('open'));

    // Auto Refill Modal
    const autoModal = document.getElementById('autoRefillModal');
    const btnOpenAuto = document.getElementById('btnConfigureAutoRefill');
    const btnCloseAuto = document.getElementById('btnCloseAutoRefillModal');
    const btnCancelAuto = document.getElementById('btnCancelAutoRefill');
    const formAuto = document.getElementById('autoRefillForm');

    if (btnOpenAuto) btnOpenAuto.addEventListener('click', () => autoModal.classList.add('open'));
    if (btnCloseAuto) btnCloseAuto.addEventListener('click', () => autoModal.classList.remove('open'));
    if (btnCancelAuto) btnCancelAuto.addEventListener('click', () => autoModal.classList.remove('open'));

    if (formAuto) {
      formAuto.addEventListener('submit', (e) => {
        e.preventDefault();
        state.refillThreshold = parseFloat(document.getElementById('refillThreshold').value);
        state.refillAmount = parseFloat(document.getElementById('refillAmount').value);
        autoModal.classList.remove('open');
        showToast(`Auto-refill updated: Top-up £${state.refillAmount} when balance falls below £${state.refillThreshold}.`);
      });
    }

    // Contact Note Modal
    const noteModal = document.getElementById('contactNoteModal');
    const btnCloseNote = document.getElementById('btnCloseContactNoteModal');
    const btnCancelNote = document.getElementById('btnCancelContactNote');
    const formNote = document.getElementById('contactNoteForm');

    if (btnCloseNote) btnCloseNote.addEventListener('click', () => noteModal.classList.remove('open'));
    if (btnCancelNote) btnCancelNote.addEventListener('click', () => noteModal.classList.remove('open'));

    if (formNote) {
      formNote.addEventListener('submit', (e) => {
        e.preventDefault();
        const cid = document.getElementById('contactNoteId').value;
        const text = document.getElementById('contactNoteText').value;
        const contact = state.contacts.find(c => c.id === cid);
        if (contact) {
          contact.notes = text;
          renderContactsTable();
          showToast(`Note updated for ${contact.name}.`);
        }
        noteModal.classList.remove('open');
      });
    }

    // Invite User Modal
    const btnOpenInvite = document.getElementById('btnOpenInviteModal');
    const modalInvite = document.getElementById('inviteUserModal');
    const btnCloseInvite = document.getElementById('btnCloseInviteModal');
    const btnCancelInvite = document.getElementById('btnCancelInvite');
    const formInvite = document.getElementById('inviteUserForm');

    if (btnOpenInvite) btnOpenInvite.addEventListener('click', () => modalInvite.classList.add('open'));
    if (btnCloseInvite) btnCloseInvite.addEventListener('click', () => modalInvite.classList.remove('open'));
    if (btnCancelInvite) btnCancelInvite.addEventListener('click', () => modalInvite.classList.remove('open'));

    if (formInvite) {
      formInvite.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('inviteEmail').value;
        const name = document.getElementById('inviteName').value;
        const agent = document.getElementById('inviteAgent').value;
        const role = document.getElementById('inviteRole').value;

        state.invitations.unshift({
          email,
          name,
          agent,
          role,
          company: 'Essex Heating Experts',
          sent: 'Today',
          expires: 'In 7 days',
          status: 'Pending'
        });

        state.auditLogs.unshift({
          datetime: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          user: 'Daniyal Haider',
          action: 'User Invited',
          entity: 'User',
          entityName: email,
          details: `Invited as ${role} for ${agent}`
        });

        renderUsersAndInvites();
        renderAuditLogsTable();
        modalInvite.classList.remove('open');
        formInvite.reset();
        showToast(`Invitation sent to ${email}.`);
      });
    }

    // Credits Modal
    const btnOpenCredits = document.getElementById('btnOpenCreditsModal');
    const modalCredits = document.getElementById('addCreditsModal');
    const btnCloseCredits = document.getElementById('btnCloseCreditsModal');
    const btnCancelCredits = document.getElementById('btnCancelCredits');
    const btnConfirmBuy = document.getElementById('btnConfirmBuyCredits');
    const creditPkgCards = document.querySelectorAll('.credit-pkg-card');

    if (btnOpenCredits) btnOpenCredits.addEventListener('click', () => modalCredits.classList.add('open'));
    if (btnCloseCredits) btnCloseCredits.addEventListener('click', () => modalCredits.classList.remove('open'));
    if (btnCancelCredits) btnCancelCredits.addEventListener('click', () => modalCredits.classList.remove('open'));

    creditPkgCards.forEach(card => {
      card.addEventListener('click', () => {
        creditPkgCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    if (btnConfirmBuy) {
      btnConfirmBuy.addEventListener('click', () => {
        const selectedCard = document.querySelector('.credit-pkg-card.selected');
        const amount = selectedCard ? selectedCard.getAttribute('data-amount') : '100';

        state.creditBalance += parseFloat(amount);
        const balEls = document.querySelectorAll('.metric-value.font-mono');
        balEls.forEach(el => {
          if (el.textContent.startsWith('£142') || el.textContent.startsWith('£')) {
            el.textContent = `£${state.creditBalance.toFixed(2)}`;
          }
        });

        state.invoices.unshift({
          id: `INV-2026-${Math.floor(Math.random() * 800 + 100)}`,
          date: 'Sep 16, 2026',
          desc: `Credit Purchase (£${amount}.00 Top-Up)`,
          amount: `£${amount}.00`,
          tax: `£${(amount * 0.2).toFixed(2)}`,
          status: 'Paid'
        });

        state.auditLogs.unshift({
          datetime: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          user: 'Daniyal Haider',
          action: 'Credits Added',
          entity: 'Billing',
          entityName: `£${amount}.00`,
          details: 'Purchased via stored Mastercard ending 4242'
        });

        renderInvoicesTable();
        renderAuditLogsTable();
        modalCredits.classList.remove('open');
        showToast(`Successfully added £${amount}.00 to balance! New balance: £${state.creditBalance.toFixed(2)}`);
      });
    }

    // Password form
    const formPassword = document.getElementById('changePasswordForm');
    if (formPassword) {
      formPassword.addEventListener('submit', (e) => {
        e.preventDefault();
        const p1 = document.getElementById('newPassword').value;
        const p2 = document.getElementById('confirmPassword').value;
        if (p1 !== p2) {
          showToast('Passwords do not match. Please verify.', true);
          return;
        }
        formPassword.reset();
        showToast('Password successfully updated.');
      });
    }

    // Preferences form
    const formPreferences = document.getElementById('preferencesForm');
    if (formPreferences) {
      formPreferences.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Account preferences saved.');
      });
    }

    // Favourites tabs switch
    const favTabs = document.querySelectorAll('#favTabs .tab-btn');
    favTabs.forEach(t => {
      t.addEventListener('click', () => {
        favTabs.forEach(b => b.classList.remove('active'));
        t.classList.add('active');
        const target = t.getAttribute('data-tab');
        document.getElementById('fav-calls-content').classList.toggle('active', target === 'fav-calls');
        document.getElementById('fav-contacts-content').classList.toggle('active', target === 'fav-contacts');
      });
    });

    // Settings tabs switch
    const settingsTabs = document.querySelectorAll('#settingsTabs .tab-btn');
    settingsTabs.forEach(t => {
      t.addEventListener('click', () => {
        settingsTabs.forEach(b => b.classList.remove('active'));
        t.classList.add('active');
        const target = t.getAttribute('data-tab');
        document.getElementById('tab-password').classList.toggle('active', target === 'tab-password');
        document.getElementById('tab-preferences').classList.toggle('active', target === 'tab-preferences');
      });
    });
  }

  // --- FILTERS & EXPORT ENGINE ---
  function initFilters() {
    const phoneInput = document.getElementById('filterPhoneInput');
    const agentSelect = document.getElementById('filterAgent');
    const dirSelect = document.getElementById('filterDirection');
    const statusSelect = document.getElementById('filterStatus');
    const outcomeSelect = document.getElementById('filterOutcome');
    const clearBtn = document.getElementById('btnClearFilters');

    function applyFilters() {
      const p = phoneInput.value.toLowerCase().trim();
      const a = agentSelect.value;
      const d = dirSelect.value;
      const s = statusSelect.value;
      const o = outcomeSelect.value;

      renderCallsTable(call => {
        if (p && !call.from.includes(p) && !call.contactName.toLowerCase().includes(p) && !call.summary.toLowerCase().includes(p)) return false;
        if (a !== 'all' && call.agent !== a) return false;
        if (d !== 'all' && call.direction !== d) return false;
        if (s !== 'all' && call.status !== s) return false;
        if (o !== 'all' && !call.outcome.includes(o.split(' ')[0])) return false;
        return true;
      });
    }

    if (phoneInput) phoneInput.addEventListener('input', applyFilters);
    if (agentSelect) agentSelect.addEventListener('change', applyFilters);
    if (dirSelect) dirSelect.addEventListener('change', applyFilters);
    if (statusSelect) statusSelect.addEventListener('change', applyFilters);
    if (outcomeSelect) outcomeSelect.addEventListener('change', applyFilters);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (phoneInput) phoneInput.value = '';
        if (agentSelect) agentSelect.value = 'all';
        if (dirSelect) dirSelect.value = 'all';
        if (statusSelect) statusSelect.value = 'all';
        if (outcomeSelect) outcomeSelect.value = 'all';
        state.activeFilterPredicate = null;
        renderCallsTable();
      });
    }

    const searchContacts = document.getElementById('searchContactsInput');
    if (searchContacts) {
      searchContacts.addEventListener('input', (e) => {
        renderContactsTable(e.target.value);
      });
    }

    const btnSavePreset = document.getElementById('btnSavePreset');
    if (btnSavePreset) {
      btnSavePreset.addEventListener('click', () => {
        state.auditLogs.unshift({
          datetime: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          user: 'Daniyal Haider',
          action: 'Filter Preset Saved',
          entity: 'Filter Configuration',
          entityName: 'Custom Call Filter',
          details: 'Saved current search parameters for recurring executive review.'
        });
        renderAuditLogsTable();
        showToast('Filter preset saved to your profile.');
      });
    }

    const btnSyncCalls = document.getElementById('btnSyncCalls');
    const syncSpin = document.getElementById('syncSpinIcon');
    if (btnSyncCalls) {
      btnSyncCalls.addEventListener('click', () => {
        if (syncSpin) syncSpin.classList.add('spin-anim');
        setTimeout(() => {
          if (syncSpin) syncSpin.classList.remove('spin-anim');
          showToast('Calls synchronized with Voice AI.');
        }, 500);
      });
    }

    document.getElementById('btnExportCallsCsv')?.addEventListener('click', exportCallsToCsv);
    document.getElementById('btnExportContactsCsv')?.addEventListener('click', exportContactsToCsv);
    document.getElementById('btnExportAuditCsv')?.addEventListener('click', exportAuditToCsv);
  }

  function exportCallsToCsv() {
    const headers = ['CallID', 'DateTime', 'Duration', 'Cost', 'From', 'To', 'Contact', 'Agent', 'Direction', 'Status', 'EndReason', 'Outcome'];
    const rows = state.calls.map(c => [
      c.id, `"${c.datetime}"`, c.durationStr, c.cost, c.from, c.to, `"${c.contactName}"`, `"${c.agent}"`, c.direction, c.status, `"${c.endReason}"`, `"${c.outcome}"`
    ]);
    downloadCsv('voice_agent_calls_export.csv', [headers, ...rows]);
    showToast('Calls exported to CSV.');
  }

  function exportContactsToCsv() {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Postcode', 'TotalCalls', 'LastCall', 'Notes'];
    const rows = state.contacts.map(c => [
      c.id, `"${c.name}"`, c.phone, c.email, c.postcode, c.callsCount, `"${c.lastCall}"`, `"${c.notes.replace(/"/g, '""')}"`
    ]);
    downloadCsv('voice_agent_contacts_export.csv', [headers, ...rows]);
    showToast('Contacts exported to CSV.');
  }

  function exportAuditToCsv() {
    const headers = ['DateTime', 'User', 'Action', 'Entity', 'EntityName', 'Details'];
    const rows = state.auditLogs.map(a => [
      `"${a.datetime}"`, `"${a.user}"`, `"${a.action}"`, `"${a.entity}"`, `"${a.entityName}"`, `"${a.details.replace(/"/g, '""')}"`
    ]);
    downloadCsv('voice_agent_audit_logs.csv', [headers, ...rows]);
    showToast('Audit trail exported to CSV.');
  }

  function downloadCsv(filename, data) {
    const csvContent = 'data:text/csv;charset=utf-8,' + data.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, isError = false) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) toast.style.background = '#991b1b';

    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  // --- GLOBAL WINDOW HOOKS ---
  window.openCallDrawerById = (id) => openCallDrawer(id);
  window.seekAudioTo = (time) => {
    state.audioProgress = time;
    updateAudioTimeUI();
    drawWaveformCanvas();
    if (!state.currentAudioPlaying) {
      startAudioPlayback();
    }
  };
  window.viewContactCalls = (phone) => {
    document.getElementById('nav-calls')?.click();
    const phoneInput = document.getElementById('filterPhoneInput');
    if (phoneInput) {
      phoneInput.value = phone;
      phoneInput.dispatchEvent(new Event('input'));
    }
  };
  window.editContactNote = (contactId) => {
    const contact = state.contacts.find(c => c.id === contactId);
    if (!contact) return;
    const modal = document.getElementById('contactNoteModal');
    document.getElementById('contactNoteId').value = contact.id;
    document.getElementById('contactNoteDetails').textContent = `${contact.name} • ${contact.phone} • ${contact.postcode}`;
    document.getElementById('contactNoteText').value = contact.notes;
    modal.classList.add('open');
  };
  window.openDocExplorer = (kbId) => {
    const kb = state.knowledgeBases.find(k => k.id === kbId);
    if (!kb) return;
    const modal = document.getElementById('docExplorerModal');
    document.getElementById('docExplorerTitle').textContent = kb.name;
    const list = document.getElementById('docFilesList');
    if (kb.files && kb.files.length > 0) {
      list.innerHTML = kb.files.map(f => `
        <div class="doc-file-item">
          <div class="doc-file-info">
            <div class="doc-file-icon">📄</div>
            <div>
              <div class="doc-file-name">${f.name}</div>
              <div class="doc-file-meta">${f.size} • ${f.chunks} vector chunks • <span style="color:#10b981;">${f.status}</span></div>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="alert('Sample chunk:\\n\\\"Verified trade diagnostic and emergency triage rules.\\\"')">Preview Chunks</button>
        </div>
      `).join('');
    } else {
      list.innerHTML = `<p class="text-sm text-muted">No files found in this knowledge base.</p>`;
    }
    modal.classList.add('open');
  };
  window.copyPhone = (phone) => {
    navigator.clipboard?.writeText(phone);
    showToast(`Copied phone number: ${phone}`);
  };
  window.resendInvite = (email) => {
    showToast(`Invitation re-sent to ${email}.`);
  };
  window.downloadInvoice = (invId) => {
    showToast(`Downloading official VAT invoice receipt for ${invId}...`);
  };

});
