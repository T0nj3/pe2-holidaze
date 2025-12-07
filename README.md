# Holidaze 
### A modern accommodation booking platform built with React, TypeScript, and Tailwind CSS.

#### This project was created as part of my final exam in front-end development.
The assignment required building a booking platform with both guest and host functionality.

⸻

## Overview

### Holidaze allows users to:
	•	Browse and search for venues
	•	View detailed venue pages
	•	Create an account and log in
	•	Save favourites
	•	Book venues
	•	View their own upcoming and past bookings

### Hosts can:
	•	Access a Host Dashboard
	•	Create, edit and delete venues
	•	View upcoming bookings per venue (including guest avatar, name, and email)

#### The mobile version includes a fully custom bottom navigation bar for an app-like experience.

⸻

### Tech stack

React (with React Router)
TypeScript
Vite
Tailwind CSS
React Icons

#### All API communication is handled through custom wrappers in /api.

⸻

### Getting started
####	1.	Prerequisites

Node.js (version 18 or higher recommended)
npm (comes with Node.js)

Check your versions:

node -v
npm -v

⸻

###	2.	Clone the repository

git clone 
cd holidaze

#### https://github.com/T0nj3/pe2-holidaze

⸻

###	3.	Install dependencies

npm install

⸻

###	4.	Run the development server

npm run dev

Then open http://localhost:5173 in your browser.

⸻

### Additional scripts

npm run build
npm run preview
npm run lint
npm test

⸻

### API & configuration

API-related logic is located in:
api/client.ts
api/venues.ts
api/profile.ts

Update base URLs in client.ts if needed.

⸻

### Main features

#### Guest features:
	•	Full venue search
	•	Venue detail pages
	•	Account creation and login
	•	Save favourites
	•	Booking flow
	•	Upcoming and past bookings

#### Host features:
	•	Host Dashboard
	•	Manage venues (create, edit, delete)
	•	View upcoming bookings
	•	Guest avatar + email in booking list

#### Mobile UX features:
	•	App-style Bottom Navigation Bar
	•	Redesigned mobile search section
	•	Safe-area padding for scrolling

⸻

#### Exam context

### This project was built for an exam to demonstrate:
	•	Advanced React + TypeScript
	•	Component-driven architecture
	•	UI development with Tailwind CSS
	•	API communication and validation
	•	Professional UX for both guests and hosts

⸻

### Project structure

src/
api/
components/
pages/
context/
main.tsx
App.tsx

⸻

#### License

This project was created for educational and exam purposes only.

⸻

💛 Thank you for checking out Holidaze!
