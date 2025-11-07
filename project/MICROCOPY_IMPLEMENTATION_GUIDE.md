# Microcopy Implementation Guide

## Quick Reference for Developers

This guide helps you write clear, effective microcopy throughout the application.

---

## 1. Button Labels

### Formula: **Outcome + Context (optional)**

```tsx
// ❌ BAD - Vague action
<button>Submit</button>
<button>Get Started</button>
<button>Continue</button>

// ✅ GOOD - Clear outcome
<button>Create My Account</button>
<button>Calculate My Macros</button>
<button>Build Your First Meal</button>

// ✅ GREAT - Outcome + time context
<button>Find Your Perfect Calories (2 min)</button>
<button>Save Changes</button>
<button>Start Your Free Trial</button>
```

### Button Label Checklist:
- [ ] Describes the outcome, not the action
- [ ] Uses "your/my" for personalization
- [ ] Includes time estimate if >1 minute
- [ ] Under 5 words (unless adding time context)
- [ ] Action-oriented verb (Create, Find, Build, Start)

---

## 2. Form Field Labels & Helper Text

### Pattern: Label + Helper Text Below

```tsx
// ❌ BAD - No context
<input
  label="Email"
  placeholder="email@example.com"
/>

// ✅ GOOD - Context provided
<SmartInput
  label="Email Address"
  placeholder="yourname@example.com"
  helperText="We'll never share your email or spam you"
/>

// ✅ GREAT - Purpose explained
<SmartInput
  label="Email Address"
  placeholder="yourname@example.com"
  helperText="We need this to send your meal confirmations"
  validate={validators.email}
/>
```

### Helper Text Guidelines:

**DO Write:**
- Why you need the information
- What format is expected
- What will happen with the data
- Time estimates for the step

**DON'T Write:**
- Technical jargon
- Threatening language
- Vague statements
- Redundant information already in label

### Examples by Field Type:

```tsx
// Email Field
helperText="We'll respond within 24 hours"
helperText="We need this to send your meal confirmations"

// Password Field (signup)
helperText="At least 6 characters (8+ recommended for security)"

// Phone Field (optional)
helperText="Optional - for faster response"
helperText="We'll only use this for urgent order updates"

// Range Slider
helperText="Most athletes need 400-800 kcal per meal"
helperText="Recommended: 0.7-1g protein per lb body weight"
```

---

## 3. Error Messages

### Use the Error Message Helper

```tsx
import { getAuthErrorMessage, getFormErrorMessage } from '../utils/errorMessages';

// Authentication Errors
const handleAuthError = (error: any) => {
  const friendly = getAuthErrorMessage(error.message);
  setError({
    message: friendly.message,
    action: friendly.action
  });
};

// Form Field Errors
const validateField = (field: string, value: string) => {
  const error = validators[field](value);
  if (error) {
    return getFormErrorMessage(field, value, error);
  }
  return null;
};
```

### Error Message Structure:

```tsx
// ✅ GOOD - Clear problem + solution
{
  message: "Email or password doesn't match.",
  action: "Double-check your info or reset your password."
}

// ✅ GOOD - Specific guidance
{
  message: "This email is already registered.",
  action: "Try logging in instead?",
  actionLink: "switch-to-login"
}
```

### Error Message Rules:

1. **Be Specific**: Tell exactly what's wrong
2. **Be Helpful**: Suggest how to fix it
3. **Be Friendly**: No blaming or technical jargon
4. **Be Actionable**: Include next steps or links

---

## 4. Success Messages

### Use the Success Message Helper

```tsx
import { getSuccessMessage } from '../utils/errorMessages';

// After successful action
const handleSuccess = (action: string, context?: any) => {
  const message = getSuccessMessage(action, context);
  showNotification(message);
};

// Examples:
getSuccessMessage('signup', { name: 'John' })
// "Welcome to House of Macros, John! Let's build your first meal."

getSuccessMessage('contact')
// "Got it! We'll reply within 24 hours (usually much faster)."

getSuccessMessage('calculation')
// "Perfect! Here's your personalized nutrition plan."
```

### Success Message Formula:

**Confirmation + Next Step + (Optional) Timeframe**

```tsx
// ❌ BAD
"Success!"
"Saved."

// ✅ GOOD
"Message sent! We'll reply within 24 hours."
"Meal saved to your dashboard!"

// ✅ GREAT
"Welcome to House of Macros, Sarah! Let's build your first meal."
"Perfect! Here's your personalized plan for gaining muscle."
```

---

## 5. Loading States

### Use Context-Specific Loading Messages

