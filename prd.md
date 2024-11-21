# YouTube Comment Analyzer Chrome Extension Specification

## 1. Project Overview

A Chrome extension that provides advanced analysis and AI-powered insights for YouTube comments, helping content creators and analysts understand audience engagement patterns and sentiment. This extension aims to be the world’s best software in its category by offering comprehensive features while maintaining a lean and efficient structure.

## 2. Target Users

* Everyday users that want to understand the comments
* Content creators and influencers
* Social media managers

## 3. Core Functionalities

### 3.1 Comment Extraction (P0)

#### Find the subscribers of the commenters (Must have)
* Leverage Existing Code: Use code from from <reference/yt-comment-sub-count> for efficient implementation.
* Key features to reuse:
  * Fetch the number of subscribers for each commenter.
* Key features to add:
  * Integrate this information into the comment collection process for further analysis.

#### Get the Commenters’ YouTube Handle and Username
* Leverage Existing Code: Use code from <reference/return-yt-comment-usernames> for efficient implementation.
* Key features to reuse:
  * Extract YouTube handles and actual usernames of commenters.
* Key features to add:
  * Integrate this information into the comment collection process for further analysis.

#### Comment Collection
* Leverage Existing Code: Use code from  <reference/YCS> for efficient implementation
* Key features to reuse:
  * Comment collection logic and API integration
  * Nested reply handling
  * Rate limiting and pagination
* Key features to add:
  * Integrate the above <find the subscribers of the commenters> and <get the commenters’ YouTube handle and username> information into the comment collection process for further analysis.
* Design Custom UI/UX: Optimize the user interface for analysis workflows.

#### Bulk Export Functionality (Must have)
* Leverage Existing Code: Use code from <reference/YCS> for efficient implementation
* Key features to reuse:
  * open a window to show the exported comments
  * export in txt format
* Key features to add:
  * export in csv format
  * export in json format

### 3.2 Basic Analysis (Must have)

#### Comment Volume Metrics
* Calculate total comments, replies, and unique commenters

#### Engagement Statistics
* Analyze likes, dislikes, and other engagement indicators

#### List highest engagement comments
* List the top 3 comments with the highest likes
* List the top 3 comments with the highest replies
* List the top 3 comments whose commenters have the most subscribers.

### 3.3 AI Analysis (P1)

#### Advanced Sentiment Analysis
* Utilize Claude 3.5 Sonnet models for nuanced sentiment scoring

## 4. Documentation

All relevant documentation, including example code snippets and API responses, will be provided to ensure developers have the necessary context for implementation.

## 5. User Interface

#### Right side panel
* Implement a right-side panel that appears when the user clicks on the extension icon.
  
#### Interactive Dashboard
* Provide a user-friendly dashboard with customizable views

#### Settings Access
* Allow users to modify preferences within the extension.

#### Export Options
* Provide options to export data and visualizations in TXT, CSV, and JSON formats.


## 6. Project File Structure

### Project Root
```
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── dashboard.html
├── dashboard.js
├── styles.css
├── utils.js
├── config.js (Development only)
└── README.md
```

### File Explanations

#### 1. manifest.json
* Defines the extension's properties, permissions, and scripts
* Permissions: Include only what's necessary (e.g., tabs, storage, activeTab, https://www.youtube.com/*)
* Content Security Policy (CSP): Implement a strict CSP

#### 2. background.js
* Manages background processes such as message passing and event listeners
* Error Handling: Use chrome.runtime.lastError and console.error

#### 3. content.js
* Injected into YouTube pages to extract comments
* Error Handling: Implement try-catch blocks and specific error logging

#### 4. popup.html
* Contains the HTML structure for the popup UI
* Features: Compact summary, quick actions, settings access

#### 5. popup.js
* Handles logic for the popup UI interactions
* Data Fetching: Retrieves data from chrome.storage or background scripts

#### 6. dashboard.html
* The full-page interface for detailed analysis
* Features: Customizable widgets, filter controls, theme support

#### 7. dashboard.js
* Manages user interactions and data visualization in the dashboard
* Dependencies: Utilize minimal external libraries

#### 8. styles.css
* A single CSS file for styling both the popup and dashboard
* Theme Management: Use CSS variables or classes for dark/light themes

#### 9. utils.js
* Contains utility functions for API calls, data formatting, and configuration access
* Secure Storage Functions: Access data via chrome.storage.local

#### 10. config.js (Development Only)
* Stores placeholder values for configurations during development
* Note: Should not contain sensitive information

#### 11. README.md
* Provides setup instructions and other relevant documentation

### Dependencies

#### External Libraries
* Use minimal libraries to keep the extension lightweight
* Include via CDN links if necessary (e.g., for charts)

#### Chrome APIs
* Utilize chrome.storage, chrome.runtime, chrome.tabs, etc.

## 7. Metrics for Success

### 7.1 Performance Metrics
* Average Analysis Time: Less than 5 seconds
* Extension Load Time: Less than 1 second
* Crash Rate: Less than 0.1%
* API Error Rate: Less than 1%

### 7.2 User Metrics
* Daily Active Users
* Analysis Completion Rate
* Feature Usage Statistics
* User Retention Rate
* User Satisfaction Score

## 8. Additional Requirements

### 8.1 Environment Variables and Configuration

#### Secure Storage
* Store sensitive information securely using chrome.storage.local

#### Development Configurations
* Use config.js with placeholder values

#### Access Control
* Access configurations only through utility functions in utils.js

### 8.2 Error Handling and Logging

#### Comprehensive Error Handling
* Implement try-catch blocks where appropriate

#### Logging
* Use console.error for debugging
* Log errors to chrome.runtime.lastError when applicable

#### User Feedback
* Display user-friendly error messages in the UI

#### Graceful Fallbacks
* Implement fallbacks for API failures

### 8.3 Security

#### API Key Protection
* Never expose API keys or sensitive credentials in source code

#### Input Validation and Sanitization
* Validate and sanitize all inputs and outputs

#### Best Practices
* Follow Chrome extension security best practices

#### Content Security Policy (CSP)
* Define a strict CSP in manifest.json

## 9 Future work

* Real-Time Comment Monitoring (Good to have)
  * Monitor new comments in real-time without manual refresh
