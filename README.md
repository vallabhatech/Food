
# 🍲 FeediFy (Food Donation App)

A minimal, frontend-focused humanitarian food donation app built with React and TypeScript. This application serves as a Minimum Viable Product (MVP) to demonstrate the core user flows of collecting donation posts, allowing admins to manage operations, and enabling volunteers to handle pickups.

## ✨ Key Features

  * **Donor Portal:** A simple, public-facing form for donors to submit food donation details.
  * **Admin Dashboard:** A protected area for administrators to manage volunteers, view donation statuses, and assign pickups.
  * **Simulated AI Assistant:** A component demonstrating how AI can help admins optimize routes or manage tasks.
  * **Volunteer Dashboard:** A dedicated view for volunteers to see their assigned tasks, update pickup statuses, and manage their workflow.
  * **Map Integration:** An optional map view (`react-leaflet`) to visualize donation locations.
  * **Client-Side Persistence:** Utilizes React Contexts and Local Storage to simulate a database for a seamless demo experience.

-----

## 🛠️ Tech Stack

  * **Framework:** React + TypeScript + Vite
  * **Styling:** Tailwind CSS
  * **Routing:** React Router
  * **State Management:** React Context API
  * **Mapping:** `react-leaflet` & `leaflet`

-----

## 📂 Project Structure

The project follows a standard React application structure, separating components, pages, and state logic for clarity and scalability.

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── DonationForm.tsx        # Form for donors to submit food donations.
│   │   ├── SearchBar.tsx           # Reusable search input component.
│   │   └── admin/
│   │       ├── AIAssistant.tsx       # Simulated AI helper for admin tasks.
│   │       └── VolunteerManagement.tsx # UI for admins to manage volunteers.
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Manages user authentication and session.
│   │   ├── DonationContext.tsx       # Manages the state for all donations.
│   │   └── VolunteerContext.tsx      # Manages the state for all volunteers.
│   │
│   ├── pages/
│   │   ├── AdminDashboard.tsx      # Main dashboard for the admin user.
│   │   ├── AdminLogin.tsx          # Login page for administrators.
│   │   ├── Available.tsx           # Page displaying all available donations.
│   │   ├── MapView.tsx             # (Optional) Page with map integration.
│   │   ├── VolunteerDashboard.tsx  # Dashboard for logged-in volunteers.
│   │   └── VolunteerLogin.tsx        # Login page for volunteers.
│   │
│   ├── App.tsx                     # Main app component, sets up routing.
│   └── main.tsx                    # Entry point of the application.
│
├── index.html
├── package.json
└── tailwind.config.js
```

-----

## 🗂️ Data Models

Data is represented using simple TypeScript interfaces and managed within React Contexts.

### Donation

```typescript
{
  id: string;
  donor: string;
  organizationType: string;
  foodType: string;
  quantity: string; // e.g., "10 meals"
  location: { lat: number, lng: number };
  phone: string;
  expiryTime: Date;
  urgency: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Completed';
  assignedVolunteer?: string; // volunteer ID
  specialInstructions?: string;
}
```

### Volunteer

```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  availability: string[]; // e.g., ["Weekdays", "Mornings"]
  rating: number; // e.g., 4.5
  stats: { completedPickups: number };
}
```

-----

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

  * Node.js (v18 or later)
  * npm or yarn

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/vallabhatech/Food
    cd Food
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **(Optional) If using the map feature, install Leaflet:**

    ```sh
    npm install react-leaflet leaflet
    ```

    Then, add the Leaflet CSS to your `index.html` file in the `<head>` section:

    ```html
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
    ```

### Running the Development Server

1.  **Start the Vite dev server:**
    ```sh
    npm run dev
    ```
2.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your console).

-----

## 🧭 User Flows & Testing Guide

### 👤 Admin Flow

1.  Navigate to `/admin/login`.
2.  Log in with the demo credentials:
      * **Email:** `admin`
      * **Password:** `admin123`
        *(Note: The initial `AdminLogin` page might use `admin@foodbank.org` / `demo123`. This needs to be unified with the credentials seeded in `AuthContext`.)*
3.  You will be redirected to the **Admin Dashboard** (`/admin/dashboard`).
4.  Here you can view the `VolunteerManagement` and `AIAssistant` components.
5.  Navigate to the `/available` page to see all "Pending" donations. You can assign these donations to a volunteer.

### 🧑‍🤝‍🧑 Volunteer Flow

1.  Navigate to `/volunteer`.
2.  Enter a demo volunteer identifier (e.g., name or ID from the seeded data in `VolunteerContext`).
3.  You will be directed to the **Volunteer Dashboard** (`/volunteer/dashboard/:volunteerId`).
4.  This dashboard will show your assigned donations.
5.  You can update the status of a donation by clicking **"Start Collection"** (sets status to `In Transit`) and then **"Mark Completed"** (sets status to `Completed`).

### 🥪 Donor Flow

1.  Navigate to the main donation form (likely on the homepage or `/donate`).
2.  Fill out the donation details and submit the form.
3.  The donation will be added to `DonationContext` with a `Pending` status.
4.  Verify that the new donation appears on the `/available` page for the admin to see.

-----

## 🎯 Roadmap & Next Steps

This project is an MVP and has several known gaps that provide a clear path for future development.

### Immediate Actionable Items (MVP Polish)

  - [ ] **Unify Admin Credentials:** Ensure `AdminLogin.tsx` uses the same credentials (`admin`/`admin123`) that are seeded in `AuthContext.tsx`.
  - [ ] **Implement Context Persistence:** Use `localStorage` helpers to save and load state in `DonationContext` and `VolunteerContext` to prevent data loss on page refresh.
  - [ ] **Wire Up All Routes:** Ensure `NavBar` is implemented and all routes (`/available`, `/map`, `/admin/*`, `/volunteer/*`) are correctly configured in `App.tsx` or `main.tsx`.
  - [ ] **Fix `AuthContext`:** Implement the `loadUsers`/`saveUsers` helper functions to ensure authentication state is properly managed.
  - [ ] **Stable ID Generation:** Implement a function within the contexts to generate stable, unique IDs for new donations and volunteers.

### Future Scalability (MVP → Production)

  - [ ] **Backend Integration:** Replace `localStorage` with a proper backend service (e.g., Node.js/Express, Django) and a database (e.g., PostgreSQL, MongoDB).
  - [ ] **Secure Authentication:** Implement robust, token-based authentication (e.g., JWT) instead of the demo login system.
  - [ ] **Real-time Notifications:** Add push notifications to alert volunteers when they are assigned a new pickup.
  - [ ] **Input Validation:** Add server-side and client-side validation for the donation form.
  - [ ] **Analytics & Reporting:** Build out the `AIAssistant` into a real reporting dashboard for admins.
