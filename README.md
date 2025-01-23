# Sem 5 DBMS project using Next.js and Prisma

## Team Members
* PES1UG22CS264 - K N Sunav - [musashi-13](https://github.com/muasashi-13)
* PES1UG22CS275 - Karan Prasad Hathwar - [Sunavkn](https://github.com/Sunavkn)


## Problem statement

> A vehicle service and parts management system built using Next.js, Prisma, PostgreSQL, and tailwindcss. With the database hosted on [Neon](neon.tech) we are able to have the entire project up and running. 

## How to run

* Clone the repository
    * `git clone https://github.com/musashi-13/cerberus-dbms-project`
* Install dependancies
    * `pnpm install`
* Create `.env` file with your jwt token, database url, and database user.
    * `DATABASE_URL="..."`
* Migrate the schema to your database
    * `pnpm prisma migrate dev`
* Run the project
    * `pnpm dev`

## Nextjs Database system - project checklist

#### Setting up the project

- [x] Create and set up next.js typescript project with tailwindcss
- [x] Create schema for the database
- [x] Connect neon database with the project
- [x] Migrate schema and populate the tables

#### Frontend

- [x] Build a frontend with next.js and tailwindcss
- [x] Design the website layout and features
- [x] Set up routes and pages
- [x] Add assets

#### Backend

- [x] Write authentication backend
- [x] Write database queries for the project specifications - login, employee login, signup, update and delete account, create/get/delete appointments, creata/get/delete vehicles, add feedback, get employee appointments and accept appointments
- [x] Test user creation and login
- [x] Test cascading deletes and changes

#### Pending Implementation

- [x] Create employee, parts management, and a few more features
- [x] Bug Fixing
