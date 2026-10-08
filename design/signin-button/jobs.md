# Sign-in button: jobs and flows

What the design has to let people do. If any of this is wrong or missing,
say so.

## Who
- **You and Erica**: the only two people who can sign in.
- **Visitors**: people you send the playground link to. They can change
  anything there, but nothing is kept, and they can't sign in.

## Jobs

1. **Find sign-in without opening anything.** The words "sign in" are on
   the button itself, one tap away, with no menu first.
2. **Tell at a glance that you're signed out.** Signed out looks different
   from the signed-in account badge (navy with an orange person).
3. **Sign in from the playground and end up in the real trip, signed in.**
4. **Keep it quiet.** The sign-in button is secondary: it never looks louder
   than the + button, on a light or dark map.
5. **Signed in, the account badge is where sign-in was.** It's the same navy
   badge with the orange person as today (it turns orange only while its menu is open), with the same menu (email, and Logout, renamed Sign out), and nothing moves.
6. **A visitor who taps it isn't stuck or punished.** *(inferred)* They
   read why they can't sign in, tap Keep playing, and lose nothing.
7. **Nothing you were doing is lost by surprise.** *(inferred)* Backing out
   loses nothing; the sheet says before you sign in that playground changes
   won't be kept.
8. **Land where you were.** *(inferred)* After signing in from the
   playground, the real trip opens on the same spot on the map (if that's
   cheap to build; if it isn't, you'll be told, not surprised).
9. **Easy to tap on a phone**, even though the drawing is small.
   *(inferred)*

## Flows

**Sign in from the playground**
1. Tap the sign-in button (top right, left of +).
2. The sign-in sheet opens over the playground. Everything behind it stays
   as it was.
3. The sheet reads **Sign in**, then one line: *"Only the trip's owners can
   sign in. Your changes here won't be kept."* Then email, password, and
   **Sign in** / **Keep playing**.
4. Tap Sign in. The button reads "Signing in…" and can't be tapped twice.
5. If it works, the real trip opens and the button turns into your navy account
   badge with a short stamp animation, so you see it change.
   - Wrong email or password: *"That email and password don't match."*
     You stay in the sheet, the email is kept and the password cleared.
   - No connection: *"Can't reach the sign-in server. Check your
     connection."* The playground keeps working.

**Back out**: Keep playing, tap outside the sheet, or Esc. The sheet closes
and nothing is lost.

**Sign out (real trip)**: account badge, then Sign out. The navy dries away
and the sign-in button is left in its place. *(That's if Q1 is yes.)*

**Edit while signed out (real trip)**: the same as today, but it says "sign
in", not "log in".

## Questions for you

- **Q1. When you're signed out of the real trip (new phone, cleared
  Safari), should the same sign-in button sit in that corner?** Today
  nothing is there until you try to edit. *We recommend yes*: one button,
  two states, everywhere. If no, signing out leaves the corner empty.
- **Q2. Is the one line in the sign-in sheet enough to tell visitors their
  changes aren't kept, or do you want something on the map too?**

## Notes for whoever builds it (not for the owner to judge)
- The corner stays empty until the app knows whether you're signed in, so
  the sign-in button never flashes before your account badge on load.
- The arrival animation plays once, only right after a playground sign-in.
  It doesn't play on a reload or under Reduce Motion, and never when the
  sign-in didn't actually stick.
- Anywhere the app says "log in" now says "sign in".