```tsx
import { getLoadingMessage } from '../utils/errorMessages';

// During async operation
setLoading(true);
const message = getLoadingMessage('signing-in');
// "Logging you in..."

// Available loading messages:
getLoadingMessage('auth-check')      // "Checking your account..."
getLoadingMessage('signing-in')      // "Logging you in..."
getLoadingMessage('signing-up')      // "Creating your account..."
getLoadingMessage('calculating')     // "Calculating your perfect macros..."
getLoadingMessage('loading-dashboard') // "Loading your meals..."
```

### Loading State Best Practices:

```tsx
// ❌ BAD - Generic
{loading && <Spinner />}
{loading && <p>Loading...</p>}

// ✅ GOOD - Specific context
{loading && (
  <div className="loading-state">
    <Spinner />
    <p>{getLoadingMessage('calculating')}</p>
  </div>
)}

// ✅ GREAT - With progress indication
{loading && (
  <div className="loading-state">
    <Spinner />
    <p>Calculating your perfect macros...</p>
    <p className="text-sm text-gray-400">Analyzing your activity level...</p>
  </div>
)}
```

---

## 6. Empty States

### Formula: Question/Statement + Explanation + Primary Action + (Optional) Secondary Action

```tsx
// ❌ BAD - Negative framing
<div>
  <p>You haven't created any meals yet</p>
  <button>Create Meal</button>
</div>

// ✅ GOOD - Positive framing
<div className="empty-state">
  <ChefHat className="w-20 h-20 text-amber-400" />
  <h3>Ready to build your first perfect meal?</h3>
  <p>It takes just 5 minutes to create a meal that hits your macros perfectly.</p>
  <button className="primary">Build Your First Meal →</button>
  <button className="secondary">Or Browse Signature Meals</button>
</div>

// ✅ GREAT - With value proposition
<div className="empty-state">
  <Icon />
  <h3>No meals yet? Let's change that!</h3>
  <p>Create custom meals tailored to your goals in just 5 minutes.</p>
  <ul>
    <li>✓ AI-suggested ingredients</li>
    <li>✓ Perfect macro balance</li>
    <li>✓ Your favorite cuisines</li>
  </ul>
  <button>Build Your First Meal →</button>
</div>
```

### Empty State Checklist:
- [ ] Positive, encouraging tone (not "You haven't...")
- [ ] Clear benefit or value proposition
- [ ] Time estimate if applicable
- [ ] Primary action is obvious
- [ ] Optional secondary action provided
- [ ] Relevant icon or illustration

---

## 7. Section Headers & Descriptions

### Pattern: Question or Benefit-Driven Statement + Why It Matters

```tsx
// ❌ BAD - Generic labels
<FormSection
  title="Your Details"
  description="Enter your information"
/>

// ✅ GOOD - Engaging question
<FormSection
  title="Tell Us About Yourself"
  description="This helps us calculate your perfect daily calories and protein"
/>

// ✅ GREAT - Benefit-driven
<FormSection
  title="How Active Are You?"
  description="More activity = more calories needed for recovery and performance"
/>
```

### Examples by Context:

```tsx
// Calculator Steps
title: "What's Your Goal?"
description: "We'll adjust your calories to help you get there safely"

title: "How Active Are You?"
description: "Different activity levels need different fuel"

// Meal Builder Steps
title: "What Are You Training For?"
description: "Different sports need different macro ratios"

title: "Pick Your Cuisine & Ingredients"
description: "AI suggests the best ingredients for your goals"

// Settings Sections
title: "Email Preferences"
description: "Choose what you want to hear about"

title: "Delivery Settings"
description: "Set your preferred delivery times and address"
```

---

## 8. Placeholder Text

### Rules:
1. Never use placeholder as label (accessibility issue)
2. Show format example or helpful hint
3. Keep it short and scannable
4. Match the tone of your app

```tsx
// ❌ BAD - Placeholder as label
<input placeholder="Email" />

// ❌ BAD - Too specific/long
<input
  label="Email"
  placeholder="john.doe@company.com (we'll send confirmation here)"
/>

// ✅ GOOD - Format example
<input
  label="Email Address"
  placeholder="yourname@example.com"
  helperText="We'll send your meal confirmations here"
/>

// ✅ GOOD - Helpful hint
<input
  label="Phone Number"
  placeholder="+1 234-567-8900"
  helperText="Optional - for urgent order updates only"
/>

<textarea
  label="Message"
  placeholder="What can we help you with?"
  helperText="We typically respond within 24 hours"
/>
```

---

## 9. Navigation Labels

### Main Navigation Guidelines:

```tsx
// ❌ BAD - Vague or inconsistent
"Home"
"Start"
"Meals"
"Prices"

// ✅ GOOD - Clear and consistent
"Home"
"Calculate Macros"    (badge: "Start Here")
"Build Your Meal"     (badge: "Step 2")
"Signature Meals"
"Plans & Pricing"

// ✅ GREAT - With helpful badges
{
  name: "Start Here",
  path: "calculator",
  badge: "Step 1",
  description: "2-min macro calculator"
}
```

