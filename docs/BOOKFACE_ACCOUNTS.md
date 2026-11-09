# Bookface member account setup

Bookface uses an approved-member registry. Members sign in with their **own email address and their own password**. There is no public self-registration.

## Add another member

1. Prepare the member's founder profile first and note its `founderId` from the founder directory data.
2. Generate a PBKDF2-SHA512 password hash locally. Use a random 16-byte salt, 310,000 iterations, and a 64-byte derived key. Store the hash in this exact format:

   `pbkdf2$310000$<salt-hex>$<derived-key-hex>`

   Never put a plaintext password in GitHub, source code, a chat, or a Vercel environment variable.
3. In Vercel, add or update the **sensitive** environment variable `BOOKFACE_ACCOUNTS_JSON` for Production, Preview, and Development. Its value must be a JSON array. Add one object per member:

   ```json
   [
     {
       "email": "founder@example.com",
       "passwordHash": "pbkdf2$310000$<salt-hex>$<derived-key-hex>",
       "founderId": "founder-record-id",
       "name": "Founder Name",
       "linkedinUrl": "https://www.linkedin.com/in/example"
     }
   ]
   ```

4. Redeploy the project so the new account is available. The member then signs in with their own email and password.

The existing first account remains supported by the legacy Vercel variables `BOOKFACE_LOGIN_EMAIL` and `BOOKFACE_LOGIN_PASSWORD_HASH`. Entries in `BOOKFACE_ACCOUNTS_JSON` override a legacy entry with the same email. A member with no `founderId` can sign in but sees an account-not-linked notice instead of another member's profile.

## Security notes

- The registry is server-only. Do not add it to a `NEXT_PUBLIC_*` variable.
- Removing a registry entry prevents new logins and invalidates that account's session on its next request.
- Password hashes are PBKDF2-SHA512; passwords are not stored in plaintext.
- HTTPS protects traffic in transit. It is not end-to-end encryption.
- The current Messages page stores drafts in the current browser only; it does not deliver messages to another member. Proper end-to-end encryption requires real recipient-to-recipient message delivery, per-member public/private keys, and a key recovery / device-enrollment design. Do not describe the local draft feature as encrypted messaging.
- Account invitations and sending onboarding emails are not automated yet. An administrator must provision each approved member in the registry.