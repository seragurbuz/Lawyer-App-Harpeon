CREATE TABLE cities (
  city_id SERIAL NOT NULL PRIMARY KEY,
  city_name VARCHAR(100) NOT NULL
);

CREATE TABLE bars (
  bar_id SERIAL NOT NULL PRIMARY KEY,
  bar_name VARCHAR(100) NOT NULL,
  city_id INTEGER REFERENCES cities(city_id) ON DELETE CASCADE
);

CREATE TABLE  lawyers (
  lawyer_id SERIAL NOT NULL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  bar_id INTEGER REFERENCES bars (bar_id) ON DELETE CASCADE,
  status VARCHAR(100) NOT NULL DEFAULT 'available' CHECK (status IN ('reserved', 'available')),
  verified BOOLEAN NOT NULL DEFAULT false,
  verification_code VARCHAR(255), 
  password_reset_code VARCHAR(255)
);

CREATE TABLE lawyer_profiles (
  lawyer_id INTEGER PRIMARY KEY REFERENCES lawyers(lawyer_id) ON DELETE CASCADE NOT NULL,
  linkedin_url VARCHAR(255),
  description TEXT,
  star_rating DECIMAL(3, 2) DEFAULT 0,
  rating_num INTEGER DEFAULT 0
);

CREATE TABLE star_ratings (
  rating_id SERIAL NOT NULL PRIMARY KEY,
  rating INT NOT NULL,
  from_lawyer_id INT NOT NULL,
  to_lawyer_id INT NOT NULL,
  FOREIGN KEY (from_lawyer_id) REFERENCES lawyers (lawyer_id) ON DELETE CASCADE,
  FOREIGN KEY (to_lawyer_id) REFERENCES lawyers (lawyer_id) ON DELETE CASCADE
);

CREATE TABLE jobs (
  job_id SERIAL NOT NULL PRIMARY KEY,
  description TEXT NOT NULL,
  start_date DATE,
  end_date DATE NOT NULL,
  job_state VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (job_state IN ('not_started', 'started', 'ended')),
  creator_lawyer_id INTEGER REFERENCES lawyers(lawyer_id) ON DELETE CASCADE,
  lawyer_id INTEGER REFERENCES lawyers(lawyer_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE offers (
  offer_id SERIAL NOT NULL PRIMARY KEY,
  from_lawyer_id INTEGER REFERENCES lawyers(lawyer_id) ON DELETE CASCADE,
  to_lawyer_id INTEGER REFERENCES lawyers(lawyer_id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(job_id) ON DELETE CASCADE,
  state VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (state IN ('accepted', 'waiting', 'rejected'))
);

CREATE TABLE rejected_offers (
  rejected_offer_id SERIAL NOT NULL PRIMARY KEY,
  from_lawyer_id INTEGER REFERENCES lawyers(lawyer_id) ON DELETE CASCADE,
  to_lawyer_id INTEGER REFERENCES lawyers(lawyer_id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(job_id) ON DELETE CASCADE,
  rejected_at TIMESTAMP DEFAULT NOW()
);