### Mobile Menu Quick Actions:

```tsx
// ✅ GOOD pattern
{
  label: "New? Start Here →",
  description: "2-min nutrition calculator",
  icon: Calculator
}

{
  label: "Build a Meal →",
  description: "Create your custom meal",
  icon: Utensils
}
```

---

## 10. Confirmation Dialogs

### Pattern: Short Question + Explanation + Two Clear Choices

```tsx
// ❌ BAD - Unclear consequences
{
  title: "Are you sure?",
  message: "This action cannot be undone.",
  actions: ["Cancel", "OK"]
}

// ✅ GOOD - Clear consequences
{
  title: "Discard changes?",
  message: "You have unsaved changes. They'll be lost if you leave now.",
  actions: {
    primary: "Stay and Save",
    secondary: "Leave Without Saving"
  }
}

// ✅ GREAT - With impact explanation
{
  title: "Delete this meal?",
  message: "This will permanently remove 'Chicken Power Bowl' from your saved meals. You can always create it again later.",
  actions: {
    danger: "Yes, Delete Meal",
    safe: "No, Keep It"
  }
}
```

### Confirmation Dialog Rules:
1. Title is a question (max 5 words)
2. Message explains consequences clearly
3. Primary action describes what happens
4. Secondary action is equally clear
5. Destructive actions use "danger" styling
6. Reversible actions mention how to undo

---

## Common Patterns by Page

### Home Page
- Hero CTA: "Find Your Perfect Calories" or "Calculate My Macros"
- Secondary CTA: "Browse Chef Meals"
- Section headers: Benefit-driven, engaging
- Features: Value propositions, not feature lists

### Auth Page
- Tab Labels: "Log In" / "Sign Up"
- Button: "Log In" / "Create My Account"
- Errors: Friendly with next steps
- Helper text: Why you need the info

### Calculator Page
- Page title: "Find Your Perfect Macros"
- Section titles: Questions ("What's Your Goal?")
- Descriptions: Why it matters
- Final CTA: "See My Results"
- Results: "Perfect! Here's your plan."

### Meal Builder
- Step titles: Action-oriented questions
- AI suggestions: Specific recommendations
- Macro progress: Encouraging feedback
- Final CTA: "Choose Your Plan"

### Dashboard
- Welcome: "Welcome back, [Name]!"
- Empty state: Positive question + time estimate
- Stats: Clear labels with context
- Actions: Specific outcomes

### Contact Form
- Page title: "Get In Touch"
- Description: When to expect response
- Helper text: Response time
- Success: Confirmation + timeframe

---

## Testing Your Microcopy

### Questions to Ask:

1. **Is it clear?**
   - Would a new user understand it without context?
   - Is there any jargon or ambiguity?

2. **Is it specific?**
   - Does it tell exactly what will happen?
   - Are there concrete details (time, outcome)?

3. **Is it helpful?**
   - Does it guide the user to success?
   - Are errors actionable?

4. **Is it consistent?**
   - Does it match the app's tone?
   - Is similar content written similarly?

5. **Is it concise?**
   - Can you remove words without losing meaning?
   - Is every word earning its place?

---

## Quick Wins Checklist

Start here for immediate impact:

- [ ] Replace "Submit" with specific action ("Create Account", "Send Message")
- [ ] Add helper text to all form fields
- [ ] Make error messages friendly and actionable
- [ ] Add success confirmations after actions
- [ ] Update loading states with context
- [ ] Rewrite empty states positively
- [ ] Add time estimates to long actions
- [ ] Include "why" in data collection
- [ ] Make CTAs outcome-focused
- [ ] Test with a non-technical user

---

## Before You Ship

Run through this checklist for any new UI:

### Buttons
- [ ] Label describes outcome, not action
- [ ] Includes time estimate if >1 min
- [ ] Uses "you/your" appropriately
- [ ] Under 5 words (unless adding context)

### Forms
- [ ] Every field has a label
- [ ] Helper text explains why/format
- [ ] Errors are specific and actionable
- [ ] Success states are encouraging
- [ ] Loading messages are contextual

### Content
- [ ] Headers are engaging, not generic
- [ ] Descriptions explain benefits
- [ ] Empty states are positive
- [ ] Confirmations are clear
- [ ] Tone is consistent throughout

---

## Resources

- **Error Messages**: `src/utils/errorMessages.ts`
- **Validators**: `src/utils/validators.ts`
- **Components**: `src/components/SmartInput.tsx`, `FormSection.tsx`
- **Full Analysis**: `MICROCOPY_ANALYSIS.md`

Remember: Every word is an opportunity to guide, reassure, or delight your users. Make them count!
