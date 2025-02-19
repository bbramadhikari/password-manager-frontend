# Password Manager with Biometric Authentication (Frontend)

This is the frontend part of the **Password Manager with Biometric Authentication** project built with **Next.js** and **React**. The app utilizes OTP (One-Time Password) authentication and biometric verification (face and fingerprint) to securely manage user passwords.

## Features

- OTP-based authentication for verifying users.
- Face verification (using facial recognition) for added security.
- Password access only allowed if OTP and biometric verifications are both successful.
- Context-based state management for handling authentication status.

## Technologies Used

- **Next.js**: React framework for building the app.
- **React**: For UI components and state management.
- **React-Hot-Toast**: For showing success/error toasts.
- **Tailwind CSS**: For styling.
- **TypeScript**: For type safety.

## Folder Structure

```bash
.
├── components
│   ├── Auth
│   │   ├── FaceAuth.tsx      # Facial recognition authentication component
│   │   ├── OTPAuth.tsx       # OTP verification component
│   │   └── PasswordViewer.tsx # Password viewer (requires OTP and face authentication)
├── context
│   └── AuthContext.tsx       # Context for authentication state management
├── pages
│   └── index.tsx             # Main page for displaying components
└── styles
    └── globals.css           # Global CSS styles
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/password-manager-biometric-auth.git
cd password-manager-biometric-auth
```

### 2. Install Dependencies

Make sure you have **Node.js** and **npm** installed. Then run:

```bash
npm install
```

### 3. Run the Development Server

To run the app locally, execute:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Customizing OTP

Currently, the OTP is set to `123456` in the frontend. You can customize this logic in `OTPAuth.tsx` to fit your own OTP validation method.

### 5. Styling

Tailwind CSS is used for styling the components. If you need to make changes to the styles, you can modify the respective classes in the component files, or add new ones in `globals.css`.

## Authentication Flow

1. **OTP Verification**: 
   - The user is prompted to enter an OTP.
   - If the OTP is correct (`123456`), the user is verified, and access is granted.
   - Incorrect OTPs show an error message.

2. **Biometric Authentication**:
   - Face and fingerprint verification are handled by respective components (not fully implemented in the frontend, but placeholders for integration).
   - After both OTP and biometric verifications are successful, access to the password is granted.

3. **Password Viewer**:
   - Once both verifications are passed, the password is shown on the page.
   - If OTP or biometric verification fails, an "Access Denied" message is displayed.

## Running Tests

This project uses Jest and React Testing Library for unit and component tests. You can run the tests with:

```bash
npm run test
```

## Contributing

Feel free to fork this repository and submit pull requests for improvements. If you encounter any issues or have suggestions for improvements, open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Next.js** for the React framework.
- **Tailwind CSS** for utility-first styling.
- **React-Hot-Toast** for displaying toast messages.
```
