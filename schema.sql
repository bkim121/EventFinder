DROP DATABASE IF EXISTS eventfinder;

CREATE DATABASE eventfinder;

USE eventfinder;

CREATE TABLE venues (
  givenId VARCHAR(200) NOT NULL,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(200) NOT NULL,
  lat DECIMAL(9,6) NOT NULL,
  lng DECIMAL(9,6) NOT NULL,
  url TEXT,
  postalCode VARCHAR(200) NOT NULL,
  image TEXT,
  PRIMARY KEY (givenId)
);

CREATE TABLE events (
  givenId VARCHAR(200) NOT NULL,
  name VARCHAR(200) NOT NULL,
  startDate DATE NOT NULL,
  startTime TIME NOT NULL,
  image TEXT,
  category VARCHAR(200),
  url TEXT,
  venueId VARCHAR(200) NOT NULL,
  PRIMARY KEY (givenId),
  FOREIGN KEY (venueId) REFERENCES venues(givenId)
);

CREATE TABLE myvenues (
  id int AUTO_INCREMENT NOT NULL,
  userId VARCHAR(25),
  venueId VARCHAR(200) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (venueId) REFERENCES venues(givenId)
);

CREATE TABLE myevents (
  id int AUTO_INCREMENT NOT NULL,
  userId VARCHAR(25),
  eventId VARCHAR(200),
  PRIMARY KEY (id),
  FOREIGN KEY (eventId) REFERENCES events(givenId)
);