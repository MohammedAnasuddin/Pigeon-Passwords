import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react'; // Combined imports here
import App from './App';

describe("App Component", () => {
  test("displays error if tag contains only symbols", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter words and press Enter");

    // Simulate adding a tag with only symbols
    fireEvent.change(input, { target: { value: "!!!" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Check for error message
    expect(screen.getByText("Tags cannot contain only symbols")).toBeInTheDocument();
  });

  test("allows a valid tag to be added", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter words and press Enter");

    // Add a valid word
    fireEvent.change(input, { target: { value: "secure" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Check if the tag was added successfully
    expect(screen.getByText("secure")).toBeInTheDocument();
  });

  test("prevents adding more than 5 tags", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter words and press Enter");

    const tags = ["one", "two", "three", "four", "five"];
    tags.forEach(tag => {
      fireEvent.change(input, { target: { value: tag } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    fireEvent.change(input, { target: { value: "extra" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Check for error
    expect(screen.getByText("You can only add up to 5 words")).toBeInTheDocument();
  });




  test('UI: Should display a clear error message when no words are entered', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Enter words and press Enter');
    const generatePasswordButton = screen.getByText('Generate Password');

    // Act
    fireEvent.change(inputElement, { target: { value: '' } }); // Clear the input
    fireEvent.click(generatePasswordButton); // Click the generate password button

    // Assert
    expect(screen.getByText('Enter words to proceed')).toBeInTheDocument();
  });

  

 
});
