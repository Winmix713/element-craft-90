# PropertyInspector - Complete Testing & Verification Checklist

## Overview
This document lists all manual testing scenarios for the PropertyInspector component after optimization.

---

## 1. EDIT Tab Functionality

### 1.1 Breakpoint Selection
- [ ] Click "AUTO" - state updates to 'auto'
- [ ] Click "MD" - state updates to 'md'
- [ ] Click different breakpoints - visual indicator changes
- [ ] Breakpoint label updates correctly
- [ ] Breakpoint changes affect Tailwind class generation

### 1.2 Accordion Sections
- [ ] Family Elements section expands/collapses
- [ ] Link section expands/collapses
- [ ] Text Content section expands/collapses
- [ ] All sections open on first load
- [ ] Accordion state toggles correctly

### 1.3 Link Input
- [ ] Type "/page" - state updates after debounce
- [ ] Clear input - link becomes empty
- [ ] Link value persists after switching tabs
- [ ] Code tab reflects link changes

### 1.4 Text Content
- [ ] Type "New Text" - state updates after debounce
- [ ] Changes visible in CODE tab
- [ ] Multi-line text works correctly
- [ ] Special characters handled properly

### 1.5 Tailwind Classes
- [ ] Textarea displays current classes
- [ ] Changes to input update state
- [ ] Classes properly formatted in CODE tab
- [ ] CLASS syntax is preserved

### 1.6 Margin/Padding Inputs
- [ ] Type values (L, T, R, B) - debounced update
- [ ] Empty values handled correctly
- [ ] Values less than 10 display properly
- [ ] Changes reflected in Tailwind generation

### 1.7 Size Inputs
- [ ] Width input updates state
- [ ] Height input updates state
- [ ] Max-width input updates state
- [ ] Max-height input updates state

### 1.8 Typography Section
- [ ] Font family dropdown selects different fonts
- [ ] Font size input accepts numeric values
- [ ] Font weight dropdown updates correctly
- [ ] Letter spacing dropdown works
- [ ] Changes reflected in CODE tab

### 1.9 Color Picker
- [ ] Click color button opens popover
- [ ] Color can be selected from picker
- [ ] Color can be typed as hex
- [ ] Preset colors can be selected
- [ ] Clear button removes color
- [ ] Color persists on tab switch

### 1.10 Slider Inputs
- [ ] Move slider - value updates smoothly
- [ ] Value label updates in real-time
- [ ] Min/max boundaries respected
- [ ] Transform sliders (Translate X, Y) work
- [ ] Rotation slider works
- [ ] Scale slider works
- [ ] 3D Transform sliders work

---

## 2. CODE Tab Functionality

### 2.1 Monaco Editor
- [ ] HTML code displays properly
- [ ] Syntax highlighting works
- [ ] Code is readable and properly formatted
- [ ] Editor auto-sizes to content
- [ ] Scrolling works within editor

### 2.2 Dark/Light Mode
- [ ] Monaco theme matches app theme
- [ ] Switching between light/dark works
- [ ] Editor updates theme correctly

### 2.3 Copy Button
- [ ] Click copy button - code copied
- [ ] Toast notification appears
- [ ] Copied code includes full markup
- [ ] Multiple copies work

### 2.4 Reset Button
- [ ] Click Reset - code reverts to generated
- [ ] Button disabled when no changes
- [ ] "Unsaved changes" indicator clears

### 2.5 Apply Button
- [ ] Click Apply - changes update state
- [ ] Tailwind classes extracted correctly
- [ ] Text content extracted correctly
- [ ] EDIT tab updates with changes
- [ ] Success toast appears
- [ ] Button disabled when no changes

### 2.6 Code Parsing
- [ ] HTML with classes parsed correctly
- [ ] Text content between tags extracted
- [ ] Links parsed properly
- [ ] Complex classes handled
- [ ] Invalid HTML shows error gracefully

### 2.7 Change Detection
- [ ] "No changes" shows by default
- [ ] "Unsaved changes" appears when editing
- [ ] Status updates in real-time
- [ ] Color indicates change status

