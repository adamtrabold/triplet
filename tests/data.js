const ROWS = [
  { id: '3f1c9a2e-7b4d-4e0a-9c1f-2a6b8d0e4f11', name: 'Café Pascal', category: 'cafe', city: 'stockholm', visited: false, starred: true, lat: 59.3421, lng: 18.0521 },
  { id: '5e7f9a1b-3c5d-4e7f-a1b3-c5d7e9f1a3b5', name: 'Swedish Museum of Performing Arts Scenkonstmuseet', category: 'attraction', city: 'stockholm', visited: true, starred: true, lat: 59.336, lng: 18.078 },
  { id: 'c2e4a6b8-d0f2-4a4c-8e6f-0b2d4f6a8c0e', name: 'Stockholm Public Library Stadsbiblioteket', category: 'attraction', city: 'stockholm', visited: true, starred: true, lat: 59.343, lng: 18.054 },
  { id: '9b1d3f5a-7c9e-4b1d-a3f5-7c9e1b3d5f7a', name: 'The Handknitting Association of Iceland', category: 'shopping', city: 'reykjavik', visited: false, starred: true, lat: 64.146, lng: -21.93 },
  { id: '2b4d6f8a-0c2e-4a6b-8d0f-2a4c6e8b0d2f', name: 'Grillmarkaðurinn', category: 'restaurant', city: 'reykjavik', visited: false, starred: true, lat: 64.1473, lng: -21.9372 },
  { id: '1a3c5e7f-9b1d-4f3a-b5c7-e9f1a3c5e7b9', name: 'Mother restaurant Copenhagen', category: 'restaurant', city: 'copenhagen', visited: true, starred: false, lat: 55.667, lng: 12.56 },
  { id: '7f9b1d3e-5a7c-4e9b-81d3-f5a7c9e1b3d5', name: 'Hafnarhús Reykjavik Art Museum', category: 'attraction', city: 'reykjavik', visited: false, starred: false, lat: 64.15, lng: -21.94 },
  { id: 'a8d2e4f6-1b3c-4d5e-8f70-9a1b2c3d4e5f', name: 'Fotografiska', category: 'attraction', city: 'stockholm', visited: true, starred: false, lat: 59.318, lng: 18.085 },
  { id: 'e4f6a8b0-c2d4-4f6a-8b0c-2d4e6f8a0b2c', name: 'Kaffibarinn', category: 'bar', city: 'reykjavik', visited: false, starred: true, lat: 64.1488, lng: -21.9245 },
];
const SHAPES = [{ id: 901, label: 'Skólavörðustígur', type: 'street', city: 'reykjavik', geometry: [[64.145, -21.93], [64.144, -21.926]] }];
module.exports = { ROWS, SHAPES };
