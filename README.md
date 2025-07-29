# bloging-website

## SETUP

First, run the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```
or
```bash
pnpm dev
```
or
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## FEATURES:

- **Creation of a Blog(INSERT)**
  - Blog Title
  - Blog Content
    - Text entered by USER
    - Import .txt,.md,.doc,.docx
  - Timestamp of Blog posted
- **Storing of Blog data (SUPABASE)**
  - The USER_ID of the USER(who posted the blog under the BLOG_RIGHTS) is also stored in the database.
  - Blog's Topic
  - Blog's Content
  - Timestamp of when the Blog was created
- **VIEW of all BLOGs**
  - All the BLOGs created by all the USERs can be viewed on the TOP page.
- **DELETE and EDIT authorization of a Blog**
  - Only the USER who created the BLOG can DELETE and EDIT their BLOG.
- **DELETE of a Blog**
  - BLOGs can be deleted.
- **EDIT of a Blog**
  - BLOGs can be editied.
- **USER AUTHENTICATION (SUPABASE O AUTH)**
  - Sign-in feature.
  - Sign-up feature.
    - Email confirmation feature.
- **Loged-in USER USER_NAME display**
  - Display the name of logged-in USER on TOP page feature.
- **Dark THEME and Light THEME**
  - Dark THEME feature.
  - Light THEME feature.


## CHARTER:

- **USER**:
  - One who has ceated an account in BLOGGER.
  - One with the authority to CREATE a BLOG
- **USER_ID**:
  - A valid user's ID(unique).
- **BLOG** :
  - The information releted to the BLOG and the content of the BLOG itself.
- **BLOG_RIGHTS** :
  - Authority to DELETE the BLOG
  - Authority to EDIT the BLOG
- **CREATE**:
  - Creation of a BLOG
- **VIEW**:
  - Viwing of a BLOG
- **DELETE**:
  - Deletion the BLOG
- **UPDATE**:
  - Updating a BLOG
- **TOP**:
  - The main page where all the BLOGs can be viewed and managed.