---

## 3. PROMPT Tab Functionality

### 3.1 Text Input
- [ ] Type prompt text - input captures
- [ ] Multi-line prompts work
- [ ] Submit button disabled when empty
- [ ] Clear button appears correctly

### 3.2 AI Models
- [ ] Model dropdown opens
- [ ] Gemini Flash selectable
- [ ] Gemini Pro selectable
- [ ] GPT-5 selectable
- [ ] GPT-5 Mini selectable
- [ ] Model change persists

### 3.3 Prompt Templates
- [ ] Wand button opens templates
- [ ] "Make responsive" template selectable
- [ ] "Add hover effect" template selectable
- [ ] "Dark mode" template selectable
- [ ] "Add animation" template selectable
- [ ] "Glassmorphism" template selectable
- [ ] Template text populates input

### 3.4 Streaming Response
- [ ] Submit prompt - request starts
- [ ] Loading spinner appears
- [ ] Response streams in real-time
- [ ] Buttons disabled during loading
- [ ] Response displays correctly

### 3.5 AI Response Handling
- [ ] Valid JSON response applies changes
- [ ] Tailwind classes update
- [ ] Text content updates
- [ ] Toast shows success
- [ ] Response clears after applying

### 3.6 Error Handling
- [ ] Rate limit (429) shows error message
- [ ] Payment required (402) shows error message
- [ ] Network errors handled gracefully
- [ ] Invalid API response shows error
- [ ] Retry works after error

### 3.7 File Attachment (Future)
- [ ] Paperclip button present (disabled)
- [ ] Figma button present (disabled)
- [ ] Proper "Coming soon" indication

---

## 4. Header Buttons

### 4.1 Undo Button
- [ ] Disabled initially
- [ ] Enabled after making changes
- [ ] Reverts to previous state
- [ ] Multiple undos work
- [ ] Tooltip shows "Undo last change"

### 4.2 Select Mode Button
- [ ] Button present and clickable
- [ ] Tooltip shows "Select Mode"

### 4.3 Save Button
- [ ] Click exports configuration
- [ ] JSON file downloads
- [ ] File properly named with timestamp
- [ ] Configuration contains all state

### 4.4 More Options Menu
- [ ] Menu opens on click
- [ ] Export JSON option works
- [ ] Import Configuration option works
- [ ] Copy as Tailwind option works
- [ ] Copy as Code option works
- [ ] Reset All option works
- [ ] Reset confirmation/alert works

### 4.5 Close Button
- [ ] Panel closes when clicked
- [ ] State persists in localStorage
- [ ] Panel can be reopened

---

## 5. Cross-Tab Synchronization

### 5.1 EDIT → CODE
- [ ] Change text in EDIT → CODE updates
- [ ] Change classes in EDIT → CODE updates
- [ ] Change size in EDIT → CODE updates
- [ ] Change color in EDIT → CODE updates
- [ ] All transforms reflected in CODE

### 5.2 CODE → EDIT
- [ ] Modify code classes → EDIT tab updates
- [ ] Modify text in code → EDIT updates
- [ ] Apply button updates state
- [ ] Generated code matches state

### 5.3 PROMPT → EDIT/CODE
- [ ] AI changes update EDIT tab
- [ ] AI changes update CODE tab
- [ ] Classes updated correctly
- [ ] Text content updated correctly

### 5.4 State Persistence
- [ ] Refresh page → state recovers
- [ ] Position recovers after refresh
- [ ] All values preserved
- [ ] localStorage intact

---

## 6. Drag & Drop

### 6.1 Panel Movement
- [ ] Panel can be dragged
- [ ] Drag handle works
- [ ] Position updates during drag
- [ ] Position saves after drop

### 6.2 Boundaries
- [ ] Panel stays within viewport
- [ ] Can't drag off screen
- [ ] Right edge boundary respected
- [ ] Bottom edge boundary respected

