CREATE TABLE city (
  city_id SERIAL NOT NULL PRIMARY KEY,
  city_name VARCHAR(100) NOT NULL
);

CREATE TABLE bar (
  bar_id SERIAL NOT NULL PRIMARY KEY,
  bar_name VARCHAR(100) NOT NULL,
  city_id INTEGER REFERENCES city(city_id) ON DELETE CASCADE
);

CREATE TABLE  lawyer (
  lawyer_id SERIAL NOT NULL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  bar_id INTEGER REFERENCES bar (bar_id) ON DELETE CASCADE,
  status VARCHAR(100) DEFAULT 'available' CHECK (status IN ('reserved', 'available')),
  verified BOOLEAN DEFAULT true
);

CREATE TABLE lawyer_profile (
  lawyer_id INTEGER PRIMARY KEY REFERENCES lawyer(lawyer_id) ON DELETE CASCADE NOT NULL,
  linkedin_url VARCHAR(255),
  description TEXT,
  star_rating DECIMAL(3, 2) DEFAULT 0,
  num_rating INTEGER DEFAULT 0
);

CREATE TABLE star_rating (
  rating_id SERIAL PRIMARY KEY,
  rating INT NOT NULL,
  from_lawyer_id INT NOT NULL,
  to_lawyer_id INT NOT NULL,
  FOREIGN KEY (from_lawyer_id) REFERENCES lawyer (lawyer_id),
  FOREIGN KEY (to_lawyer_id) REFERENCES lawyer (lawyer_id)
);
