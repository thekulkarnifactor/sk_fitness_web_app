# Microcopy Quick Reference Card

Print this out and keep it handy when writing user-facing text!

---

## The Golden Rules

1. **Specific > Vague**: "Find Your Perfect Calories" not "Get Started"
2. **Outcome > Action**: "Create My Account" not "Submit"
3. **You > We**: "Build Your Meal" not "Meal Builder"
4. **Help > Blame**: "Email doesn't match" not "Invalid credentials"
5. **Short > Long**: Remove every unnecessary word

---

## Button Labels Cheat Sheet

### Formula: **Verb + Outcome + (Time if >1 min)**

✅ DO:
- Find Your Perfect Calories (2 min)
- Create My Account
- Build Your First Meal
- See My Results
- Start Your Free Trial

❌ DON'T:
- Get Started
- Submit
- Continue
- Click Here
- Learn More

---

## Form Fields Quick Check

### Every field needs:
- [ ] Clear label (not just placeholder)
- [ ] Helper text (why you need it)
- [ ] Friendly error message
- [ ] Success indicator

### Helper Text Templates:
```
"We need this to [reason]"
"We'll respond within [timeframe]"
"Most [users] choose [range]"
"Recommended: [guidance]"
"Optional - [benefit if provided]"
```

---

## Error Messages Formula

### Structure: **Problem + Solution + (Help Link)**

✅ GOOD:
```
"Email or password doesn't match.
Try again or reset your password."
```

✅ GREAT:
```
"This email is already registered.
Try logging in instead? [Switch to login]"
```

❌ BAD:
```
"Error: Invalid credentials"
"Something went wrong"
"Authentication failed"
```

---

## Success Messages Formula

### Structure: **Confirmation + Next Step + (Timeframe)**

✅ Examples:
```
"Welcome, Sarah! Let's build your first meal."
"Message sent! We'll reply within 24 hours."
"Perfect! Here's your personalized plan."
"Account created! Check your email for confirmation."
```

---

## Loading Messages

### Never just "Loading..." - Add context!

```
"Checking your account..."
"Logging you in..."
"Calculating your perfect macros..."
"Loading your meals..."
"Sending your message..."
```

---

## Empty States

### Pattern: **Positive Question + Benefit + CTA**

✅ DO:
```
"Ready to build your first meal?
It takes just 5 minutes.
[Build Your First Meal →]"
```

❌ DON'T:
```
"No meals found"
"You haven't created any meals yet"
```

---

## Section Headers

### Pattern: **Question or Benefit + Why It Matters**

✅ Examples:
```
"Tell Us About Yourself"
→ "This helps us calculate your perfect calories"

"How Active Are You?"
→ "More activity = more calories needed"

"What's Your Goal?"
→ "We'll adjust your plan to help you get there"
```

---

## Time Indicators

### Always show if action takes >1 minute

```
(2 min)      - Calculator
(5 min)      - Meal builder
(30 sec)     - Form submission
Within 24h   - Email response
Instant      - Search results
```

---

## Tone Checklist

### ✅ DO Use:
- You, Your (user-focused)
- Conversational language
- Specific numbers/times
- Positive framing
- Action verbs
- Plain English

### ❌ DON'T Use:
- We, Our (unless necessary)
- Corporate jargon
- "Just", "Simply" (condescending)
- Negative framing
- Passive voice
- Technical terms

---

## Before You Ship Checklist

### Buttons:
- [ ] Describes outcome, not action?
- [ ] Under 5 words (unless adding time)?
- [ ] Uses "your/my" appropriately?
- [ ] Specific and clear?

### Forms:
- [ ] Every field has label + helper text?
- [ ] Errors are friendly and actionable?
- [ ] Success states implemented?
- [ ] Loading messages contextual?

### Content:
- [ ] Headers engaging, not generic?
- [ ] Empty states positive?
- [ ] Tone consistent?
- [ ] User-focused language?

---

## Common Replacements

### Replace These:

| ❌ Bad | ✅ Good |
|--------|---------|
| Submit | Create My Account / Send Message |
| Get Started | Calculate My Macros / Start Here |
| Continue | See My Results / Next Step |
| Click Here | [Specific action] |
| OK | [Specific confirmation] |
| Cancel | Go Back / Never Mind |
| Your Details | Tell Us About Yourself |
| Settings | Preferences / My Settings |
| Error | [Specific problem] |
| Success | [Specific confirmation] |
| Loading | [Context-specific loading] |

---

## Quick Test Questions

Ask yourself:

1. **Would my mom understand this?** (Clarity)
2. **Does it tell me what happens next?** (Action)
3. **Does it explain why?** (Context)
4. **Is it encouraging?** (Tone)
5. **Can I remove any words?** (Conciseness)

If any answer is "no", rewrite it!

---

## Resources

- **Full Analysis**: `MICROCOPY_ANALYSIS.md`
- **Implementation Guide**: `MICROCOPY_IMPLEMENTATION_GUIDE.md`
- **Summary**: `MICROCOPY_IMPROVEMENTS_SUMMARY.md`
- **Code**: `src/utils/errorMessages.ts`

---

## Remember:

**Every word is an opportunity to:**
- Guide your user
- Build confidence
- Prevent confusion
- Create delight

Make them count! 🎯
