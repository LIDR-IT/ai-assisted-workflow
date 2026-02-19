# Product Requirements Doc

A Product Requirements Doc (PRD) outlines the who, what, why, when, and how of developing a product or feature. Expect to continuously update the PRD throughout the development lifecycle as new information is uncovered. This ClickUp template will help keep your product, design, and engineering teams aligned, facilitate long-term collaboration, and communicate priorities to those getting the work done.

# 🔑 Overview

Provide the key details in the table below.

| **Product Name**              | **User Account Management**                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| **ClickUp Project/Epic**      | _\[Link to the ClickUp location of the project/epic\]_            |
| **Team Channel**              | _\[Link to the collaboration group chat/channel, if applicable\]_ |
| **Product Manager**           | @mention the lead product manager                                 |
| **Designer**                  | @mention the lead designer                                        |
| **Engineer**                  | @mention the lead engineer                                        |
| **QA Engineer**               | @mention the lead QA engineer                                     |
| **Technical Writer**          | @mention the technical writer                                     |
| **Product Marketing Manager** | @mention the lead product marketer or marketing manager           |

Provide a brief description of what the product is and why is it important.

User Account Management provides administrators the ability to manage all the user accounts in their Workspace. They will be able to view, edit, search, and audit user accounts and account details from within the application. This is a critical component of the application because it enables our customers to self-service their accounts, which (1) will reduced the cost of our Support teams fielding these types of questions and requests, and (2) increase customer satisfaction.

Include any research metrics that support why this product should be prioritized.

After launching the application one year ago, we have found that 50% of customer support tickets are related to user account management. Within a 6-month timeframe, 65% of the responses from the in-app product survey highlight needing a way to administer their own accounts in a self-serve way.

# ⭐️ Goals & Success Metrics

What are the goals or objectives of this product? What are success metrics that indicate the goals have been achieved?

Reduce our operational costs and improve customer adoption of our application by enabling self-service of user account management.

- 100 fewer customer support tickets per month
- Increase in our customer experience score by 10 points within 6 months of launch
- Less than 50 bugs filed against the User Account Management product within a 3-month timeframe

# ❓ FAQ & Considerations

Use this subpage to document frequently asked questions that would be helpful for readers and any key decisions or considerations that have been made.

- **Will all Admins be able to edit user account?**

  No, only Admins with the specific permissions enabled will be able to edit user accounts.

- **Is there a limit to the number of Admins with edit user account permissions?**

  Yes, there will be a limit based on their subscription. See the subscription plans for more details.

- **Will training be delivered to sales and support teams to help with messaging this to existing clients?**

  Yes, there will be internal enablement material and training that will be delivered 1 month prior to launch. There will also be customer enablement materials automatically emailed to all admins.

## Key Decisions & Considerations

- Admins will not be able to merge user accounts. In our research, less than 1% of support requests were to merge user accounts. There is currently a viable workaround that can be used to merge user accounts and will follow the same ticketing process as it does today.
- Admins will not be able to edit multiple accounts at once. In the initial research, none of the admins requested to have this functionality.

# 🗓️ Timeline

Indicate the desired launch date and milestones for the product. These details may not be known outright, and can be flushed out during the development lifecycle.

## Release Schedule

**Target launch date: March 1, 2023**

- Pre-launch marketing: February 15 - March 1
- Post-launch marketing: March 2 - March 10

## Milestones

What are the milestones that will keep product delivery on track?

| **Milestone**                                    | **Due Date**      |
| ------------------------------------------------ | ----------------- |
| User stories & requirements definition completed | November 20, 2022 |
| Initial designs completed                        | December 5, 2022  |
| Initial build completed                          | January 15, 2023  |
| QA completed                                     | February 1, 2023  |
| Usability testing completed                      | February 15, 2023 |
| Start pre-launch marketing campaign              | February 15, 2023 |
| Customer enablement content ready                | February 20, 2023 |
| Product readiness completed                      | February 25, 2023 |
| Product launch                                   | March 1, 2023     |

# Personas & User Scenarios

Who are the target personas for this product, what is the context in which these personas will use the product, and how will these personas use the product?

## Admin

A user who administers the application for an entire team or company. Their user account role type is Admin and have specific permissions.

Users often contact Admins to ask questions about their accounts, change account details, or reset their password. To field these inquiries, an Admin will navigate to the User Account Management view to search for the specific user, view the account details, and then make edits or reset the password as needed. Afterwards, the Admin will save the information.

For security compliance purposes, the Admin is sometimes asked by the Security Team to pull an audit log of changes made on a specific day for a specific user. The Admin will navigate to the User Account Management view to export a plaintext audit log to provide to the Security Team.

---

## Persona 2

_\[Enter description of the persona\]_

_\[Enter the user scenario\]_

---

# Features

Document the key features and requirements that will be included in the product, as well as the features that will NOT be included.

## Features Included

What features are included in this round of product development? Why are they important? What are key requirements? How will the user use and benefit from them?

In the examples below, two types of user stories are demonstrated. Modify to align with the user story format that works best for your team.

