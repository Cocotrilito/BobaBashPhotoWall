# Boba Bash Photo Wall

This is a live photo wall. In short, everyone at your event can upload their photos, crop them, and share a wall with every attendee of your event, creating a shared memory, this has a realtime connection between everyone's phones and the wall.

## Features

- Polaroid Effect (retro filter, rotation, grain, vignette)
- Crop Modal before uploading
- QR code Share
- Clipboard Link Share
- Custom City Label per Photo
- Edit or Delete Your Own Uploaded Photos
- Admin Mode to Moderate (delete) Any Photo
- Secure Admin Login via Supabase Auth
- Realtime Updates - New Photos appear **instantly**

## Setup for YOUR own event

### 1. Create a Supabase project
    Go to supabase.com create an account and also setup a project 

### 2. Create the database table
Go to **Table Editor** and create a new table called `photowall` with these columns:

| Column        | Type      |    
|---------------|-----------|
| photo_url     | text      |
| filename      | text      |
| city          | text      |
| owner_token   | text      |

(`id` and `created_at` are created automatically by Supabase.)
### 3. Set up storage
Go to **Storage** and create a new bucket called `photos`. Make sure it's set to **public**.
### 4. Configure Row Level Security policies
You'll need 4 policies total:

**On the `photowall` table:**
- **INSERT** — allow role `anon`, condition: `true`
- **SELECT** — allow roles `anon` and `authenticated`, condition: `true`
- **DELETE** — allow role `public`, condition: `true`
- **UPDATE** — allow role `public`, condition: `true`

**On the `photos` storage bucket:**
- **INSERT** — allow role `anon`, condition: `bucket_id = 'photos'`
- **SELECT** — allow role `anon`, condition: `bucket_id = 'photos'`
- **DELETE** — allow role `anon`, condition: `bucket_id = 'photos'`

> ⚠️ These policies allow anyone to upload/edit/delete this is intentional for a casual event setting, not meant for high-security use cases.
### 5. Update config.js
In your supabase project, go to **Project Settings → API Keys** and copy your **Project URL** and **Publishable key**. Then open `js/config.js` and replace the values:

```javascript
const SUPABASE_URL = "YOUR_PROJECT_URL_HERE";
const SUPABASE_KEY = "YOUR_PUBLISHABLE_KEY_HERE";
```
> ⚠️ ONLY use the **PUBLISHABLE KEYS**, never the Secret key (SECRET key must never be exposed in frontend code!)
### 6. Deploy to GitHub Pages
ok so now you have most of it except a place to publish it, the easiest way is with github pages!

1. Push your code to a GitHub repository.
2. Go to **Setings  → Pages** in your repo.
3. Under **Source**, select **Deploy from a Branch**, choose your `main` branch and `/ (root)` folder.
4. Save.... then after a minute your site will be live at `https://yourusername.github.io/your-repo-name/`.
5. Also you can chek this in your repo **Actions Tab**.

### 7. Set Up your admin account (opptional)
If you want to moderate photos during your event, create a user in **Authentication → Users** in your Supabase dashboard, with **Auto Confirm User** checked. Use that email and password to log in via the lock icon in the header.


## The reason behind this project

This project is being submitted to Darkroom, a YSWS about photography from Hack club. I wanted to make this project because I feel making a project of something that you won't actually use is a waste of a time. In this case I WILL use my project and feel proud of it, instead of making something just for the grants

## Special thanks to

Thanks to [Trulle1234](https://github.com/Trulle1234) and the [Hack Club](https://hackclub.com) [Darkroom](https://darkroom.hackclub.com) community for making this possible.

## You might also like!

Check out some of my other projects:
- [BerserkMod](https://github.com/Cocotrilito/berserkmod) - A Berserk-themed Minecraft mod
- [The Branded One](https://github.com/Cocotrilito/The-Branded-one) - An NFC business card
