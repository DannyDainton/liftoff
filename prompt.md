I want to create a learning app, which takes the contents of this page https://artemis.up.railway.app/guide/workshop  and uses postman's api to validate the completion of each step. 

Take this page, convert it into a markdown file, with Parts = lesson, and steps = steps. This will be the standard learning module format you use. Call this module Artemis Mission Control

For each exercise, I want a "validate" button which queries the postman api to look at your workspace and verify the instructions were completed. If successful, awards you 10 points.

At the end of the tutorial, based on points, award you a rank with a badge / icon. 

To get started, implement lesson 1, Git Native API, and the 4 steps. 

Before begining any module, the learner must authenticate with postman, so you can validate the learnings through the API

PMAK-69efba73183a2e0001db6579-fca03e23b274eeebbba09bd82817873596


--- import module

Create a skill /liftoff-import that takes a url of existing tutorial and converts it to a content.md, performs a review to see if it has everything it needs to create a module, and if so, create the module.json.

The skill should look for typical things like title, steps, and determine validations required to verify learning.

Once it creates the content.json it should give a review summary to the user, highlighting gaps or more info required, or if it has sufficient information, automatically go ahead and create the module.json. 



--- Pooja Notes
step 2.3: instructions are a little vague
step 2.4: i tried to run fromAccount. It's set to POST. I run the GET. It never added to variables or local vault. need to tell validator that its referring to a vault so it uses the existing validator.
2.5 same problems as 2.4
steps 3.1 till the end are manual validators. It would be good to change these to test something where we can. 
3.2 tests run but some fail. it looks like you have to specify an execution order. 