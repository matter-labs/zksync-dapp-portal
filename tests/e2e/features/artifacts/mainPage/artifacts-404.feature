@artifacts @regression @mainPage @various  
Feature: Artifacts - Incorrect Page - 404

  Background:
    Given Connect Metamask extension with login action

  @id1542
  Scenario: Check artifacts on the 404 page
    Given I am on the Main page
    When I go to page "/a"
    Then Element with "text" "404" should be "visible"
    Then Element with "text" "Page not found: /a" should be "visible"
    Then Element with "text" "Back to Portal" should be "visible"
    Then Element with "text" "Back to Portal" should be "clickable"