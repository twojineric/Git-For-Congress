# Congress In Context
Created for LA Hacks 2021

Bills passed by Congress are frequently long, confusing and hard to read. This web app puts these Bill changes in context.

Take this example from HR1 - 115th Congress:
```
(a)  In General.—Subsection (b) of section 11 is amended to read as follows:

“(b)  Amount Of Tax.—The amount of the tax imposed by subsection (a) shall be 21 percent of taxable income.”.
```
What was the original text of section 11(b)? From this example alone there is no way to determine if this lowered, raised or simply shifted around the tax brackets.

Run `npm install` to install all dependencies, then run `npm start` and navigate to `http://localhost:3000/`.

Due to the non-standardized nature of congressional bills, use cases are limited.

Go to congress.gov to lookup the bill text of your choice. When mousing over certain sections, click the "share this" to copy the deep link to your clipboard. Paste this URL in the "id" section and click submit.

Please Note: The highlighted section must have a blue hyperlink for this app to work!
