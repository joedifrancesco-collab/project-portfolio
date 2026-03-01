export const sampleProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    status: 'In Progress',
    category: 'Marketing',
    businessUnit: 'Corporate Communications',
    businessSponsor: 'Jane Smith',
    description: 'Complete overhaul of the company website with modern design and improved UX.',
    tasks: [
      { id: 't1', title: 'Wireframe mockups', status: 'Done', assignee: 'Alice' },
      { id: 't2', title: 'Design system setup', status: 'In Progress', assignee: 'Bob' },
      { id: 't3', title: 'Homepage development', status: 'Not Started', assignee: 'Alice' },
    ],
    documents: [
      { id: 'd1', name: 'Design Brief.pdf', type: 'PDF', url: '#', uploadedAt: '2026-01-16' },
      { id: 'd2', name: 'Brand Guidelines.docx', type: 'DOCX', url: '#', uploadedAt: '2026-01-20' },
    ],
    notes: [
      { id: 'n1', text: 'Kickoff meeting completed. Team aligned on goals.', createdAt: '2026-01-15T10:00:00Z' },
      { id: 'n2', text: 'Client approved wireframes. Moving to design phase.', createdAt: '2026-02-01T14:30:00Z' },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Launch',
    status: 'Planning',
    category: 'Technology',
    businessUnit: 'Product Development',
    businessSponsor: 'John Doe',
    description: 'Develop and launch a cross-platform mobile app for iOS and Android.',
    tasks: [
      { id: 't4', title: 'Requirements gathering', status: 'Done', assignee: 'John' },
      { id: 't5', title: 'Tech stack decision', status: 'In Progress', assignee: 'Team' },
    ],
    documents: [
      { id: 'd3', name: 'Requirements Doc.pdf', type: 'PDF', url: '#', uploadedAt: '2026-02-10' },
    ],
    notes: [
      { id: 'n3', text: 'Initial scoping session completed. Budget approved by stakeholders.', createdAt: '2026-02-15T09:00:00Z' },
    ],
  },
  {
    id: '3',
    name: 'Data Migration',
    status: 'On Hold',
    category: 'Infrastructure',
    businessUnit: 'IT Operations',
    businessSponsor: 'Mary Johnson',
    description: 'Migrate legacy database to new cloud infrastructure.',
    tasks: [
      { id: 't6', title: 'Inventory legacy data', status: 'Done', assignee: 'Dave' },
      { id: 't7', title: 'Map data schemas', status: 'Done', assignee: 'Dave' },
      { id: 't8', title: 'Migration scripts', status: 'Not Started', assignee: 'Dave' },
      { id: 't9', title: 'Validation testing', status: 'Not Started', assignee: 'QA Team' },
    ],
    documents: [
      { id: 'd4', name: 'Data Schema Map.xlsx', type: 'XLSX', url: '#', uploadedAt: '2026-02-20' },
      { id: 'd5', name: 'Migration Plan.pdf', type: 'PDF', url: '#', uploadedAt: '2026-02-22' },
    ],
    notes: [
      { id: 'n4', text: 'Project on hold pending budget review.', createdAt: '2026-02-28T11:00:00Z' },
    ],
  },
];