**Feature 1**
Search for a user account

- Must have specific permissions
- Be able to search by username or email
- Realtime search

**User Story**
As an admin, I want to be able to search and find a specific user so that I can field questions or changes for a particular user.

**Gherkins**
_Scenario: Admin searches by username or email_
GIVEN that I am on the Account Management Page
WHEN I type in the search box
THEN the list of accounts change in real-time to show results of the search by attempting to match by username or email

_Scenario_: Admin does NOT find a user account when searching
GIVEN that I am on the Account Management Page
WHEN there are no accounts showing in the list because of the search criteria
THEN the system shows text on the page indicating that there are "No accounts found"

---

**Feature 2**
View account details

- Must have specific permissions
- Read-only
- Mask the password

**User Story**
As an admin, I want to be able to view a specific user's account details in read-only mode so that they can answer questions or audit details.

**Gherkins**
_Scenario: Admin views a specific user's account details_
GIVEN that I am on the Account Management Page
WHEN I click on a specific user
THEN I am taken to the Account Details Page in read-only mode where I can see the user's username, first name, last name, masked password, email, and address

_Scenario: Admin exits from the user's account details_
GIVEN that I am on the Account Details Page
WHEN I click the Close button
THEN I am taken back to the Account Management Page in the same state (i.e. filters/search criteria) that it was in last

---

**Feature 3**
Edit account details

- Must have specific permissions
- Reset password
- Edit name, username, email

**User Story**
As an admin, I want to be able to edit a specific user account's details so that I can make changes for a particular user.

**Gherkins**
_Scenario: Admin edits user's account details_
GIVEN that I am on the Account Details Page
WHEN I click on the Edit button
THEN I the Account Details Page is refreshed to edit mode where I can edit the username, first name, last name, email, and address fields; but I am not allowed to edit the password

_Scenario: Admin saves user's account details_
GIVEN that I am in edit mode on the Account Details Page
WHEN I click the Save button
THEN all the changes are saved and the Account Details Page is refreshed to read-only mode

_Scenario: Admin is unable to save user's account details_
GIVEN that I am in edit mode on the Account Details Page
WHEN I click the Save button
THEN if there is an error and something is unable to save, an error message shows, the fields that were not able to save are boxed in a red outline, and the page remains in edit mode

_Scenario: Admin cancels changes to user's account details_
GIVEN that I am in edit mode on the Account Details Page
WHEN I click the Cancel button
THEN no changes are saved and I am taken back to the Account Management Page in the same state (i.e. filters/search criteria) that it was in last

## Features Excluded

What features are NOT included in this round of product development? Why are they not included? Are there plans to include them in a future release?

- **Export in Excel format.** Will be included in the second release. It was determined that this feature was not critical for 80% of customers.
- **Merge user accounts.** This will not be included because less than 1% of support requests were to merge user accounts. Can potentially re-prioritize for a future release.
- **Make edits to multiple accounts at once.** In the initial research, none of the admins requested to have this functionality.

# Release Criteria

What are the criteria necessary for the product to be ready for launch? Consider requirements for each of the sections below.

## Functionality

What criteria must be met to validate that the product works the way it should?

- User must be able to view account details
- User must be able to change their password
- User must be able to change their subscription payment methods

## Usability

What benchmarks must be met to confirm the user can

- Instructional pop-up will show the first time user navigates to the new screen
- Complete a usability test with at least 5 users
- Usability test results must show that user is able to navigate and complete functions with no additional guidance and no errors

## Performance & Reliability

What are specific performance and reliability benchmarks that must be met?

- Page load time <= 2 seconds for every page
- Must handle up to 1 million user accounts
- 99.99% uptime

## Security

What security and compliance standards must be met? Consider maintenance or improvement on security and compliance certifications.

- ISO 27001:2013
- ISO 27017:2015
- ISO 27018:2019
- SOC 2 Type 2 certification
- PCI DSS certification
- GDPR compliance
- CCPA/CPRA compliance
- LGPD compliance
- HIPAA compliance

## Supportability

What requirements must be met to ensure that the product can be efficiently maintained over its entire lifecycle? Consider things like testing, deployment, adaptability, localization, etc.

- Customer Support must be trained on new product features
- New product must be added to the list of supported products in the support ticket form
- Logs must include:
  - Warnings and errors
  - Date, time, user account, and details of every action

# Designs

Include designs by linking out to designs that are stored in other tools or copying images into this page. Continuously update this page as designs are created or updated.

| **Area/Feature**     | **Design**                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation menu      | _\[Link to design\]_                                                                                                                                          |
| View account details | _\[Link to design\]_                                                                                                                                          |
| Edit account details | _\[Link to design\]_                                                                                                                                          |
| Update password      | _\[Link to design\]_                                                                                                                                          |
| Notifications        | ![](https://t20542222.p.clickup-attachments.com/t20542222/51e09058-25f7-46c6-9c3b-889dc59018ab/Square%20Portfolio%20Mockup%20Instagram%20Post%20Template.gif) |
