# Concise Home copy

Updated November 8, 2026.

Removed the duplicate CWRU Connect eyebrow and the entire Your interests chip row from the Home hero. The heading is now "Find research today", supporting copy is "Find research roles and connect with labs.", and the input placeholder is "Search roles or labs" with an accessible "Search research" label.

Removed obsolete interest-row handlers and styles. Browser checks confirmed the page starts successfully, hero search returns the expected genetics position, removed labels are absent, and mobile has no horizontal overflow. Navigation syntax and diff checks passed. Code review found no actionable issues.

Preview: artifacts/showcase/concise-home.png.

## Balanced follow-up

The user preferred a fuller headline and less empty space. The headline now reads "Find your next research opportunity" across two deliberate lines on desktop. The hero is 480px tall, with centered content and 72px vertical padding; tablet padding is 64px and mobile retains its content-driven height. The search gap was reduced to 28px. Removed eyebrow, interests, and recommendation overlay remain absent. Browser checks found no desktop or mobile horizontal overflow; code review found no issues. Preview: artifacts/showcase/balanced-home.png.