### 6.3 Position Persistence
- [ ] Position saved to localStorage
- [ ] Refreshed position recovers
- [ ] Reset option available

---

## 7. Performance Tests

### 7.1 Rendering
- [ ] Tab switches smoothly
- [ ] No lag when typing
- [ ] Sliders respond immediately
- [ ] Color picker opens quickly

### 7.2 Memory
- [ ] No memory leaks after long use
- [ ] Fast after 50+ state updates
- [ ] Tab switching remains smooth

### 7.3 Input Debouncing
- [ ] Rapid text input doesn't cause lag
- [ ] State updates batched efficiently
- [ ] localStorage writes debounced

---

## 8. Accessibility

### 8.1 Keyboard Navigation
- [ ] Tab key navigates between controls
- [ ] Enter key activates buttons
- [ ] Space key activates toggles
- [ ] Escape closes menus/popovers

### 8.2 ARIA Labels
- [ ] Buttons have aria-label
- [ ] Sliders have aria-valuemin, aria-valuemax, aria-valuenow
- [ ] Tabs have aria-selected
- [ ] Form inputs have labels

### 8.3 Visual Indicators
- [ ] Buttons have focus outline
- [ ] Current tab highlighted
- [ ] Disabled buttons appear disabled
- [ ] Sliders show progress visually

---

## 9. Browser Compatibility

### 9.1 Chromium Browsers
- [ ] Chrome - all features work
- [ ] Edge - all features work
- [ ] Brave - all features work

### 9.2 Firefox
- [ ] All features work
- [ ] Sliders work correctly
- [ ] Color picker works

### 9.3 Safari
- [ ] All features work
- [ ] Drag & drop works
- [ ] Monaco editor renders

---

## 10. Export/Import

### 10.1 Export JSON
- [ ] Click Save → download starts
- [ ] File contains all state
- [ ] File is valid JSON
- [ ] Filename includes timestamp

### 10.2 Import JSON
- [ ] Select exported file → state loads
- [ ] All values restored
- [ ] Page reloads
- [ ] State persists

### 10.3 Copy Operations
- [ ] Copy Tailwind → clipboard updated
- [ ] Copy Code → clipboard updated
- [ ] Toast confirms copy
- [ ] Can paste elsewhere

---

## 11. Error Handling

### 11.1 Invalid Input
- [ ] Invalid CSS handled gracefully
- [ ] Empty values don't crash
- [ ] Large values handled
- [ ] Special characters work

### 11.2 Network Errors
- [ ] Failed API calls show error
- [ ] Can retry after error
- [ ] Error messages clear
- [ ] UI remains responsive

### 11.3 Storage Errors
- [ ] localStorage quota exceeded handled
- [ ] Falls back to in-memory state
- [ ] No crashes

---

## Test Results Summary

| Category | Status | Notes |
|----------|--------|-------|
| EDIT Tab | ⬜ | [ ] Pass / [ ] Fail |
| CODE Tab | ⬜ | [ ] Pass / [ ] Fail |
| PROMPT Tab | ⬜ | [ ] Pass / [ ] Fail |
| Headers | ⬜ | [ ] Pass / [ ] Fail |
| Sync | ⬜ | [ ] Pass / [ ] Fail |
| Drag Drop | ⬜ | [ ] Pass / [ ] Fail |
| Performance | ⬜ | [ ] Pass / [ ] Fail |
| Accessibility | ⬜ | [ ] Pass / [ ] Fail |
| Browser Compat | ⬜ | [ ] Pass / [ ] Fail |
| Import/Export | ⬜ | [ ] Pass / [ ] Fail |
| Error Handling | ⬜ | [ ] Pass / [ ] Fail |

---

## Known Issues / Notes

- [ ] File attachment (coming soon)
- [ ] Figma integration (coming soon)
- [ ] Canvas element selector (coming soon)

---

## Sign-off

- **Date**: ___________
- **Tester**: ___________
- **Status**: ⬜ READY FOR PRODUCTION / ⬜ NEEDS FIXES

