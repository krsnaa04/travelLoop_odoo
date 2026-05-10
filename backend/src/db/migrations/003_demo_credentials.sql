INSERT INTO users (id, email, password_hash, name, avatar_url)
VALUES (
  'f56e6f83-14f6-4f4f-b88c-b9a5d1fc1a01',
  'demo@traveloop.com',
  '$2a$10$RiCY6RwgYvsRg/WeCe3hUOR4vUh2/8Qc26eEi9WIXN95W.0iJ0Ny6',
  'Demo Traveler',
  NULL
)
ON CONFLICT (email)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  updated_at = NOW();
