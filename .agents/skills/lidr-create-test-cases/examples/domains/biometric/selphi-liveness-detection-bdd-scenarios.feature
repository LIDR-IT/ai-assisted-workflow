# Selphi Liveness Detection - BDD Test Cases

Feature: Selphi Liveness Detection for Real User Authentication
  As a banking application user
  I want the system to verify that I am a real person during face verification
  So that my account is protected from presentation attacks and unauthorized access

  Background:
    Given the Selphi SDK v4.2.1 is initialized
    And the user has granted camera permissions
    And the user is positioned 18-24 inches from the camera
    And the environment has adequate lighting (>300 lux)

  @critical @security @liveness
  Scenario: Successful liveness detection with live user
    Given a real user is positioned in front of the camera
    And the user follows all liveness challenges correctly
    When the liveness detection process is initiated
    Then the system should detect a live person with confidence ≥95%
    And the liveness score should be ≥0.85
    And the process should complete within 8 seconds
    And no presentation attack should be detected

  @critical @security @photo-attack
  Scenario: Photo attack detection and rejection
    Given a high-resolution photo of an enrolled user is presented to the camera
    And the photo covers the entire camera field of view
    When the liveness detection process is initiated
    Then the system should detect a presentation attack within 3 seconds
    And the liveness score should be ≤0.30
    And the attack detection confidence should be ≥95%
    And the verification should fail with error "PRESENTATION_ATTACK_DETECTED"

  @critical @security @video-replay
  Scenario: Video replay attack detection
    Given a high-quality video of an enrolled user is played on a device screen
    And the video includes natural movements and expressions
    When the liveness detection process is initiated
    Then the system should detect the video replay attack within 4 seconds
    And the attack detection should identify screen characteristics
    And the verification should fail with error "VIDEO_REPLAY_DETECTED"
    And the confidence level should be ≥90%

  @high @security @mask-attack
  Scenario: 3D mask attack detection
    Given a realistic 3D silicone mask of the enrolled user
    And someone wearing the mask attempts verification
    When the liveness detection process is initiated
    Then the system should detect depth inconsistencies within 5 seconds
    And the mask attack should be identified with ≥85% confidence
    And the verification should fail with error "MASK_ATTACK_DETECTED"

  @high @security @deepfake-video
  Scenario: Deepfake video attack detection
    Given a deepfake video generated from the enrolled user's photos
    And the deepfake includes realistic facial movements
    When the liveness detection process is initiated
    Then the system should detect artificial generation artifacts
    And the deepfake should be identified within 6 seconds
    And the confidence level should be ≥80%
    And the verification should fail with error "SYNTHETIC_VIDEO_DETECTED"

  @medium @usability @low-light
  Scenario: Liveness detection in low light conditions
    Given the environment lighting is between 50-200 lux
    And a real user is positioned correctly in front of the camera
    When the liveness detection process is initiated
    Then the system should automatically adjust detection parameters
    And the liveness detection should still achieve ≥90% accuracy
    And the process may take up to 12 seconds
    And clear guidance should be provided if lighting is insufficient

  @medium @usability @movement-challenges
  Scenario: Active liveness with head movement challenges
    Given a real user is ready for liveness verification
    And the system requires head movement for active liveness
    When the user is prompted to "Turn your head slowly to the left"
    And the user follows the instruction correctly
    Then the system should track head movement with ≥95% accuracy
    And the movement should be verified as natural and human-like
    And the challenge should complete within 15 seconds
    And the overall liveness score should increase by ≥0.1

  @medium @usability @blink-detection
  Scenario: Active liveness with blink challenges
    Given a real user is positioned for verification
    And the system requires blink detection for active liveness
    When the user is prompted to "Blink naturally 2-3 times"
    And the user blinks as requested
    Then the system should detect natural blink patterns
    And the blink rate should be within normal human range (12-20 per minute)
    And the blink duration should be 100-300ms per blink
    And the liveness confidence should increase by ≥0.15

  @high @performance @processing-speed
  Scenario: Liveness detection performance under normal conditions
    Given optimal environmental conditions for face detection
    And a real user positioned correctly
    When the liveness detection algorithm processes the video stream
    Then the initial liveness assessment should begin within 2 seconds
    And the preliminary results should be available within 5 seconds
    And the final verification should complete within 8 seconds
    And CPU usage should not exceed 40% during processing

  @medium @compatibility @device-variation
  Scenario Outline: Liveness detection across different device cameras
    Given a <device_type> with <camera_quality> front-facing camera
    And a real user positioned appropriately for the device
    When the liveness detection process runs
    Then the accuracy should meet the minimum threshold for <device_category>
    And the processing time should be within acceptable limits
    And the user experience should remain consistent

    Examples:
      | device_type | camera_quality | device_category | min_accuracy | max_time |
      | High-end smartphone | 12MP+ | premium | 98% | 6s |
      | Mid-range smartphone | 5-8MP | standard | 95% | 8s |
      | Budget smartphone | 2-5MP | basic | 90% | 12s |
      | Tablet | 5-8MP | standard | 95% | 8s |
      | Laptop webcam | 720p-1080p | standard | 92% | 10s |

  @high @security @spoofing-combinations
  Scenario: Combined presentation attack detection
    Given an attacker attempts multiple spoofing methods simultaneously
    And the attack combines photo + screen reflection techniques
    When the comprehensive liveness detection runs
    Then the system should identify multiple attack vectors
    And each attack method should be detected independently
    And the combined confidence should be ≥98%
    And detailed attack analysis should be logged for security monitoring

  @critical @compliance @gdpr-biometric
  Scenario: GDPR compliant biometric processing for liveness
    Given the user has provided explicit consent for biometric processing
    And the liveness detection process captures facial biometric data
    When the verification completes
    Then all biometric templates should be encrypted with AES-256
    And no raw biometric data should be stored permanently
    And the user should be able to withdraw consent at any time
    And all processing should be logged for audit purposes

  @medium @accessibility @visual-impairment
  Scenario: Liveness detection with visual accessibility features
    Given a user with partial visual impairment
    And the device has accessibility features enabled
    When the liveness verification process begins
    Then audio guidance should be provided for positioning
    And voice prompts should guide through liveness challenges
    And increased time allowances should be automatically granted
    And alternative verification methods should be offered if needed

  @high @error-handling @network-interruption
  Scenario: Liveness detection with network interruption
    Given liveness detection is in progress
    And the user has completed 60% of the verification process
    When the network connection is interrupted
    Then the system should maintain local processing state
    And resume verification when connection is restored
    And the user should not need to restart the entire process
    And a clear status message should inform the user of the interruption

  @medium @fraud-prevention @multiple-faces
  Scenario: Multiple face detection and rejection
    Given two people appear in the camera frame simultaneously
    When the liveness detection process begins
    Then the system should detect multiple faces within 2 seconds
    And the verification should be rejected with error "MULTIPLE_FACES_DETECTED"
    And clear guidance should be provided to have only one person in frame
    And the detection confidence should be ≥95%

  @high @quality-gates @threshold-validation
  Scenario Outline: Liveness score threshold validation
    Given a test subject with known liveness characteristics
    When the liveness detection algorithm evaluates the subject
    Then the liveness score should be <expected_range>
    And the classification should be <expected_result>
    And the confidence level should be <min_confidence>

    Examples:
      | subject_type | expected_range | expected_result | min_confidence |
      | Live human | 0.85-1.00 | LIVE | 95% |
      | High-quality photo | 0.00-0.30 | SPOOF | 95% |
      | Video on screen | 0.00-0.35 | SPOOF | 90% |
      | 3D mask | 0.00-0.40 | SPOOF | 85% |
      | Low-quality photo | 0.00-0.20 | SPOOF | 98% |