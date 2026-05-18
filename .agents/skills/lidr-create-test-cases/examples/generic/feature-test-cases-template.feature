# {{FEATURE_NAME}} {{TEST_CATEGORY}} - BDD Test Cases

Feature: {{FEATURE_NAME}} for {{USER_GOAL}}
  As a {{USER_ROLE}}
  I want {{USER_DESIRE}}
  So that {{BUSINESS_VALUE}}

  Background:
    Given the {{SYSTEM_NAME}} {{VERSION}} is initialized
    And the user has {{PERMISSIONS_REQUIRED}}
    And {{PRECONDITION_1}}
    And {{PRECONDITION_2}}

  @critical @{{CATEGORY_1}} @{{TAG_1}}
  Scenario: Successful {{OPERATION}} with valid {{DATA_TYPE}}
    Given {{VALID_CONTEXT}}
    And {{ADDITIONAL_CONTEXT}}
    When {{ACTION_PERFORMED}}
    Then the system should {{EXPECTED_OUTCOME_1}} with {{QUALITY_CRITERIA_1}}
    And {{METRIC_1}} should be {{TARGET_VALUE_1}}
    And the process should complete within {{TIME_LIMIT}}
    And {{NEGATIVE_ASSERTION}}

  @critical @{{CATEGORY_2}} @{{ATTACK_TYPE}}
  Scenario: {{THREAT_TYPE}} detection and rejection
    Given {{ATTACK_SETUP}}
    And {{ATTACK_CHARACTERISTICS}}
    When {{ATTACK_EXECUTION}}
    Then the system should detect {{THREAT_INDICATOR}} within {{DETECTION_TIME}}
    And {{METRIC_2}} should be {{TARGET_VALUE_2}}
    And the {{CONFIDENCE_METRIC}} should be {{CONFIDENCE_THRESHOLD}}
    And the {{OPERATION}} should fail with error "{{ERROR_CODE}}"

  @critical @{{CATEGORY_3}} @{{VARIANT_TYPE}}
  Scenario: {{VARIANT_NAME}} detection
    Given {{VARIANT_SETUP}}
    And {{VARIANT_CHARACTERISTICS}}
    When {{VARIANT_EXECUTION}}
    Then the system should detect {{VARIANT_INDICATOR}} within {{DETECTION_TIME}}
    And {{VARIANT_DETECTION}} should identify {{SPECIFIC_CHARACTERISTICS}}
    And the verification should fail with error "{{VARIANT_ERROR_CODE}}"
    And the confidence level should be {{CONFIDENCE_LEVEL}}

  @high @{{CATEGORY_4}} @{{COMPLEX_SCENARIO}}
  Scenario: {{COMPLEX_SCENARIO_NAME}} detection
    Given {{COMPLEX_SETUP}}
    And {{COMPLEX_CONDITIONS}}
    When {{COMPLEX_EXECUTION}}
    Then the system should detect {{COMPLEX_INDICATORS}} within {{DETECTION_TIME}}
    And {{COMPLEX_METRIC}} should be identified with {{ACCURACY_THRESHOLD}} confidence
    And the verification should fail with error "{{COMPLEX_ERROR_CODE}}"

  @high @{{CATEGORY_5}} @{{SYNTHETIC_TYPE}}
  Scenario: {{SYNTHETIC_SCENARIO}} detection
    Given {{SYNTHETIC_SETUP}}
    And {{SYNTHETIC_CONDITIONS}}
    When {{SYNTHETIC_EXECUTION}}
    Then the system should detect {{SYNTHETIC_INDICATORS}}
    And {{SYNTHETIC_DETECTION}} should be identified within {{DETECTION_TIME}}
    And the confidence level should be {{SYNTHETIC_CONFIDENCE}}
    And the verification should fail with error "{{SYNTHETIC_ERROR_CODE}}"

  @medium @usability @{{CONDITION_TYPE}}
  Scenario: {{OPERATION}} in {{CHALLENGING_CONDITIONS}}
    Given the {{ENVIRONMENTAL_FACTOR}} is {{CONDITION_RANGE}}
    And {{VALID_SUBJECT}} is positioned correctly
    When {{OPERATION_EXECUTION}}
    Then the system should automatically adjust {{PARAMETER_TYPE}}
    And {{OPERATION_METRIC}} should still achieve {{ACCURACY_TARGET}} accuracy
    And the process may take up to {{EXTENDED_TIME_LIMIT}}
    And clear guidance should be provided if {{CONDITIONS_INSUFFICIENT}}

  @medium @usability @{{INTERACTION_TYPE}}
  Scenario: Active {{OPERATION}} with {{CHALLENGE_TYPE}} challenges
    Given {{SUBJECT_READY_STATE}}
    And the system requires {{CHALLENGE_REQUIREMENT}}
    When the user is prompted to "{{INSTRUCTION_TEXT}}"
    And the user follows the instruction correctly
    Then the system should track {{TRACKED_METRIC}} with {{TRACKING_ACCURACY}} accuracy
    And {{VALIDATION_CRITERIA}} should be verified as {{EXPECTED_PATTERN}}
    And the challenge should complete within {{CHALLENGE_TIME_LIMIT}}
    And the overall {{SCORE_METRIC}} should increase by {{SCORE_IMPROVEMENT}}

  @medium @usability @{{DETECTION_TYPE}}
  Scenario: Active {{OPERATION}} with {{BIOMETRIC_CHALLENGE}} challenges
    Given {{SUBJECT_POSITIONED_STATE}}
    And the system requires {{BIOMETRIC_DETECTION}} for active {{OPERATION}}
    When the user is prompted to "{{BIOMETRIC_INSTRUCTION}}"
    And the user {{PERFORMS_ACTION}} as requested
    Then the system should detect {{NATURAL_PATTERNS}}
    And {{BIOMETRIC_RATE}} should be within normal {{SUBJECT_TYPE}} range ({{NORMAL_RANGE}})
    And {{BIOMETRIC_DURATION}} should be {{DURATION_RANGE}} per {{ACTION_UNIT}}
    And the {{CONFIDENCE_METRIC}} should increase by {{CONFIDENCE_IMPROVEMENT}}

  @high @performance @{{PROCESSING_TYPE}}
  Scenario: {{OPERATION}} performance under normal conditions
    Given optimal {{ENVIRONMENTAL_CONDITIONS}} for {{DETECTION_PROCESS}}
    And {{VALID_SUBJECT}} positioned correctly
    When the {{ALGORITHM_NAME}} processes the {{INPUT_STREAM}}
    Then the initial {{ASSESSMENT_TYPE}} should begin within {{INITIAL_TIME}}
    And the preliminary results should be available within {{PRELIMINARY_TIME}}
    And the final verification should complete within {{FINAL_TIME}}
    And {{RESOURCE_USAGE}} should not exceed {{RESOURCE_LIMIT}} during processing

  @medium @compatibility @{{VARIATION_TYPE}}
  Scenario Outline: {{OPERATION}} across different {{PLATFORM_TYPE}}
    Given a <{{PLATFORM_VARIABLE}}> with <{{SPEC_VARIABLE}}> {{HARDWARE_COMPONENT}}
    And {{VALID_SUBJECT}} positioned appropriately for the {{PLATFORM_TYPE}}
    When the {{OPERATION_PROCESS}} runs
    Then the accuracy should meet the minimum threshold for <{{CATEGORY_VARIABLE}}>
    And the processing time should be within acceptable limits
    And the user experience should remain consistent

    Examples:
      | {{PLATFORM_VARIABLE}} | {{SPEC_VARIABLE}} | {{CATEGORY_VARIABLE}} | {{MIN_ACCURACY_VAR}} | {{MAX_TIME_VAR}} |
      | {{PLATFORM_1}} | {{SPEC_1}} | {{CATEGORY_1}} | {{ACCURACY_1}} | {{TIME_1}} |
      | {{PLATFORM_2}} | {{SPEC_2}} | {{CATEGORY_2}} | {{ACCURACY_2}} | {{TIME_2}} |
      | {{PLATFORM_3}} | {{SPEC_3}} | {{CATEGORY_3}} | {{ACCURACY_3}} | {{TIME_3}} |
      | {{PLATFORM_4}} | {{SPEC_4}} | {{CATEGORY_4}} | {{ACCURACY_4}} | {{TIME_4}} |
      | {{PLATFORM_5}} | {{SPEC_5}} | {{CATEGORY_5}} | {{ACCURACY_5}} | {{TIME_5}} |

  @high @{{CATEGORY_6}} @{{COMBINATION_TYPE}}
  Scenario: Combined {{THREAT_TYPE}} detection
    Given an attacker attempts multiple {{ATTACK_METHODS}} simultaneously
    And the attack combines {{METHOD_1}} + {{METHOD_2}} techniques
    When the comprehensive {{DETECTION_SYSTEM}} runs
    Then the system should identify multiple {{ATTACK_VECTORS}}
    And each {{ATTACK_METHOD}} should be detected independently
    And the combined confidence should be {{COMBINED_CONFIDENCE}}
    And detailed {{ANALYSIS_TYPE}} should be logged for {{MONITORING_PURPOSE}}

  @critical @compliance @{{REGULATION_TYPE}}
  Scenario: {{REGULATION_NAME}} compliant {{DATA_TYPE}} processing
    Given the user has provided explicit consent for {{DATA_PROCESSING}}
    And the {{OPERATION_PROCESS}} captures {{SENSITIVE_DATA}}
    When the verification completes
    Then all {{DATA_ARTIFACTS}} should be encrypted with {{ENCRYPTION_STANDARD}}
    And no {{RAW_DATA}} should be stored permanently
    And the user should be able to withdraw consent at any time
    And all processing should be logged for audit purposes

  @medium @accessibility @{{ACCESSIBILITY_TYPE}}
  Scenario: {{OPERATION}} with {{ACCESSIBILITY_FEATURE}}
    Given a user with {{IMPAIRMENT_TYPE}}
    And the device has accessibility features enabled
    When the {{VERIFICATION_PROCESS}} begins
    Then {{GUIDANCE_TYPE}} should be provided for {{ASSISTANCE_AREA}}
    And {{INSTRUCTION_TYPE}} should guide through {{PROCESS_CHALLENGES}}
    And increased time allowances should be automatically granted
    And alternative {{VERIFICATION_METHODS}} should be offered if needed

  @high @error-handling @{{ERROR_SCENARIO}}
  Scenario: {{OPERATION}} with {{ERROR_TYPE}}
    Given {{OPERATION_IN_PROGRESS}}
    And the user has completed {{PROGRESS_PERCENTAGE}} of the verification process
    When {{ERROR_TRIGGER}} occurs
    Then the system should maintain {{STATE_TYPE}} processing state
    And resume verification when {{RECOVERY_CONDITION}}
    And the user should not need to restart the entire process
    And a clear status message should inform the user of {{ERROR_STATUS}}

  @medium @{{PREVENTION_TYPE}} @{{DETECTION_SCENARIO}}
  Scenario: {{DETECTION_TARGET}} detection and rejection
    Given {{MULTIPLE_SUBJECTS}} appear in the {{INPUT_AREA}} simultaneously
    When the {{DETECTION_PROCESS}} begins
    Then the system should detect {{MULTIPLE_INDICATORS}} within {{DETECTION_TIME}}
    And the verification should be rejected with error "{{MULTIPLE_ERROR_CODE}}"
    And clear guidance should be provided to {{CORRECTIVE_ACTION}}
    And the detection confidence should be {{DETECTION_CONFIDENCE}}

  @high @{{QUALITY_TYPE}} @{{THRESHOLD_TYPE}}
  Scenario Outline: {{METRIC_NAME}} threshold validation
    Given a test subject with known {{CHARACTERISTICS}}
    When the {{ALGORITHM_NAME}} evaluates the subject
    Then the {{SCORE_TYPE}} should be <{{EXPECTED_RANGE_VAR}}>
    And the classification should be <{{EXPECTED_RESULT_VAR}}>
    And the confidence level should be <{{MIN_CONFIDENCE_VAR}}>

    Examples:
      | {{SUBJECT_TYPE_VAR}} | {{EXPECTED_RANGE_VAR}} | {{EXPECTED_RESULT_VAR}} | {{MIN_CONFIDENCE_VAR}} |
      | {{SUBJECT_1}} | {{RANGE_1}} | {{RESULT_1}} | {{CONF_1}} |
      | {{SUBJECT_2}} | {{RANGE_2}} | {{RESULT_2}} | {{CONF_2}} |
      | {{SUBJECT_3}} | {{RANGE_3}} | {{RESULT_3}} | {{CONF_3}} |
      | {{SUBJECT_4}} | {{RANGE_4}} | {{RESULT_4}} | {{CONF_4}} |
      | {{SUBJECT_5}} | {{RANGE_5}} | {{RESULT_5}} | {{CONF_5}} |