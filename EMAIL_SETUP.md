# Email Setup Guide

## Overview
The Belief Code Typer now supports sending session data via email using Hotmail/Outlook SMTP. This feature allows you to send generated session files directly to clients or yourself.

## Setup Instructions

### 1. Convex Setup
1. Make sure you have a Convex project set up
2. Get your Convex URL from your dashboard
3. Create a `.env` file in the root directory with:
   ```
   VITE_CONVEX_URL=your_convex_url_here
   ```
   Replace `your_convex_url_here` with your actual Convex URL (e.g., `https://your-project.convex.cloud`)

### 2. Hotmail/Outlook Setup
For sending emails via Hotmail/Outlook, you have two options:

#### Option A: Regular Password (Less Secure)
- Use your regular Hotmail/Outlook password
- Note: This may not work if 2FA is enabled

#### Option B: App Password (Recommended)
1. Go to your Microsoft Account settings
2. Navigate to Security → Advanced security options
3. Enable 2-Step Verification if not already enabled
4. Create an "App password" for this application
5. Use this app password instead of your regular password

### 3. Usage
1. Fill out your Belief Code session form
2. Click the "Send via Email" button
3. Enter the recipient's email address
4. Enter your Hotmail/Outlook email address
5. Enter your password (regular or app password)
6. Click "Send Session"

## Security Notes
- Email credentials are not stored and are only used for sending
- The password field is cleared after sending
- Consider using app passwords for better security
- The email is sent from your Hotmail/Outlook account

## Troubleshooting
- If sending fails, check your email credentials
- Make sure 2FA is properly configured if using app passwords
- Verify your Convex URL is correct
- Check the browser console for any error messages

## Features
- Sends session data as a formatted text file
- Includes session details in the email body
- Supports all form fields (client name, subject, details, session type, sections)
- Real-time feedback with success/error messages
