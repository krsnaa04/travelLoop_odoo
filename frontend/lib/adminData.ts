export const metrics = [
  {
    id: 'users',
    title: 'Total Users',
    value: 124832,
    delta: 4.6,
    series: Array.from({length: 30}).map((_,i)=>({x:`Day ${i+1}`, y: Math.round(1000 + Math.random()*400 + i*12)}))
  },
  {
    id: 'trips',
    title: 'Active Trips',
    value: 8321,
    delta: 2.1,
    series: Array.from({length: 30}).map((_,i)=>({x:`Day ${i+1}`, y: Math.round(200 + Math.random()*80 + Math.sin(i/3)*30)}))
  },
  {
    id: 'posts',
    title: 'Community Posts',
    value: 24321,
    delta: -1.2,
    series: Array.from({length: 30}).map((_,i)=>({x:`Day ${i+1}`, y: Math.round(400 + Math.random()*120 + Math.cos(i/4)*20)}))
  }
];

export const users = Array.from({length:12}).map((_,i)=>({
  id: `u${i}`,
  name: ['Ava','Liam','Noah','Olivia','Emma','Ethan','Mia','Lucas','Amelia','Mason','Isla','Logan'][i%12],
  username: `user${i}`,
  email: `user${i}@traveloop.com`,
  avatar: `https://i.pravatar.cc/150?u=${i}`,
  joined: `202${i%3}-0${(i%9)+1}-12`,
  trips: Math.floor(Math.random()*12),
  status: i%4===0? 'inactive':'active'
}));

export const destinations = [
  { id: 'd1', name: 'Bali, Indonesia', trips: 8321, growth: 12, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { id: 'd2', name: 'Lisbon, Portugal', trips: 4321, growth: 8, image: 'https://images.unsplash.com/photo-1502602898657-3e907600bb8c?auto=format&fit=crop&w=800&q=80' },
  { id: 'd3', name: 'Kyoto, Japan', trips: 5123, growth: 6, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
  { id: 'd4', name: 'Reykjavik, Iceland', trips: 1203, growth: 22, image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80' }
];

export const activities = [
  { name: 'Hiking', value: 45 },
  { name: 'Food Tours', value: 25 },
  { name: 'Luxury Stays', value: 12 },
  { name: 'Museums', value: 10 },
  { name: 'Adventure', value: 8 }
];
