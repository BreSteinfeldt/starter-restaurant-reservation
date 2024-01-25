# Restaurant Reservation System

> A full-stack web application built to mock a restaurant reservation system for a local restaurant
> The software is used only by restaurant personnel when a customer calls to request a reservation.
> Features were built from the ground up based on a series of User Stories (listed later on in User Stories section).

## Built with:
React <br/>
Node.js <br/>
Express <br/>
Knex <br/>
PostgreSQL <br/>
Bootstrap <br/>
Trello <br/>

## Objectives

Create full-stack web app (front-end UI and back-end API) for a "client". <br/>
Build and implement features by interpreting "client" user stories. <br/>
Successfully deploy the application for demo usage. <br/>

## User Stories

### User Story 1
As a restaurant manager<br/>
I want to create a new reservation when a customer calls<br/>
so that I know how many customers will arrive at the restaurant on a given day.<br/>

### User Story 2
As a restaurant manager<br/>
I only want to allow reservations to be created on a day when we are open<br/>
so that users do not accidentally create a reservation for days when we are closed.<br/>

### User Story 3
As a restaurant manager<br/>
I only want to allow reservations to be created during business hours, up to 60 minutes before closing<br/>
so that users do not accidentally create a reservation for a time we cannot accommodate.<br/>

### User Story 4
As a restaurant manager,<br/>
When a customer with an existing reservation arrives at the restaurant<br/>
I want to seat (assign) their reservation to a specific table<br/>
so that I know which tables are occupied and free.<br/>

### User Story 5
As a restaurant manager<br/>
I want to free up an occupied table when the guests leave<br/>
so that I can seat new guests at that table.<br/>

### User Story 6
As a restaurant manager<br/>
I want a reservation to have a status of either booked, seated, or finished<br/>
so that I can see which reservation parties are seated, and finished reservations are hidden from the dashboard.<br/>

### User Story 7
As a restaurant manager<br/>
I want to search for a reservation by phone number (partial or complete)<br/>
so that I can quickly access a customer's reservation when they call about their reservation.<br/>

### User Story 8
As a restaurant manager<br/>
I want to be able to modify a reservation if a customer calls to change or cancel their reservation<br/>
so that reservations are accurate and current.<br/>