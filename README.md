# CSCI 2040U Assignment

**STREAMLY**: Music Library Catalogue System

Streamly is a music catalogue application inspired by platforms such as Spotify and YouTube Music. The system allows users to explore a structured music library while giving administrators full control over managing the music database.
This repository contains the Minimum Viable Product (MVP) developed during Iteration 1 of the Streamly project for CSCI 2020U – System Development and Integration.

**Project Goals**
* The goal of Streamly is to build a scalable music database system that provides:
    * Secure user authentication
    * Organized music metadata storage
    * Flexible search and filtering capabilities
    * Administrative database management
    * Personalized user engagement features

The MVP focuses on building the core system infrastructure, including authentication and database control.

**Implemented Features (MVP):**
* Authentication
    - User Registration
    - User Login
    - User Logout
    - Admin Login
    - Admin Database Management
    - Adding songs to the database
    - Editing song metadata
    - Remove songs from the system

These features allow administrators to maintain and manage the music library.

* Search and Filtering
    - Search by song title
    - Search by artist
    - Search by album
    - Filter by genre
    - Filter by release year
    - Filter by popularity


* User Engagement
    - Favourite songs playlist
    - View favourite songs
    - Search inside favourites

Password encryption

* Optional Features
    - Password encryption
    - Music playback functionality

**Technologies Used**
* Java
* Java Swing (GUI)
* JSON
* GitHub (version control)

**Installation & Setup**
1. Clone the repository
   git clone **https://github.com/your-repo/streamly.git**
2. Open the project
   Open the project in a Java IDE such as: IntelliJ IDEA

3. Configure the database

Ensure the database connection is properly configured.

Example fields for the songs table:
* Title
* Artist
* Album
* Genre
* Release Year
* Popularity

4. Run the application

Locate and run the main application file.


This will launch the Streamly application interface.

**Project Structure (definitions)**
* auth – login, registration, logout logic
* backed – more complex funtionality on how data is handled and how the database works.
* data – all song data included in the application (database connection & queries)
* frontend – graphical user interface components

Team Members
Project developed by:
* Devin Boodoo – Technical Manager
* Jonathan Lavoie – Back-End Lead
* Maryam Hameed – Software Quality Lead
* Ashwin Sivasakthi – Front-End Lead
* Avis Shrestha – Project Manager
