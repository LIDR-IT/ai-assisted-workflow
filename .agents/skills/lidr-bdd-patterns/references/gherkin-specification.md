# Complete Gherkin Language Specification

## Gherkin Keywords Reference

### Feature Structure Keywords

**Feature**

- Purpose: Describe the feature being tested
- Usage: `Feature: Brief description of the feature`
- Position: Top-level container for scenarios

**Background**

- Purpose: Define common preconditions for all scenarios in a feature
- Usage: Appears once per feature, before scenarios
- Steps: Can contain Given steps only

**Scenario**

- Purpose: Individual test case
- Usage: `Scenario: Brief description of the test case`
- Structure: Contains Given-When-Then steps

**Scenario Outline**

- Purpose: Template scenario with variable data
- Usage: `Scenario Outline: Template description`
- Requires: Examples table with data

### Step Keywords

**Given**

- Purpose: Set up initial state/preconditions
- Tense: Present tense ("the user is logged in")
- Context: System state, data setup, user context

**When**

- Purpose: Trigger action or event
- Tense: Present tense ("the user clicks submit")
- Action: User action, system event, API call

**Then**

- Purpose: Assert expected outcomes
- Tense: Future/present tense ("the page should display")
- Verification: Observable results, system changes

**And / But**

- Purpose: Continue previous step type
- Usage: `And` for additional steps, `But` for contrasting steps
- Type: Inherits from previous Given/When/Then

### Data Structure Keywords

**Examples**

- Purpose: Provide data for Scenario Outline
- Format: Table with header row and data rows
- Usage: `Examples:` followed by data table

**Table**

- Purpose: Structured data within steps
- Format: Pipe-separated values
- Usage: Inline with Given/When/Then steps

## Syntax Rules

### Indentation

```gherkin
Feature: Top level (no indentation)
  Background: 2 spaces
    Given step: 4 spaces

  Scenario: 2 spaces
    Given step: 4 spaces
    When step: 4 spaces
    Then step: 4 spaces
      And step: 6 spaces
```

### Punctuation

- No trailing periods or punctuation on steps
- Colons after Feature, Background, Scenario, Examples
- Pipe characters for table delimiters

### Line Structure

- One logical step per line
- Keywords at start of line (after indentation)
- Step text follows keyword and space

### Comments

```gherkin
# This is a comment
Feature: User Authentication
  # Comments can appear anywhere
  Scenario: Valid login
    # Even between steps
    Given a registered user
```

## Advanced Gherkin Features

### Data Tables

```gherkin
Given the following users exist:
  | username | email           | role  |
  | john     | john@email.com  | user  |
  | admin    | admin@email.com | admin |
```

### Doc Strings

```gherkin
Given the API receives the following JSON:
  """
  {
    "username": "testuser",
    "password": "securepass"
  }
  """
```

### Tags

```gherkin
@authentication @smoke
Feature: User Login

@positive
Scenario: Valid credentials

@negative @security
Scenario: Invalid credentials
```

### Scenario Outline with Multiple Examples

```gherkin
Scenario Outline: User types
  Given a user with role "<role>"
  When they access "<resource>"
  Then they should see "<result>"

Examples: Standard Users
  | role | resource | result    |
  | user | profile  | allowed   |
  | user | admin    | forbidden |

Examples: Admin Users
  | role  | resource | result  |
  | admin | profile  | allowed |
  | admin | admin    | allowed |
```

## Language Localization

### Spanish Keywords

```gherkin
Característica: Autenticación de usuarios
  Escenario: Credenciales válidas
    Dado un usuario registrado
    Cuando introduce credenciales válidas
    Entonces accede al sistema
```

### Multiple Language Support

Gherkin supports 60+ languages with native keywords:

- English: Given, When, Then
- Spanish: Dado, Cuando, Entonces
- French: Soit, Quand, Alors
- German: Gegeben, Wenn, Dann

## Validation Rules

### Syntax Validation

1. Feature must be first non-comment line
2. Background must come before scenarios
3. Each scenario needs at least one step
4. Steps must follow logical order (Given→When→Then)
5. Examples must have matching columns in Scenario Outline

### Content Validation

1. Steps should be readable by business stakeholders
2. Avoid implementation details in step descriptions
3. Use consistent terminology across scenarios
4. Keep scenarios focused and independent

### Performance Guidelines

1. Limit scenario outline examples to reasonable test data sets
2. Use Background for common setup to reduce duplication
3. Keep feature files focused on single feature area
4. Break large features into multiple files when appropriate

## Integration with Test Frameworks

### Cucumber Integration

```gherkin
# Feature file: login.feature
Feature: User Authentication
  Scenario: Valid login
    Given a user with valid credentials
    When they submit the login form
    Then they are redirected to dashboard
```

### Step Definition Mapping

```java
@Given("a user with valid credentials")
public void userWithValidCredentials() {
    // Implementation
}

@When("they submit the login form")
public void submitLoginForm() {
    // Implementation
}

@Then("they are redirected to dashboard")
public void redirectedToDashboard() {
    // Verification
}
```

## Best Practices

### Declarative vs Imperative

**Declarative (Preferred):**

```gherkin
Given the user is authenticated
When they view their profile
Then personal information is displayed
```

**Imperative (Avoid):**

```gherkin
Given I click the login button
When I enter username and password
Then I click submit
```

### Abstraction Level

**Business Level (Preferred):**

```gherkin
When the user transfers money to another account
Then the transfer is processed successfully
```

**Implementation Level (Avoid):**

```gherkin
When the user clicks the transfer button
Then the API returns status 200
```

### Data Management

**Readable Data (Preferred):**

```gherkin
Given a premium customer with €1000 balance
```

**Technical Data (Avoid):**

```gherkin
Given customer ID 12345 with balance 1000.00
```

## Common Syntax Errors

### Incorrect Keyword Usage

❌ **Wrong:**

```gherkin
Given the user login
When click submit button
Then success page display
```

✅ **Correct:**

```gherkin
Given the user is logged in
When they click the submit button
Then the success page is displayed
```

### Missing Step Types

❌ **Wrong:**

```gherkin
Scenario: User registration
  Given new user data
  When registration form submitted
  # Missing Then step
```

✅ **Correct:**

```gherkin
Scenario: User registration
  Given new user data is available
  When the registration form is submitted
  Then the user account is created
```

### Incorrect Table Format

❌ **Wrong:**

```gherkin
Examples:
username, password, result
john, pass123, success
jane, wrong, failure
```

✅ **Correct:**

```gherkin
Examples:
  | username | password | result  |
  | john     | pass123  | success |
  | jane     | wrong    | failure |
```
